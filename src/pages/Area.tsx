import {
  ArcType,
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
  Color,
  PolygonHierarchy,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType
} from 'cesium'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Painel } from '../components/Painel.tsx'
import { Tela } from '../components/Tela.tsx'
import { CANTOS_MINIMOS, type Canto, hectaresDe } from '../domain/validacao.ts'
import { useCesium } from '../hooks/useCesium.ts'
import { useFluxo } from '../hooks/useFluxo.ts'
import { useTexto } from '../hooks/useTexto.ts'
import { useIdioma } from '../i18n/index.ts'
import { ondeEstou } from '../lib/aparelho.ts'
import { numero, preencher } from '../lib/formato.ts'

type Etapa = 'globo' | 'descendo' | 'marcando'

const RAIO_DA_TERRA = 6_378_137
const ALTURA_DE_POUSO = 1500
const RECUO_M = 900
const CASA_DO_GLOBO = Cartesian3.fromDegrees(-45, -12, 15_000_000)

const grau = (rad: number, positivo: string, negativo: string): string => {
  const v = CesiumMath.toDegrees(rad)
  const a = Math.abs(v)
  const inteiro = Math.floor(a)
  const minutos = Math.round((a - inteiro) * 60)
  return `${inteiro}°${String(minutos).padStart(2, '0')}'${v >= 0 ? positivo : negativo}`
}

export const Area = () => {
  const t = useTexto()
  const idioma = useIdioma((e) => e.idioma)
  const navegar = useNavigate()
  const definirArea = useFluxo((e) => e.definirArea)
  const { caixa, viewer } = useCesium()

  const [etapa, setEtapa] = useState<Etapa>('globo')
  const [leitura, setLeitura] = useState({ lat: '—', lon: '—', alt: '—' })
  const [quantosCantos, setQuantosCantos] = useState(0)
  const [hectares, setHectares] = useState(0)
  const [procurando, setProcurando] = useState(false)
  const [recado, setRecado] = useState<string | null>(null)

  const mira = useRef<HTMLDivElement>(null)
  const cantos = useRef<Cartesian3[]>([])
  const girando = useRef(true)
  const etapaAgora = useRef<Etapa>('globo')

  useEffect(() => {
    etapaAgora.current = etapa
  }, [etapa])

  // a mira fica no centro do canvas porque e la que o Cesium poe o centro do globo.
  // fora dali voce mira na borda da esfera, de raspao, e o zoom puxa pra outro ponto
  const pixelDaMira = useCallback(() => {
    if (!viewer) return null
    const r = mira.current?.getBoundingClientRect()
    const c = viewer.canvas.getBoundingClientRect()
    if (!r) return null
    return new Cartesian2(r.left - c.left + r.width / 2, r.top - c.top + r.height / 2)
  }, [viewer])

  useEffect(() => {
    if (!viewer) return
    const cena = viewer.scene

    cena.camera.setView({ destination: CASA_DO_GLOBO })

    viewer.entities.add({
      polygon: {
        hierarchy: new CallbackProperty(
          () =>
            cantos.current.length > 2
              ? new PolygonHierarchy([...cantos.current])
              : undefined,
          false
        ),
        material: Color.fromBytes(207, 226, 250, 40),
        outline: false
      }
    })

    // sem clampToGround de proposito: com ponto repetido ele estoura e derruba a
    // renderizacao inteira. os pontos ja vem da superficie, entao nao precisa
    viewer.entities.add({
      polyline: {
        positions: new CallbackProperty(() => {
          const lista = cantos.current
          if (lista.length < 2) return undefined
          return lista.length > 2 ? [...lista, lista[0]] : [...lista]
        }, false),
        width: 2,
        arcType: ArcType.NONE,
        material: Color.WHITE
      }
    })

    const aoParar = () => {
      girando.current = false
    }
    viewer.canvas.addEventListener('pointerdown', aoParar)
    viewer.canvas.addEventListener('wheel', aoParar)

    const remover = cena.postUpdate.addEventListener(() => {
      if (girando.current) cena.camera.rotate(Cartesian3.UNIT_Z, -0.0016)

      const altura = cena.camera.positionCartographic.height
      const alt =
        altura > 9000 ? `${Math.round(altura / 1000)} km` : `${Math.round(altura)} m`

      if (etapaAgora.current === 'marcando') {
        setLeitura((antes) => (antes.alt === alt ? antes : { ...antes, alt }))
        return
      }

      const alvo = pixelDaMira()
      const ponto = alvo ? cena.camera.pickEllipsoid(alvo, cena.globe.ellipsoid) : undefined
      if (!ponto) {
        setLeitura({ lat: '—', lon: '—', alt })
        return
      }
      const c = Cartographic.fromCartesian(ponto)
      setLeitura({
        lat: grau(c.latitude, 'N', 'S'),
        lon: grau(c.longitude, 'L', 'O'),
        alt
      })
    })

    const cliques = new ScreenSpaceEventHandler(viewer.canvas)
    cliques.setInputAction((mov: ScreenSpaceEventHandler.PositionedEvent) => {
      if (etapaAgora.current !== 'marcando') return
      const ponto = cena.camera.pickEllipsoid(mov.position, cena.globe.ellipsoid)
      if (!ponto) return

      cantos.current = [...cantos.current, ponto]
      viewer.entities.add({
        position: ponto,
        point: {
          pixelSize: 9,
          color: Color.WHITE,
          outlineColor: Color.fromBytes(5, 10, 18, 230),
          outlineWidth: 2
        }
      })

      setQuantosCantos(cantos.current.length)
      setHectares(hectaresDe(emGraus(cantos.current)))
    }, ScreenSpaceEventType.LEFT_CLICK)

    return () => {
      // o viewer pode ja ter sido destruido pelo useCesium. mexer nele depois
      // disso derruba a pagina inteira com "cannot read canvas"
      if (!viewer.isDestroyed()) {
        viewer.canvas.removeEventListener('pointerdown', aoParar)
        viewer.canvas.removeEventListener('wheel', aoParar)
        remover()
      }
      if (!cliques.isDestroyed()) cliques.destroy()
    }
  }, [viewer, pixelDaMira])

  const limpar = () => {
    if (!viewer) return
    for (const entidade of [...viewer.entities.values]) {
      if (entidade.point) viewer.entities.remove(entidade)
    }
    cantos.current = []
    setQuantosCantos(0)
    setHectares(0)
  }

  const descer = () => {
    if (!viewer) return
    const cena = viewer.scene
    girando.current = false

    // ja esta perto do chao: nao tem o que descer, so entra no modo de marcar.
    // antes ele afastava e reaproximava, que era o que parecia bug
    if (cena.camera.positionCartographic.height <= 4000) {
      setEtapa('marcando')
      return
    }

    const alvo = pixelDaMira()
    const ponto = alvo ? cena.camera.pickEllipsoid(alvo, cena.globe.ellipsoid) : undefined
    if (!ponto) return

    const c = Cartographic.fromCartesian(ponto)
    setEtapa('descendo')

    cena.camera.flyTo({
      // o recuo vai em metros convertidos pra radiano. subtrair direto da latitude
      // em radianos dava 25 km de desvio, nao 900 m
      destination: Cartesian3.fromRadians(
        c.longitude,
        c.latitude - RECUO_M / RAIO_DA_TERRA,
        ALTURA_DE_POUSO
      ),
      orientation: { heading: 0, pitch: CesiumMath.toRadians(-45), roll: 0 },
      duration: 6,
      complete: () => setEtapa('marcando')
    })
  }

  const voltarProGlobo = () => {
    if (!viewer) return
    limpar()
    setEtapa('globo')
    viewer.scene.camera.flyTo({
      destination: CASA_DO_GLOBO,
      duration: 3,
      complete: () => {
        girando.current = true
      }
    })
  }

  // a coordenada serve pra girar o globo ate voce e morre aqui: nao vai pra URL,
  // nao vai pra log e nao e guardada em lugar nenhum
  const meEncontrar = async () => {
    if (!viewer) return
    setProcurando(true)
    setRecado(null)

    const achou = await ondeEstou()
    setProcurando(false)

    if (!achou.ok) {
      const base = achou.motivo === 'negado' ? t.area.negado : t.area.semLocal
      setRecado(achou.detalhe ? `${base} (${achou.detalhe})` : base)
      return
    }

    girando.current = false
    viewer.scene.camera.flyTo({
      destination: Cartesian3.fromDegrees(achou.onde.lon, achou.onde.lat, 120_000),
      duration: 2.5
    })
  }

  const confirmar = () => {
    if (quantosCantos < CANTOS_MINIMOS) return
    definirArea(emGraus(cantos.current))
    navegar('/sol')
  }

  const marcando = etapa === 'marcando'
  const podeConfirmar = quantosCantos >= CANTOS_MINIMOS

  const titulo =
    etapa === 'globo'
      ? t.area.girar
      : etapa === 'descendo'
        ? t.area.chegando
        : t.area.marcar

  return (
    <Tela estado={t.area.passo}>
      <div ref={caixa} className="absolute inset-x-0 top-0 bottom-[var(--painel,0px)]" />

      <div
        ref={mira}
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 z-[3] size-24 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
          etapa === 'globo' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ top: 'calc((100% - var(--painel, 0px)) / 2)' }}
      >
        <svg viewBox="0 0 96 96" className="size-full" aria-hidden="true">
          <g stroke="#fff" strokeWidth="1.6" fill="none" opacity=".9">
            <path d="M1 15 L1 1 L15 1" />
            <path d="M81 1 L95 1 L95 15" />
            <path d="M95 81 L95 95 L81 95" />
            <path d="M15 95 L1 95 L1 81" />
          </g>
          <circle
            cx="48"
            cy="48"
            r="17"
            fill="none"
            stroke="#fff"
            strokeWidth="1"
            opacity=".5"
          />
          <g stroke="#fff" strokeWidth="1" opacity=".85">
            <line x1="48" y1="20" x2="48" y2="34" />
            <line x1="48" y1="62" x2="48" y2="76" />
            <line x1="20" y1="48" x2="34" y2="48" />
            <line x1="62" y1="48" x2="76" y2="48" />
          </g>
          <circle cx="48" cy="48" r="2.6" fill="#fff" />
        </svg>
      </div>

      <Painel>
        <p className="font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.area.passo}
        </p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-[#eef3fb]">
          {titulo}
        </h1>

        <div className="mt-4 grid grid-cols-3 gap-px border border-[#22334a] bg-[#22334a]">
          {(marcando
            ? ([
                [String(quantosCantos), t.area.cantos],
                [quantosCantos > 2 ? numero(idioma, hectares, 1) : '—', t.area.hectares],
                [leitura.alt, t.area.altitudeCamera]
              ] as const)
            : ([
                [leitura.lat, t.area.latitude],
                [leitura.lon, t.area.longitude],
                [leitura.alt, t.area.altitudeCamera]
              ] as const)
          ).map(([valor, rotulo]) => (
            <div key={rotulo} className="flex flex-col gap-1 bg-[#070d17] px-3 py-3">
              <span className="font-mono text-base text-[#d5e4f7]">{valor}</span>
              <span className="text-[10px] text-[#66788f]">{rotulo}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[12.5px] leading-relaxed text-[#8b9cb6]">
          {marcando ? t.area.dicaMarcar : t.area.dicaGirar}
        </p>

        {marcando ? (
          <>
            <button
              type="button"
              onClick={confirmar}
              disabled={!podeConfirmar}
              className="mt-4 block w-full rounded-sm bg-[#dfe9f8] py-4 text-sm font-bold text-[#06101d] disabled:cursor-default disabled:bg-[#232c3a] disabled:text-[#6f7f95]"
            >
              {podeConfirmar
                ? t.area.confirmar
                : preencher(t.area.faltam, { n: CANTOS_MINIMOS - quantosCantos })}
            </button>
            <button
              type="button"
              onClick={limpar}
              className="mt-3 block w-full rounded-sm border border-[#3c536e] py-4 text-sm text-[#eef3fb]"
            >
              {t.area.apagar}
            </button>
            <button
              type="button"
              onClick={voltarProGlobo}
              className="mt-3 block w-full py-2 text-[13px] text-[#8b9cb6]"
            >
              {t.area.voltarProGlobo}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={descer}
              disabled={etapa === 'descendo'}
              className="mt-4 block w-full rounded-sm bg-[#dfe9f8] py-4 text-sm font-bold text-[#06101d] disabled:cursor-default disabled:bg-[#232c3a] disabled:text-[#6f7f95]"
            >
              {t.area.descer}
            </button>
            <button
              type="button"
              onClick={meEncontrar}
              disabled={procurando}
              className="mt-3 block w-full rounded-sm border border-[#3c536e] py-4 text-sm text-[#eef3fb] disabled:text-[#6f7f95]"
            >
              {procurando ? t.area.procurando : t.area.meEncontrar}
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-[#64738c]" role="status">
              {recado ?? t.area.aviso}
            </p>
          </>
        )}
      </Painel>
    </Tela>
  )
}

const emGraus = (pontos: readonly Cartesian3[]): Canto[] =>
  pontos.map((p) => {
    const c = Cartographic.fromCartesian(p)
    return [CesiumMath.toDegrees(c.longitude), CesiumMath.toDegrees(c.latitude)] as Canto
  })

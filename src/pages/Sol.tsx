import {
  ArcType,
  CallbackProperty,
  Cartesian3,
  Math as CesiumMath,
  Color,
  JulianDate,
  Matrix4,
  PolygonHierarchy,
  PolylineOutlineMaterialProperty,
  ShadowMode,
  TimeInterval,
  Transforms
} from 'cesium'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Painel } from '../components/Painel.tsx'
import { Tela } from '../components/Tela.tsx'
import { comprimentoDaSombra } from '../domain/incidencia.ts'
import type { Canto } from '../domain/validacao.ts'
import { useCesium } from '../hooks/useCesium.ts'
import { useFluxo } from '../hooks/useFluxo.ts'
import { useTexto } from '../hooks/useTexto.ts'
import { useIdioma } from '../i18n/index.ts'
import { numero } from '../lib/formato.ts'
import { acenderChao, centroDe, quadroLocal } from '../scene/cesium.ts'
import {
  direcaoDoSol,
  elevacaoDe,
  horaSolarDe,
  noDomo,
  nomeDoRumo,
  rumoDaSombraDe
} from '../scene/sol.ts'

const DIA = '2026-09-18'
const RAIO_DO_DOMO = 1700
const SEGUNDOS_DE_PASSAGEM = 5
const MINUTOS_NO_DIA = 1440
const ALTURA_DA_HASTE = 60

const CANTOS_DE_DEMONSTRACAO: Canto[] = [
  [71.9173, 27.4742],
  [71.9297, 27.4742],
  [71.9297, 27.4798],
  [71.9173, 27.4798]
]

export const Sol = () => {
  const t = useTexto()
  const idioma = useIdioma((e) => e.idioma)
  const navegar = useNavigate()
  const area = useFluxo((e) => e.area)
  const { caixa, viewer } = useCesium()

  const [minuto, setMinuto] = useState(0)
  const [rodando, setRodando] = useState(true)
  const [leitura, setLeitura] = useState({ hora: '—', elevacao: '—', rumo: '—' })

  const minutoAgora = useRef(0)
  const arrastando = useRef(false)

  const cantos = area?.cantos ?? CANTOS_DE_DEMONSTRACAO
  const hectares = area?.hectares ?? 12.4

  useEffect(() => {
    if (!viewer) return
    let vivo = true

    const centro = centroDe(cantos)
    const centroCart = Cartesian3.fromDegrees(centro.lon, centro.lat, 0)
    const { enu, paraLocal } = quadroLocal(centroCart)

    const cena = viewer.scene
    if (cena.skyAtmosphere) cena.skyAtmosphere.show = true
    viewer.shadows = true
    cena.shadowMap.softShadows = true
    cena.shadowMap.maximumDistance = 8000

    const fuso = horaSolarDe(centro.lon)
    const inicio = JulianDate.addHours(
      JulianDate.fromIso8601(`${DIA}T00:00:00Z`),
      -fuso,
      new JulianDate()
    )

    const fim = JulianDate.addHours(inicio, 24, new JulianDate())

    const emMinuto = (m: number) => JulianDate.addMinutes(inicio, m, new JulianDate())

    // sem isto o computeIcrfToFixedMatrix devolve undefined e a conta cai no TEME,
    // que erra a posicao do Sol o bastante pra inverter o lado da sombra ao meio-dia
    const prontos = Transforms.preloadIcrfFixed(
      new TimeInterval({ start: inicio, stop: fim })
    )

    // o caminho do dia inteiro, de 10 em 10 minutos, so o trecho acima do horizonte
    const caminho: { minuto: number; ponto: Cartesian3 }[] = []

    const montarCaminho = () => {
      caminho.length = 0
      for (let m = 0; m <= MINUTOS_NO_DIA; m += 10) {
        const direcao = direcaoDoSol(emMinuto(m), paraLocal)
        if (direcao.z > 0)
          caminho.push({ minuto: m, ponto: noDomo(direcao, enu, RAIO_DO_DOMO) })
      }
    }

    montarCaminho()
    prontos.then(() => {
      if (!vivo || viewer.isDestroyed()) return
      montarCaminho()
      for (const marca of caminho) {
        if (marca.minuto % 60) continue
        viewer.entities.add({
          position: marca.ponto,
          point: {
            pixelSize: 4,
            color: Color.fromBytes(255, 255, 255, 191),
            outlineColor: Color.fromBytes(10, 15, 26, 178),
            outlineWidth: 1
          }
        })
      }
    })

    // linha clara com contorno escuro. so a clara some no ceu de dia, so a escura
    // some no chao. as duas juntas leem nos dois
    viewer.entities.add({
      polyline: {
        positions: new CallbackProperty(() => caminho.map((p) => p.ponto), false),
        width: 2.5,
        arcType: ArcType.NONE,
        material: new PolylineOutlineMaterialProperty({
          color: Color.fromBytes(217, 230, 250, 115),
          outlineColor: Color.fromBytes(10, 15, 26, 140),
          outlineWidth: 2
        })
      }
    })

    viewer.entities.add({
      polyline: {
        positions: new CallbackProperty(() => {
          const ate = caminho
            .filter((p) => p.minuto <= minutoAgora.current)
            .map((p) => p.ponto)
          return ate.length > 1 ? ate : undefined
        }, false),
        width: 5,
        arcType: ArcType.NONE,
        material: new PolylineOutlineMaterialProperty({
          color: Color.fromBytes(255, 255, 255, 250),
          outlineColor: Color.fromBytes(10, 15, 26, 204),
          outlineWidth: 2
        })
      }
    })

    const direcaoAgora = () => direcaoDoSol(emMinuto(minutoAgora.current), paraLocal)

    viewer.entities.add({
      position: new CallbackProperty(() => {
        const d = direcaoAgora()
        return d.z > 0 ? noDomo(d, enu, RAIO_DO_DOMO) : undefined
      }, false) as unknown as Cartesian3,
      point: {
        pixelSize: 13,
        color: Color.WHITE,
        outlineColor: Color.fromBytes(255, 255, 255, 89),
        outlineWidth: 6
      }
    })

    // a haste de referencia e a sombra dela. e o jeito honesto de ler o rumo: o
    // comprimento vem de 1/tan(altura do Sol)
    viewer.entities.add({
      position: Cartesian3.fromDegrees(centro.lon, centro.lat, ALTURA_DA_HASTE / 2),
      cylinder: {
        length: ALTURA_DA_HASTE,
        topRadius: 1.2,
        bottomRadius: 1.2,
        material: Color.fromBytes(237, 245, 255, 242),
        shadows: ShadowMode.ENABLED
      }
    })

    const baseDaSombra = Cartesian3.fromDegrees(centro.lon, centro.lat, 2)
    viewer.entities.add({
      polyline: {
        positions: new CallbackProperty(() => {
          const d = direcaoAgora()
          if (d.z <= 0.02) return undefined
          // com menos de 12 m a linha degenera e o Cesium estoura, dai o piso
          const bruto = comprimentoDaSombra(ALTURA_DA_HASTE, elevacaoDe(d))
          const comprimento = Math.max(12, Math.min(bruto, 2400))
          const ponta = Matrix4.multiplyByPoint(
            enu,
            new Cartesian3(-d.x * comprimento, -d.y * comprimento, 2),
            new Cartesian3()
          )
          return [baseDaSombra, ponta]
        }, false),
        width: 4,
        arcType: ArcType.NONE,
        material: Color.fromBytes(15, 20, 33, 230)
      }
    })

    viewer.entities.add({
      polygon: {
        hierarchy: new PolygonHierarchy(
          cantos.map(([lon, lat]) => Cartesian3.fromDegrees(lon, lat, 0))
        ),
        material: Color.fromBytes(207, 226, 250, 26),
        outline: true,
        outlineColor: Color.WHITE,
        height: 0
      }
    })

    cena.camera.setView({
      destination: Cartesian3.fromDegrees(centro.lon, centro.lat - 0.021, 1250),
      orientation: { heading: 0, pitch: CesiumMath.toRadians(-32), roll: 0 }
    })

    const remover = cena.postUpdate.addEventListener(() => {
      const d = direcaoAgora()
      const elevacao = elevacaoDe(d)
      const graus = (elevacao * 180) / Math.PI
      const m = minutoAgora.current

      acenderChao(viewer, elevacao)

      setLeitura({
        hora: `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`,
        elevacao: `${graus.toFixed(0)}°`,
        rumo:
          graus > 0
            ? `${Math.round(rumoDaSombraDe(d))}° ${nomeDoRumo(rumoDaSombraDe(d))}`
            : '—'
      })
    })

    return () => {
      vivo = false
      if (!viewer.isDestroyed()) remover()
    }
  }, [viewer, cantos])

  // a passagem das 24 horas em 5 segundos, depois a linha do tempo destrava
  useEffect(() => {
    if (!rodando) return
    let pedido = 0
    let anterior = 0

    const passo = (agora: number) => {
      const dt = anterior ? (agora - anterior) / 1000 : 0
      anterior = agora
      const proximo = Math.min(
        MINUTOS_NO_DIA,
        minutoAgora.current + (dt / SEGUNDOS_DE_PASSAGEM) * MINUTOS_NO_DIA
      )
      minutoAgora.current = proximo
      setMinuto(proximo)
      if (proximo >= MINUTOS_NO_DIA) {
        setRodando(false)
        return
      }
      pedido = requestAnimationFrame(passo)
    }

    pedido = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(pedido)
  }, [rodando])

  const rodarDeNovo = () => {
    minutoAgora.current = 0
    setMinuto(0)
    setRodando(true)
  }

  const arrastar = (valor: number) => {
    minutoAgora.current = valor
    setMinuto(valor)
  }

  return (
    <Tela estado={`${t.comum.areaMarcada} ${numero(idioma, hectares, 1)} ha`}>
      <div ref={caixa} className="absolute inset-x-0 top-0 bottom-[var(--painel,0px)]" />

      <Painel>
        <p className="font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.sol.passo}
        </p>
        <h1 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-[#eef3fb]">
          {rodando ? t.sol.titulo : t.sol.terminou}
        </h1>

        <div className="mt-3.5 grid grid-cols-3 gap-px border border-[#22334a] bg-[#22334a]">
          {(
            [
              [leitura.hora, t.sol.horaSolar],
              [leitura.elevacao, t.sol.alturaDoSol],
              [leitura.rumo, t.sol.rumoDaSombra]
            ] as const
          ).map(([valor, rotulo]) => (
            <div key={rotulo} className="flex flex-col gap-1 bg-[#070d17] px-3 py-2.5">
              <span className="font-mono text-[15px] text-[#d5e4f7]">{valor}</span>
              <span className="text-[9.5px] text-[#66788f]">{rotulo}</span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex justify-between font-mono text-[8px] tracking-[0.1em] text-[#5f7a9c]">
            <span>00h</span>
            <span>06h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
          <input
            type="range"
            min={0}
            max={MINUTOS_NO_DIA}
            step={2}
            value={Math.round(minuto)}
            disabled={rodando}
            aria-label={t.sol.horaDoDia}
            onPointerDown={() => {
              arrastando.current = true
            }}
            onPointerUp={() => {
              arrastando.current = false
            }}
            onChange={(e) => arrastar(Number(e.target.value))}
            className="mt-1.5 h-[3px] w-full appearance-none bg-[#22334a] outline-none [&::-webkit-slider-thumb]:size-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#dfe9f8] disabled:[&::-webkit-slider-thumb]:bg-[#46597a]"
          />
        </div>

        <button
          type="button"
          disabled={rodando}
          onClick={() => navegar('/passagem')}
          className="mt-4 block w-full rounded-sm bg-[#dfe9f8] py-3.5 text-[13.5px] font-bold text-[#06101d] disabled:cursor-default disabled:bg-[#232c3a] disabled:text-[#6f7f95]"
        >
          {t.sol.verPassagem}
        </button>
        <button
          type="button"
          onClick={rodarDeNovo}
          className="mt-2.5 block w-full rounded-sm border border-[#3c536e] py-3.5 text-[13.5px] text-[#eef3fb]"
        >
          {t.sol.rodarDeNovo}
        </button>
      </Painel>
    </Tela>
  )
}

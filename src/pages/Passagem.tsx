import {
  ArcType,
  BoundingSphere,
  CallbackProperty,
  Cartesian3,
  Math as CesiumMath,
  Color,
  ColorMaterialProperty,
  HeadingPitchRange,
  Matrix3,
  Matrix4,
  PolygonHierarchy,
  PolylineGlowMaterialProperty,
  Quaternion
} from 'cesium'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Painel } from '../components/Painel.tsx'
import { Tela } from '../components/Tela.tsx'
import {
  areaDePlacasM2,
  energiaAteKwh,
  PREMISSAS_PADRAO,
  potenciaEm
} from '../domain/energia.ts'
import { transmissaoAtmosferica } from '../domain/incidencia.ts'
import {
  ALTITUDE_DO_REFLETOR_M,
  anguloMaximoDeVisada,
  DURACAO_DA_PASSAGEM_S,
  passagemEm,
  RAIO_DA_TERRA_M
} from '../domain/orbita.ts'
import type { Canto } from '../domain/validacao.ts'
import { useCesium } from '../hooks/useCesium.ts'
import { useFluxo } from '../hooks/useFluxo.ts'
import { useTexto } from '../hooks/useTexto.ts'
import { useIdioma } from '../i18n/index.ts'
import { numero, preencher } from '../lib/formato.ts'
import { centroDe, quadroLocal } from '../scene/cesium.ts'

const SEGUNDOS_NA_TELA = 13
const MINUTOS = DURACAO_DA_PASSAGEM_S / 60

const CANTOS_DE_DEMONSTRACAO: Canto[] = [
  [71.9173, 27.4742],
  [71.9297, 27.4742],
  [71.9297, 27.4798],
  [71.9173, 27.4798]
]

export const Passagem = () => {
  const t = useTexto()
  const idioma = useIdioma((e) => e.idioma)
  const navegar = useNavigate()
  const area = useFluxo((e) => e.area)
  const { caixa, viewer } = useCesium()

  const [rodando, setRodando] = useState(true)
  const [leitura, setLeitura] = useState({
    tempo: '0:00',
    potencia: '0 kW',
    energia: '0,0 kWh'
  })
  const [elevacao, setElevacao] = useState(0)
  const [progresso, setProgresso] = useState(0)
  const [energia, setEnergia] = useState(0)

  const s = useRef(-1)
  const energiaAgora = useRef(0)

  const cantos = area?.cantos ?? CANTOS_DE_DEMONSTRACAO
  const hectares = area?.hectares ?? 12.4
  const areaPlacas = areaDePlacasM2(hectares, PREMISSAS_PADRAO.ocupacao)

  useEffect(() => {
    if (!viewer) return

    const centro = centroDe(cantos)
    const centroCart = Cartesian3.fromDegrees(centro.lon, centro.lat, 0)
    const { paraLocal } = quadroLocal(centroCart)

    const cena = viewer.scene
    // a passagem e de noite. a atmosfera do Cesium desenha ceu de dia porque nao
    // ha relogio de Sol aqui, entao ela sai e fica o ceu estrelado
    if (cena.skyAtmosphere) cena.skyAtmosphere.show = false
    cena.globe.showGroundAtmosphere = false

    // o chao fica mais escuro do que na tela do Sol de proposito: aqui o contraste
    // e o produto, a area tem que acender quando o feixe chega
    const camada = viewer.imageryLayers.get(0)
    if (camada) {
      camada.brightness = 0.28
      camada.saturation = 0.38
    }

    const normal = Cartesian3.normalize(centroCart, new Cartesian3())
    const eixo = Cartesian3.normalize(
      Cartesian3.cross(normal, Cartesian3.UNIT_Z, new Cartesian3()),
      new Cartesian3()
    )

    // o refletor anda sobre a superficie girando em torno de um eixo perpendicular
    // ao ponto, a 640 km, de um horizonte ao outro. e geometria, nao enfeite
    const posicaoEm = (fracao: number) => {
      const giro = Quaternion.fromAxisAngle(
        eixo,
        fracao * anguloMaximoDeVisada(),
        new Quaternion()
      )
      const m = Matrix3.fromQuaternion(giro, new Matrix3())
      const direcao = Matrix3.multiplyByVector(m, normal, new Cartesian3())
      return Cartesian3.multiplyByScalar(
        direcao,
        RAIO_DA_TERRA_M + ALTITUDE_DO_REFLETOR_M,
        new Cartesian3()
      )
    }

    const elevacaoDe = (posicao: Cartesian3) => {
      const local = Matrix4.multiplyByPoint(paraLocal, posicao, new Cartesian3())
      const unitario = Cartesian3.normalize(local, new Cartesian3())
      return Math.asin(Math.max(-1, Math.min(1, unitario.z)))
    }

    const elevacaoAgora = () => elevacaoDe(posicaoEm(s.current))

    // a luz refletida e branca de Sol. perto do horizonte o azul e espalhado antes
    // de chegar, entao ela chega mais quente. nada de laranja, e um branco morno
    const corDaLuz = (elev: number, alfa: number) => {
      const q = 1 - Math.min(1, Math.max(0, Math.sin(elev)))
      return new Color(0.93 + 0.07 * q, 0.96 - 0.02 * q, 1 - 0.14 * q, alfa)
    }

    viewer.entities.add({
      position: new CallbackProperty(() => posicaoEm(s.current), false) as never,
      point: {
        pixelSize: 11,
        color: Color.WHITE,
        outlineColor: Color.fromBytes(255, 255, 255, 77),
        outlineWidth: 7
      }
    })

    const feixe = (largura: () => number, alfa: number, brilho: number) =>
      viewer.entities.add({
        polyline: {
          positions: new CallbackProperty(() => {
            const p = posicaoEm(s.current)
            return elevacaoDe(p) > 0 ? [p, centroCart] : undefined
          }, false),
          width: new CallbackProperty(largura, false),
          arcType: ArcType.NONE,
          material: new PolylineGlowMaterialProperty({
            glowPower: brilho,
            color: new CallbackProperty(() => {
              const e = elevacaoAgora()
              return corDaLuz(e, alfa * transmissaoAtmosferica(e))
            }, false)
          })
        }
      })

    // halo largo e fraco atras do feixe. sozinho o feixe fino parece um palito
    feixe(() => 30 + 44 * transmissaoAtmosferica(elevacaoAgora()), 0.2, 0.95)
    feixe(() => 9 + 13 * transmissaoAtmosferica(elevacaoAgora()), 0.62, 0.55)

    viewer.entities.add({
      polygon: {
        hierarchy: new PolygonHierarchy(
          cantos.map(([lon, lat]) => Cartesian3.fromDegrees(lon, lat, 0))
        ),
        material: new ColorMaterialProperty(
          new CallbackProperty(() => {
            const e = elevacaoAgora()
            return corDaLuz(
              e,
              0.03 + 0.52 * transmissaoAtmosferica(e) * Math.max(0, Math.sin(e))
            )
          }, false)
        ),
        outline: true,
        outlineColor: Color.WHITE,
        height: 0
      }
    })

    // a poca de luz transborda a area marcada, senao o feixe parece bater no nada
    const raioArea = Math.max(80, Math.sqrt((hectares * 10_000) / Math.PI))
    viewer.entities.add({
      position: centroCart,
      ellipse: {
        semiMajorAxis: raioArea * 4.2,
        semiMinorAxis: raioArea * 4.2,
        height: 0,
        material: new ColorMaterialProperty(
          new CallbackProperty(() => {
            const e = elevacaoAgora()
            return corDaLuz(e, 0.17 * transmissaoAtmosferica(e))
          }, false)
        )
      }
    })

    // a camera se ajusta ao tamanho da area. com altura fixa, uma area de 0,2 ha
    // virava um pontinho perdido no quadro
    const esfera = BoundingSphere.fromPoints(
      cantos.map(([lon, lat]) => Cartesian3.fromDegrees(lon, lat, 0))
    )
    cena.camera.flyToBoundingSphere(esfera, {
      duration: 0,
      offset: new HeadingPitchRange(
        0,
        CesiumMath.toRadians(-30),
        Math.max(esfera.radius * 7, 900)
      )
    })

    const remover = cena.postUpdate.addEventListener(() => {
      setElevacao(elevacaoAgora())
    })

    return () => {
      if (!viewer.isDestroyed()) remover()
    }
  }, [viewer, cantos, hectares])

  useEffect(() => {
    if (!rodando) return
    let pedido = 0
    let anterior = 0

    const passo = (agora: number) => {
      const dt = anterior ? (agora - anterior) / 1000 : 0
      anterior = agora

      s.current = Math.min(1, s.current + (dt / SEGUNDOS_NA_TELA) * 2)

      // tudo sai do nucleo, inclusive a energia acumulada. antes eu somava quadro a
      // quadro e o total mudava conforme a taxa de quadros da maquina
      const potW = potenciaEm(passagemEm(s.current).elevacao, areaPlacas)
      const acumulada = energiaAteKwh(hectares, s.current)
      energiaAgora.current = acumulada

      const decorrido = ((s.current + 1) / 2) * DURACAO_DA_PASSAGEM_S
      setProgresso(((s.current + 1) / 2) * 100)
      setEnergia(acumulada)
      setLeitura({
        tempo: `${Math.floor(decorrido / 60)}:${String(Math.floor(decorrido % 60)).padStart(2, '0')}`,
        potencia: `${(potW / 1000).toFixed(0)} kW`,
        energia: `${numero(idioma, acumulada, 1)} kWh`
      })

      if (s.current >= 1) {
        setRodando(false)
        return
      }
      pedido = requestAnimationFrame(passo)
    }

    pedido = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(pedido)
  }, [rodando, areaPlacas, hectares, idioma])

  const rodarDeNovo = () => {
    s.current = -1
    energiaAgora.current = 0
    setEnergia(0)
    setProgresso(0)
    setRodando(true)
  }

  const graus = (elevacao * 180) / Math.PI
  const fase = !rodando
    ? preencher(t.passagem.fases.fim, { kwh: numero(idioma, energia, 1) })
    : graus <= 0
      ? t.passagem.fases.abaixo
      : graus < 20
        ? t.passagem.fases.subindo
        : graus < 60
          ? t.passagem.fases.apontando
          : t.passagem.fases.alto

  return (
    <Tela estado={`${t.comum.areaMarcada} ${numero(idioma, hectares, 1)} ha`}>
      <div ref={caixa} className="absolute inset-x-0 top-0 bottom-[var(--painel,0px)]" />

      <Painel>
        <p className="font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.passagem.passo}
        </p>
        <h1 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-[#eef3fb]">
          {rodando ? t.passagem.titulo : t.passagem.terminou}
        </h1>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[#a8c6e8]">{fase}</p>

        <div className="mt-3.5 grid grid-cols-3 gap-px border border-[#22334a] bg-[#22334a]">
          {(
            [
              [leitura.tempo, t.passagem.daPassagem],
              [leitura.potencia, t.passagem.potenciaAgora],
              [leitura.energia, t.passagem.energiaGerada]
            ] as const
          ).map(([valor, rotulo]) => (
            <div key={rotulo} className="flex flex-col gap-1 bg-[#070d17] px-3 py-2.5">
              <span className="font-mono text-[15px] text-[#d5e4f7]">{valor}</span>
              <span className="text-[9.5px] text-[#66788f]">{rotulo}</span>
            </div>
          ))}
        </div>

        <div className="mt-3.5 h-[3px] bg-[#22334a]">
          <div className="h-full bg-[#dfe9f8]" style={{ width: `${progresso}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[8px] tracking-[0.1em] text-[#5f7a9c]">
          <span>
            {preencher(t.passagem.elevacao, { g: Math.max(0, Math.round(graus)) })}
          </span>
          <span>{preencher(t.passagem.duracao, { min: MINUTOS })}</span>
        </div>

        <button
          type="button"
          disabled={rodando}
          onClick={() => navegar('/pacote')}
          className="mt-4 block w-full rounded-sm bg-[#dfe9f8] py-3.5 text-[13.5px] font-bold text-[#06101d] disabled:cursor-default disabled:bg-[#232c3a] disabled:text-[#6f7f95]"
        >
          {t.passagem.escolherPacote}
        </button>
        <button
          type="button"
          onClick={rodarDeNovo}
          className="mt-2.5 block w-full rounded-sm border border-[#3c536e] py-3.5 text-[13.5px] text-[#eef3fb]"
        >
          {t.passagem.verDeNovo}
        </button>
        <p className="mt-3 text-[10.5px] leading-relaxed text-[#5d6f8b]">
          {preencher(t.passagem.premissas, {
            irr: PREMISSAS_PADRAO.irradiancia,
            ocu: Math.round(PREMISSAS_PADRAO.ocupacao * 100),
            efi: Math.round(PREMISSAS_PADRAO.eficiencia * 100)
          })}
        </p>
      </Painel>
    </Tela>
  )
}

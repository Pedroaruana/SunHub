import {
  Cartesian3,
  Credit,
  ImageryLayer,
  Ion,
  Matrix4,
  Transforms,
  UrlTemplateImageryProvider,
  Viewer
} from 'cesium'
import type { Canto } from '../domain/validacao.ts'

// nao usamos o Cesium Ion. o token vazio evita que ele tente falar com o servico
Ion.defaultAccessToken = ''

const ESRI =
  'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

export const criarViewer = (onde: HTMLElement): Viewer => {
  const viewer = new Viewer(onde, {
    baseLayer: new ImageryLayer(
      new UrlTemplateImageryProvider({
        url: ESRI,
        maximumLevel: 19,
        credit: new Credit('Esri World Imagery', false)
      })
    ),
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    shouldAnimate: false
  })

  // celular tem tela densa e GPU fraca: renderizar em 3x acaba com a taxa de
  // quadros sem ninguem ver diferenca. teto de 1.5 e o que equilibra
  viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 1.5)

  // nao ligar requestRenderMode aqui: as tres telas animam por CallbackProperty,
  // que so atualiza quando a cena desenha. com ele ligado o Sol para no lugar

  return viewer
}

// o enableLighting do Cesium nao surtiu efeito: medi o brilho dos pixels ligado e
// desligado e deu igual. entao dia e noite saem da altura do Sol que eu calculo,
// mexendo no brilho da propria camada de imagem
export const acenderChao = (viewer: Viewer, elevacaoDoSol: number): void => {
  const camada = viewer.imageryLayers.get(0)
  if (!camada) return
  const k = Math.max(0, Math.min(1, (elevacaoDoSol * 180) / Math.PI / 20 + 0.6))
  camada.brightness = 0.38 + 0.62 * k
  camada.saturation = 0.45 + 0.55 * k
}

export const paraCartesianos = (cantos: readonly Canto[]): Cartesian3[] =>
  cantos.map(([lon, lat]) => Cartesian3.fromDegrees(lon, lat, 0))

export const centroDe = (cantos: readonly Canto[]): { lon: number; lat: number } => ({
  lon: cantos.reduce((s, [lon]) => s + lon, 0) / cantos.length,
  lat: cantos.reduce((s, [, lat]) => s + lat, 0) / cantos.length
})

export const quadroLocal = (centro: Cartesian3) => {
  const enu = Transforms.eastNorthUpToFixedFrame(centro)
  return { enu, paraLocal: Matrix4.inverseTransformation(enu, new Matrix4()) }
}

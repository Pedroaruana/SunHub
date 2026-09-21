import { REFLETORES_EM_ORBITA } from './orbita.ts'

// codigo por caso em vez de string solta, senao a tela nao tem como traduzir
export const Erro = {
  PoucosCantos: 'area.poucos_cantos',
  CoordenadaForaDoMundo: 'area.coordenada_fora_do_mundo',
  AreaDegenerada: 'area.degenerada',
  AreaGrandeDemais: 'area.grande_demais',
  PassagensForaDaFrota: 'pacote.passagens_fora_da_frota',
  NoitesInvalidas: 'pacote.noites_invalidas'
} as const

export type Erro = (typeof Erro)[keyof typeof Erro]

export type Resultado<T> =
  | { readonly ok: true; readonly valor: T }
  | { readonly ok: false; readonly erros: readonly Erro[] }

// longitude antes de latitude, na mesma ordem do GeoJSON
export type Canto = readonly [number, number]

export const CANTOS_MINIMOS = 4
const HECTARES_MAXIMOS = 100_000

const M2_POR_HECTARE = 10_000
const METROS_POR_GRAU = 111_320

// formula do sapateiro num plano local. em area de propriedade a curvatura da
// Terra nao muda o numero de forma util, e assim nao dependo de projecao
export const hectaresDe = (cantos: readonly Canto[]): number => {
  if (cantos.length < 3) return 0

  const latMedia = cantos.reduce((soma, [, lat]) => soma + lat, 0) / cantos.length
  const escalaX = METROS_POR_GRAU * Math.cos((latMedia * Math.PI) / 180)

  let dobro = 0
  for (let i = 0; i < cantos.length; i++) {
    const [lonA, latA] = cantos[i]
    const [lonB, latB] = cantos[(i + 1) % cantos.length]
    dobro +=
      lonA * escalaX * (latB * METROS_POR_GRAU) - lonB * escalaX * (latA * METROS_POR_GRAU)
  }

  return Math.abs(dobro / 2) / M2_POR_HECTARE
}

// vale tambem pro que volta do armazenamento local, que pode ter sido editado na mao
export const validarArea = (cantos: readonly Canto[]): Resultado<number> => {
  const erros: Erro[] = []

  if (cantos.length < CANTOS_MINIMOS) erros.push(Erro.PoucosCantos)

  const foraDoMundo = cantos.some(
    ([lon, lat]) =>
      !Number.isFinite(lon) ||
      !Number.isFinite(lat) ||
      lon < -180 ||
      lon > 180 ||
      lat < -90 ||
      lat > 90
  )
  if (foraDoMundo) erros.push(Erro.CoordenadaForaDoMundo)

  if (erros.length > 0) return { ok: false, erros }

  const hectares = hectaresDe(cantos)
  if (hectares <= 0) erros.push(Erro.AreaDegenerada)
  if (hectares > HECTARES_MAXIMOS) erros.push(Erro.AreaGrandeDemais)

  return erros.length > 0 ? { ok: false, erros } : { ok: true, valor: hectares }
}

export const NOITES_OFERECIDAS = [1, 7, 30] as const
export type Noites = (typeof NOITES_OFERECIDAS)[number]

export const validarPacote = (
  passagensPorNoite: number,
  noites: number
): Resultado<{ passagensPorNoite: number; noites: Noites }> => {
  const erros: Erro[] = []

  const passagensOk =
    Number.isInteger(passagensPorNoite) &&
    passagensPorNoite >= 1 &&
    passagensPorNoite <= REFLETORES_EM_ORBITA
  if (!passagensOk) erros.push(Erro.PassagensForaDaFrota)

  if (!(NOITES_OFERECIDAS as readonly number[]).includes(noites)) {
    erros.push(Erro.NoitesInvalidas)
  }

  return erros.length > 0
    ? { ok: false, erros }
    : { ok: true, valor: { passagensPorNoite, noites: noites as Noites } }
}

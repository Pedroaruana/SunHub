import { aproveitamento } from './incidencia.ts'
import { DURACAO_DA_PASSAGEM_S, passagemEm } from './orbita.ts'

// essas tres premissas vao impressas na tela do pacote. ficam juntas num tipo
// pra ninguem trocar uma e esquecer de contar pro usuario
export type Premissas = {
  readonly irradiancia: number
  readonly ocupacao: number
  readonly eficiencia: number
}

export const PREMISSAS_PADRAO: Premissas = {
  irradiancia: 180,
  ocupacao: 0.45,
  eficiencia: 0.21
}

const M2_POR_HECTARE = 10_000

// ocupacao e menor que 1 porque parte do terreno e corredor entre fileiras,
// acesso e a folga que evita uma fileira sombrear a outra
export const areaDePlacasM2 = (hectares: number, ocupacao: number): number =>
  Math.max(0, hectares) * M2_POR_HECTARE * ocupacao

export const potenciaEm = (
  elevacao: number,
  areaPlacasM2: number,
  premissas: Premissas = PREMISSAS_PADRAO
): number =>
  areaPlacasM2 * premissas.irradiancia * aproveitamento(elevacao) * premissas.eficiencia

export const potenciaDePico = (
  hectares: number,
  premissas: Premissas = PREMISSAS_PADRAO
): number =>
  potenciaEm(
    passagemEm(0).elevacao,
    areaDePlacasM2(hectares, premissas.ocupacao),
    premissas
  )

// trapezio porque a potencia nao tem primitiva fechada: ela mistura a
// exponencial da extincao com o seno da incidencia
export const energiaDaPassagemKwh = (
  hectares: number,
  premissas: Premissas = PREMISSAS_PADRAO,
  amostras = 240
): number => {
  const area = areaDePlacasM2(hectares, premissas.ocupacao)
  const passo = DURACAO_DA_PASSAGEM_S / amostras

  let joules = 0
  let anterior = potenciaEm(passagemEm(-1).elevacao, area, premissas)

  for (let i = 1; i <= amostras; i++) {
    const atual = potenciaEm(passagemEm(-1 + (2 * i) / amostras).elevacao, area, premissas)
    joules += ((anterior + atual) / 2) * passo
    anterior = atual
  }

  return joules / 3_600_000
}

// energia acumulada do comeco da passagem ate uma fracao dela. e a mesma conta da
// passagem inteira, so que parando antes. integrar quadro a quadro na tela dava
// numero diferente a cada maquina, porque dependia da taxa de quadros
export const energiaAteKwh = (
  hectares: number,
  fracao: number,
  premissas: Premissas = PREMISSAS_PADRAO,
  amostras = 240
): number => {
  const ate = Math.max(-1, Math.min(1, fracao))
  const area = areaDePlacasM2(hectares, premissas.ocupacao)
  const passos = Math.max(1, Math.round((amostras * (ate + 1)) / 2))
  const passo = (DURACAO_DA_PASSAGEM_S * ((ate + 1) / 2)) / passos

  let joules = 0
  let anterior = potenciaEm(passagemEm(-1).elevacao, area, premissas)

  for (let i = 1; i <= passos; i++) {
    const atual = potenciaEm(
      passagemEm(-1 + ((ate + 1) * i) / passos).elevacao,
      area,
      premissas
    )
    joules += ((anterior + atual) / 2) * passo
    anterior = atual
  }

  return joules / 3_600_000
}

export const energiaDoPacoteKwh = (
  hectares: number,
  passagensPorNoite: number,
  noites: number,
  premissas: Premissas = PREMISSAS_PADRAO
): number => energiaDaPassagemKwh(hectares, premissas) * passagensPorNoite * noites

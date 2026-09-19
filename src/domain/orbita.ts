export const RAIO_DA_TERRA_M = 6_371_000

// esses tres aparecem na tela inicial. se mudarem aqui e nao la, a tela mente
export const ALTITUDE_DO_REFLETOR_M = 640_000
export const REFLETORES_EM_ORBITA = 7
export const DURACAO_DA_PASSAGEM_S = 11 * 60

const raioDaOrbita = () => RAIO_DA_TERRA_M + ALTITUDE_DO_REFLETOR_M

export const anguloMaximoDeVisada = () => Math.acos(RAIO_DA_TERRA_M / raioDaOrbita())

export type Passagem = {
  readonly fracao: number
  readonly elevacao: number
  readonly distancia: number
  readonly segundos: number
}

// fracao vai de -1 a 1, de um horizonte ao outro, e anda em velocidade constante
// porque a orbita e circular. quem nao e constante e a elevacao vista do chao:
// ela se arrasta perto do horizonte e dispara perto do zenite
export const passagemEm = (fracao: number): Passagem => {
  const preso = Math.max(-1, Math.min(1, fracao))
  const anguloCentral = Math.abs(preso) * anguloMaximoDeVisada()
  const r = raioDaOrbita()

  const elevacao = Math.atan2(
    Math.cos(anguloCentral) - RAIO_DA_TERRA_M / r,
    Math.sin(anguloCentral)
  )

  const distancia = Math.sqrt(
    RAIO_DA_TERRA_M ** 2 + r ** 2 - 2 * RAIO_DA_TERRA_M * r * Math.cos(anguloCentral)
  )

  return {
    fracao: preso,
    elevacao,
    distancia,
    segundos: ((preso + 1) / 2) * DURACAO_DA_PASSAGEM_S
  }
}

export const elevacaoMaxima = () => passagemEm(0).elevacao

// cada refletor rende uma passagem util por noite sobre a mesma area, entao nao
// existe vender "uma hora de luz". o que existe e multiplo de passagem
export const minutosMaximosPorNoite = () =>
  (REFLETORES_EM_ORBITA * DURACAO_DA_PASSAGEM_S) / 60

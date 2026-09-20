import { energiaDaPassagemKwh, PREMISSAS_PADRAO, type Premissas } from './energia.ts'
import { DURACAO_DA_PASSAGEM_S } from './orbita.ts'

// fica entre os R$ 0,462 do rural B2 homologado, que e sem imposto, e os R$ 0,73
// a R$ 0,95 do residencial ja com imposto. e o numero que o produtor compara com
// a conta de luz dele
export const TARIFA_DE_REFERENCIA = 0.62

export type Pacote = {
  readonly hectares: number
  readonly passagensPorNoite: number
  readonly noites: number
}

export type Orcamento = {
  readonly kwhPorPassagem: number
  readonly kwhTotal: number
  readonly passagensTotais: number
  readonly minutosPorNoite: number
  readonly precoPorPassagem: number
  readonly precoTotal: number
  readonly tarifa: number
}

export const minutosPorNoite = (passagensPorNoite: number): number =>
  (passagensPorNoite * DURACAO_DA_PASSAGEM_S) / 60

// o preco sai da energia da passagem, nao de tabela. e o que faz uma passagem
// alta custar mais que uma rasante, e a tela consegue mostrar o porque
export const orcar = (
  pacote: Pacote,
  tarifa = TARIFA_DE_REFERENCIA,
  premissas: Premissas = PREMISSAS_PADRAO
): Orcamento => {
  const kwhPorPassagem = energiaDaPassagemKwh(pacote.hectares, premissas)
  const passagensTotais = pacote.passagensPorNoite * pacote.noites

  return {
    kwhPorPassagem,
    kwhTotal: kwhPorPassagem * passagensTotais,
    passagensTotais,
    minutosPorNoite: minutosPorNoite(pacote.passagensPorNoite),
    precoPorPassagem: kwhPorPassagem * tarifa,
    precoTotal: kwhPorPassagem * passagensTotais * tarifa,
    tarifa
  }
}

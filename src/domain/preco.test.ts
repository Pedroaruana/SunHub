import { describe, expect, it } from 'vitest'
import { energiaDaPassagemKwh } from './energia.ts'
import { DURACAO_DA_PASSAGEM_S } from './orbita.ts'
import { minutosPorNoite, orcar, TARIFA_DE_REFERENCIA } from './preco.ts'

const pacote = { hectares: 10, passagensPorNoite: 3, noites: 7 }

describe('minutos por noite', () => {
  it('sao multiplos de passagem, nao numero redondo', () => {
    expect(minutosPorNoite(1)).toBe(DURACAO_DA_PASSAGEM_S / 60)
    expect(minutosPorNoite(3)).toBe(33)
    expect(minutosPorNoite(7)).toBe(77)
  })
})

describe('orcamento', () => {
  it('a energia por passagem e a mesma do nucleo de energia', () => {
    expect(orcar(pacote).kwhPorPassagem).toBeCloseTo(energiaDaPassagemKwh(10), 10)
  })

  it('o total e a passagem vezes o numero de passagens', () => {
    const o = orcar(pacote)
    expect(o.passagensTotais).toBe(21)
    expect(o.kwhTotal).toBeCloseTo(o.kwhPorPassagem * 21, 6)
  })

  // o preco tem que sair da energia, nao de tabela. se alguem trocar por valor
  // fixo por noite, esta conta para de fechar
  it('o preco e energia vezes tarifa, em qualquer ponto', () => {
    const o = orcar(pacote)
    expect(o.precoPorPassagem).toBeCloseTo(o.kwhPorPassagem * TARIFA_DE_REFERENCIA, 8)
    expect(o.precoTotal).toBeCloseTo(o.kwhTotal * TARIFA_DE_REFERENCIA, 6)
  })

  it('carrega a tarifa usada, pra tela nao ter que adivinhar', () => {
    expect(orcar(pacote).tarifa).toBe(TARIFA_DE_REFERENCIA)
    expect(orcar(pacote, 0.9).tarifa).toBe(0.9)
  })

  it('tarifa maior cobra mais pela mesma energia', () => {
    const barato = orcar(pacote, 0.4)
    const caro = orcar(pacote, 0.8)
    expect(caro.precoTotal).toBeCloseTo(barato.precoTotal * 2, 6)
    expect(caro.kwhTotal).toBeCloseTo(barato.kwhTotal, 10)
  })

  it('area maior custa mais', () => {
    expect(orcar({ ...pacote, hectares: 40 }).precoTotal).toBeGreaterThan(
      orcar(pacote).precoTotal
    )
  })

  it('mais noites custam proporcionalmente mais', () => {
    const uma = orcar({ ...pacote, noites: 1 })
    const trinta = orcar({ ...pacote, noites: 30 })
    expect(trinta.precoTotal).toBeCloseTo(uma.precoTotal * 30, 6)
  })

  it('sem area nao ha cobranca', () => {
    const o = orcar({ ...pacote, hectares: 0 })
    expect(o.kwhTotal).toBe(0)
    expect(o.precoTotal).toBe(0)
  })
})

describe('tarifa de referencia', () => {
  // ela fica entre o rural B2 homologado sem imposto e o residencial com
  // imposto. se sair dessa faixa, deixou de ser um numero defensavel
  it('fica entre os dois ancoradouros que justificam ela', () => {
    expect(TARIFA_DE_REFERENCIA).toBeGreaterThan(0.462)
    expect(TARIFA_DE_REFERENCIA).toBeLessThan(0.73)
  })
})

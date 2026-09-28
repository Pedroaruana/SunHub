import { describe, expect, it } from 'vitest'
import {
  aproveitamento,
  COEFICIENTE_DE_EXTINCAO,
  comprimentoDaSombra,
  fatorDeIncidencia,
  massaDeAr,
  rumoDaSombra,
  transmissaoAtmosferica
} from './incidencia.ts'

const rad = (graus: number) => (graus * Math.PI) / 180

describe('massa de ar', () => {
  it('no zenite a luz atravessa uma atmosfera', () => {
    expect(massaDeAr(rad(90))).toBeCloseTo(1, 10)
  })

  it('a 30 graus atravessa o dobro', () => {
    expect(massaDeAr(rad(30))).toBeCloseTo(2, 10)
  })

  // sem o piso no seno a conta ia pro infinito antes do refletor nascer e
  // levava a potencia junto
  it('tem teto no rasante em vez de explodir', () => {
    expect(massaDeAr(rad(0.001))).toBeLessThanOrEqual(20)
    expect(Number.isFinite(massaDeAr(rad(0.001)))).toBe(true)
  })

  it('abaixo do horizonte nao tem caminho de luz', () => {
    expect(massaDeAr(rad(0))).toBe(Number.POSITIVE_INFINITY)
    expect(massaDeAr(rad(-10))).toBe(Number.POSITIVE_INFINITY)
  })
})

describe('transmissao da atmosfera', () => {
  it('no zenite sobra o que o coeficiente deixa passar', () => {
    expect(transmissaoAtmosferica(rad(90))).toBeCloseTo(
      Math.exp(-COEFICIENTE_DE_EXTINCAO),
      10
    )
  })

  it('cai conforme o refletor abaixa', () => {
    expect(transmissaoAtmosferica(rad(60))).toBeLessThan(transmissaoAtmosferica(rad(90)))
    expect(transmissaoAtmosferica(rad(15))).toBeLessThan(transmissaoAtmosferica(rad(60)))
  })

  it('abaixo do horizonte nao chega nada', () => {
    expect(transmissaoAtmosferica(rad(0))).toBe(0)
    expect(transmissaoAtmosferica(rad(-5))).toBe(0)
  })

  it('ceu mais sujo deixa passar menos', () => {
    expect(transmissaoAtmosferica(rad(45), 0.4)).toBeLessThan(
      transmissaoAtmosferica(rad(45), 0.1)
    )
  })
})

describe('incidencia na placa', () => {
  it('placa deitada aproveita tudo no zenite', () => {
    expect(fatorDeIncidencia(rad(90))).toBeCloseTo(1, 10)
  })

  it('a 30 graus aproveita metade', () => {
    expect(fatorDeIncidencia(rad(30))).toBeCloseTo(0.5, 10)
  })

  it('nao fica negativo abaixo do horizonte', () => {
    expect(fatorDeIncidencia(rad(-30))).toBe(0)
  })
})

describe('as duas perdas juntas', () => {
  // esse e o teste que eu queria ter tido antes. eu esqueci de multiplicar pela
  // incidencia e deixei so a transmissao, e a potencia no rasante saiu quase 6
  // vezes maior do que devia. se alguem repetir isso, quebra aqui
  it('e o produto das duas, nao uma delas sozinha', () => {
    const e = rad(10)
    expect(aproveitamento(e)).toBeCloseTo(
      transmissaoAtmosferica(e) * fatorDeIncidencia(e),
      12
    )
    expect(aproveitamento(e)).toBeLessThan(transmissaoAtmosferica(e))
    expect(aproveitamento(e)).toBeLessThan(fatorDeIncidencia(e))
  })

  it('usar so a transmissao inflaria quase 6 vezes a 10 graus', () => {
    const razao = transmissaoAtmosferica(rad(10)) / aproveitamento(rad(10))
    expect(razao).toBeGreaterThan(5)
    expect(razao).toBeLessThan(6.5)
  })

  it('o melhor caso ainda perde um quinto da luz', () => {
    expect(aproveitamento(rad(90))).toBeGreaterThan(0.79)
    expect(aproveitamento(rad(90))).toBeLessThan(0.81)
  })

  it('no rasante sobra quase nada', () => {
    expect(aproveitamento(rad(5))).toBeLessThan(0.01)
  })

  it('abaixo do horizonte e zero', () => {
    expect(aproveitamento(rad(-1))).toBe(0)
  })
})

describe('sombra', () => {
  it('a 45 graus a sombra tem o tamanho do poste', () => {
    expect(comprimentoDaSombra(2, rad(45))).toBeCloseTo(2, 10)
  })

  it('quanto mais baixo o Sol, mais longa a sombra', () => {
    expect(comprimentoDaSombra(2, rad(30))).toBeGreaterThan(comprimentoDaSombra(2, rad(60)))
  })

  it('sem Sol no ceu a sombra nao termina', () => {
    expect(comprimentoDaSombra(2, rad(0))).toBe(Number.POSITIVE_INFINITY)
  })

  it('a sombra aponta pro lado oposto da luz', () => {
    expect(rumoDaSombra(0)).toBe(180)
    expect(rumoDaSombra(90)).toBe(270)
    expect(rumoDaSombra(250)).toBe(70)
  })

  it('o rumo fica sempre dentro da volta completa', () => {
    for (const azimute of [0, 45, 179, 180, 181, 359]) {
      expect(rumoDaSombra(azimute)).toBeGreaterThanOrEqual(0)
      expect(rumoDaSombra(azimute)).toBeLessThan(360)
    }
  })
})

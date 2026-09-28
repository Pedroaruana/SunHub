import { describe, expect, it } from 'vitest'
import {
  ALTITUDE_DO_REFLETOR_M,
  anguloMaximoDeVisada,
  DURACAO_DA_PASSAGEM_S,
  elevacaoMaxima,
  minutosMaximosPorNoite,
  passagemEm,
  RAIO_DA_TERRA_M,
  REFLETORES_EM_ORBITA
} from './orbita.ts'

const graus = (radianos: number) => (radianos * 180) / Math.PI

describe('passagem do refletor', () => {
  it('passa pelo zenite no meio da passagem', () => {
    expect(graus(passagemEm(0).elevacao)).toBeCloseTo(90, 6)
  })

  it('nasce e se poe no horizonte, dos dois lados', () => {
    expect(graus(passagemEm(-1).elevacao)).toBeCloseTo(0, 6)
    expect(graus(passagemEm(1).elevacao)).toBeCloseTo(0, 6)
  })

  // no zenite o refletor esta na vertical, entao a distancia tem que ser a
  // altitude e nada mais. se essa conta escorregar, a potencia escorrega junto
  it('no zenite a distancia e exatamente a altitude', () => {
    expect(passagemEm(0).distancia).toBeCloseTo(ALTITUDE_DO_REFLETOR_M, 3)
  })

  it('fica mais longe no horizonte do que no zenite', () => {
    expect(passagemEm(-1).distancia).toBeGreaterThan(passagemEm(0).distancia)
  })

  // a elevacao nao e proporcional a fracao: ela se arrasta perto do horizonte e
  // dispara perto do zenite. na metade do caminho ela ainda esta baixa, e todo
  // o resto da subida acontece na outra metade
  it('sobe muito mais na segunda metade do que na primeira', () => {
    const meio = graus(passagemEm(-0.5).elevacao)
    const primeiraMetade = meio - graus(passagemEm(-1).elevacao)
    const segundaMetade = graus(passagemEm(0).elevacao) - meio

    expect(meio).toBeLessThan(45)
    expect(segundaMetade).toBeGreaterThan(primeiraMetade * 3)
  })

  it('cresce sem voltar atras enquanto sobe', () => {
    let anterior = passagemEm(-1).elevacao
    for (let i = -0.9; i <= 0; i += 0.1) {
      const atual = passagemEm(i).elevacao
      expect(atual).toBeGreaterThanOrEqual(anterior)
      anterior = atual
    }
  })

  it('e simetrica em torno do zenite', () => {
    expect(passagemEm(-0.3).elevacao).toBeCloseTo(passagemEm(0.3).elevacao, 10)
  })

  it('prende fracao fora do intervalo em vez de extrapolar', () => {
    expect(passagemEm(-7).fracao).toBe(-1)
    expect(passagemEm(7).fracao).toBe(1)
    expect(passagemEm(7).elevacao).toBeCloseTo(passagemEm(1).elevacao, 10)
  })

  it('conta o tempo do comeco ao fim da passagem', () => {
    expect(passagemEm(-1).segundos).toBe(0)
    expect(passagemEm(1).segundos).toBe(DURACAO_DA_PASSAGEM_S)
    expect(passagemEm(0).segundos).toBe(DURACAO_DA_PASSAGEM_S / 2)
  })

  it('elevacaoMaxima e a mesma coisa que a elevacao no meio', () => {
    expect(elevacaoMaxima()).toBe(passagemEm(0).elevacao)
  })
})

describe('geometria da orbita', () => {
  it('o angulo de visada cabe entre zero e noventa graus', () => {
    const angulo = graus(anguloMaximoDeVisada())
    expect(angulo).toBeGreaterThan(0)
    expect(angulo).toBeLessThan(90)
  })

  // orbita mais alta enxerga um pedaco maior do chao. serve de guarda pra
  // alguem que mexer na altitude sem entender o que ela controla
  it('bate com a conta fechada do arco-cosseno', () => {
    const esperado = Math.acos(RAIO_DA_TERRA_M / (RAIO_DA_TERRA_M + ALTITUDE_DO_REFLETOR_M))
    expect(anguloMaximoDeVisada()).toBeCloseTo(esperado, 12)
  })
})

describe('limite da frota', () => {
  // esse numero aparece na tela do pacote como teto do que da pra vender
  it('o teto por noite e uma passagem de cada refletor', () => {
    expect(minutosMaximosPorNoite()).toBe(
      (REFLETORES_EM_ORBITA * DURACAO_DA_PASSAGEM_S) / 60
    )
    expect(minutosMaximosPorNoite()).toBe(77)
  })
})

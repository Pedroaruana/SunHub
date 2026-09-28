import { describe, expect, it } from 'vitest'
import {
  areaDePlacasM2,
  energiaAteKwh,
  energiaDaPassagemKwh,
  energiaDoPacoteKwh,
  PREMISSAS_PADRAO,
  potenciaDePico,
  potenciaEm
} from './energia.ts'
import { passagemEm } from './orbita.ts'

const rad = (graus: number) => (graus * Math.PI) / 180

describe('area de placas', () => {
  it('conta so a fracao ocupada do terreno', () => {
    expect(areaDePlacasM2(10, 0.45)).toBe(45_000)
  })

  it('terreno negativo vira zero em vez de energia negativa', () => {
    expect(areaDePlacasM2(-5, 0.45)).toBe(0)
  })
})

describe('potencia', () => {
  it('cresce junto com a area', () => {
    expect(potenciaDePico(20)).toBeCloseTo(potenciaDePico(10) * 2, 6)
  })

  it('e maior no zenite do que no rasante', () => {
    const area = areaDePlacasM2(10, PREMISSAS_PADRAO.ocupacao)
    expect(potenciaEm(rad(90), area)).toBeGreaterThan(potenciaEm(rad(10), area))
  })

  it('abaixo do horizonte nao gera nada', () => {
    expect(potenciaEm(rad(-5), areaDePlacasM2(10, 0.45))).toBe(0)
  })
})

describe('energia da passagem', () => {
  it('escala com a area', () => {
    expect(energiaDaPassagemKwh(20)).toBeCloseTo(energiaDaPassagemKwh(10) * 2, 6)
  })

  it('area zero nao rende nada', () => {
    expect(energiaDaPassagemKwh(0)).toBe(0)
  })

  // o passo fixo so vale se o resultado nao depender dele. de 30 pra 2000
  // amostras o numero nao pode andar de forma visivel
  it('nao muda com a quantidade de amostras', () => {
    const grosso = energiaDaPassagemKwh(10, PREMISSAS_PADRAO, 30)
    const fino = energiaDaPassagemKwh(10, PREMISSAS_PADRAO, 2000)
    expect(Math.abs(fino - grosso) / fino).toBeLessThan(0.0001)
  })

  it('placa melhor rende mais', () => {
    const melhor = { ...PREMISSAS_PADRAO, eficiencia: 0.25 }
    expect(energiaDaPassagemKwh(10, melhor)).toBeGreaterThan(energiaDaPassagemKwh(10))
  })
})

describe('energia acumulada durante a passagem', () => {
  // esta funcao existe porque eu acumulava quadro a quadro na tela e o total
  // mudava conforme a maquina engasgava. estes tres testes sao o contrato dela
  it('no comeco da passagem ainda nao rendeu nada', () => {
    expect(energiaAteKwh(10, -1)).toBe(0)
  })

  it('no fim da passagem bate com a passagem inteira', () => {
    expect(energiaAteKwh(10, 1)).toBeCloseTo(energiaDaPassagemKwh(10), 6)
  })

  it('na metade rende metade, porque a curva e simetrica no zenite', () => {
    expect(energiaAteKwh(10, 0)).toBeCloseTo(energiaDaPassagemKwh(10) / 2, 6)
  })

  it('nunca diminui conforme a passagem avanca', () => {
    let anterior = 0
    for (let fracao = -1; fracao <= 1; fracao += 0.25) {
      const atual = energiaAteKwh(10, fracao)
      expect(atual).toBeGreaterThanOrEqual(anterior)
      anterior = atual
    }
  })

  it('prende fracao fora do intervalo', () => {
    expect(energiaAteKwh(10, 9)).toBeCloseTo(energiaAteKwh(10, 1), 10)
    expect(energiaAteKwh(10, -9)).toBe(0)
  })
})

describe('energia do pacote', () => {
  it('multiplica pelas passagens e pelas noites', () => {
    const uma = energiaDaPassagemKwh(10)
    expect(energiaDoPacoteKwh(10, 3, 7)).toBeCloseTo(uma * 21, 6)
  })

  it('uma passagem numa noite e a passagem sozinha', () => {
    expect(energiaDoPacoteKwh(10, 1, 1)).toBeCloseTo(energiaDaPassagemKwh(10), 10)
  })
})

describe('as pecas conversam', () => {
  // guarda contra alguem mexer na potencia sem olhar a orbita: o pico da
  // passagem tem que ser a potencia calculada na elevacao maxima
  it('o pico do pacote e a potencia no zenite da passagem', () => {
    const area = areaDePlacasM2(10, PREMISSAS_PADRAO.ocupacao)
    expect(potenciaDePico(10)).toBeCloseTo(potenciaEm(passagemEm(0).elevacao, area), 6)
  })
})

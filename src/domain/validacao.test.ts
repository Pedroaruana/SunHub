import { describe, expect, it } from 'vitest'
import { REFLETORES_EM_ORBITA } from './orbita.ts'
import {
  CANTOS_MINIMOS,
  type Canto,
  Erro,
  hectaresDe,
  NOITES_OFERECIDAS,
  validarArea,
  validarPacote
} from './validacao.ts'

const METROS_POR_GRAU = 111_320

// quadrado de lado conhecido, pra conferir o sapateiro contra uma area que eu
// sei de cabeca: 1 km de lado sao 100 hectares
const quadrado = (lat: number, ladoM: number): Canto[] => {
  const dLat = ladoM / METROS_POR_GRAU
  const dLon = ladoM / (METROS_POR_GRAU * Math.cos((lat * Math.PI) / 180))
  return [
    [0, lat],
    [dLon, lat],
    [dLon, lat + dLat],
    [0, lat + dLat]
  ]
}

describe('area em hectares', () => {
  it('1 km de lado no equador da 100 hectares', () => {
    expect(hectaresDe(quadrado(0, 1000))).toBeCloseTo(100, 3)
  })

  it('o plano local aguenta latitude alta com erro pequeno', () => {
    expect(hectaresDe(quadrado(27.5, 2000))).toBeCloseTo(400, 0)
  })

  it('marcar os cantos ao contrario da o mesmo numero', () => {
    const horario = quadrado(0, 1000)
    expect(hectaresDe([...horario].reverse())).toBeCloseTo(hectaresDe(horario), 6)
  })

  it('menos de tres cantos nao fecha poligono nenhum', () => {
    expect(hectaresDe([])).toBe(0)
    expect(hectaresDe([[0, 0]])).toBe(0)
    expect(
      hectaresDe([
        [0, 0],
        [1, 1]
      ])
    ).toBe(0)
  })
})

describe('validacao da area', () => {
  it('aceita quatro cantos de verdade', () => {
    const r = validarArea(quadrado(-16.9, 1000))
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.valor).toBeCloseTo(100, 2)
  })

  it('recusa menos cantos do que o minimo', () => {
    const r = validarArea(quadrado(0, 1000).slice(0, CANTOS_MINIMOS - 1))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain(Erro.PoucosCantos)
  })

  it('recusa coordenada fora do mundo', () => {
    const r = validarArea([
      [200, 0],
      [1, 0],
      [1, 1],
      [0, 1]
    ])
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain(Erro.CoordenadaForaDoMundo)
  })

  // vem do armazenamento do navegador, que da pra editar na mao. NaN passando
  // adiante viraria preco NaN na tela
  it('recusa numero que nao e numero', () => {
    const r = validarArea([
      [0, Number.NaN],
      [1, 0],
      [1, 1],
      [0, 1]
    ])
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain(Erro.CoordenadaForaDoMundo)
  })

  it('recusa quatro cantos em linha reta', () => {
    const r = validarArea([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0]
    ])
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain(Erro.AreaDegenerada)
  })

  it('recusa area grande demais pra ser propriedade', () => {
    const r = validarArea([
      [0, 0],
      [30, 0],
      [30, 30],
      [0, 30]
    ])
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain(Erro.AreaGrandeDemais)
  })

  // cantos de menos e coordenada invalida param antes da conta de area, senao o
  // sapateiro rodaria em cima de lixo
  it('nao tenta calcular area quando a entrada ja esta quebrada', () => {
    const r = validarArea([
      [999, 999],
      [1, 0]
    ])
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.erros).toContain(Erro.PoucosCantos)
      expect(r.erros).not.toContain(Erro.AreaDegenerada)
    }
  })
})

describe('validacao do pacote', () => {
  it('aceita as combinacoes que a tela oferece', () => {
    for (const noites of NOITES_OFERECIDAS) {
      expect(validarPacote(1, noites).ok).toBe(true)
      expect(validarPacote(REFLETORES_EM_ORBITA, noites).ok).toBe(true)
    }
  })

  it('recusa mais passagens do que refletores em orbita', () => {
    const r = validarPacote(REFLETORES_EM_ORBITA + 1, 7)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain(Erro.PassagensForaDaFrota)
  })

  it('recusa zero passagem', () => {
    expect(validarPacote(0, 7).ok).toBe(false)
  })

  it('recusa meia passagem, que nao existe', () => {
    const r = validarPacote(2.5, 7)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain(Erro.PassagensForaDaFrota)
  })

  it('recusa quantidade de noites que nao esta a venda', () => {
    const r = validarPacote(3, 14)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain(Erro.NoitesInvalidas)
  })

  it('junta os dois erros quando os dois campos estao errados', () => {
    const r = validarPacote(99, 14)
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.erros).toContain(Erro.PassagensForaDaFrota)
      expect(r.erros).toContain(Erro.NoitesInvalidas)
    }
  })
})

describe('codigos de erro', () => {
  // a tela traduz pelo codigo. codigo repetido faria duas situacoes diferentes
  // mostrarem a mesma mensagem
  it('nao tem codigo repetido', () => {
    const codigos = Object.values(Erro)
    expect(new Set(codigos).size).toBe(codigos.length)
  })
})

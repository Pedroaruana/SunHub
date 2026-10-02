import { describe, expect, it } from 'vitest'
import { ROTAS, rotaDe } from './seo.ts'

describe('rota pelo caminho', () => {
  it('acha cada rota da lista', () => {
    for (const rota of ROTAS) {
      expect(rotaDe(rota.caminho).titulo, rota.caminho).toBe(rota.titulo)
    }
  })

  // a hospedagem redireciona /sol para /sol/, e era ai que quebrava: o caminho
  // com barra no fim nao batia com nenhuma rota, caia no 404 e a tela se
  // marcava como noindex sozinha. em producao, em todas as rotas menos a raiz
  it('aceita o caminho com barra no fim, que e como a hospedagem entrega', () => {
    for (const rota of ROTAS) {
      if (rota.caminho === '/') continue
      expect(rotaDe(`${rota.caminho}/`).titulo, rota.caminho).toBe(rota.titulo)
      expect(rotaDe(`${rota.caminho}/`).escondida, rota.caminho).toBe(rota.escondida)
    }
  })

  it('a raiz continua sendo a raiz', () => {
    expect(rotaDe('/').caminho).toBe('/')
    expect(rotaDe('/').escondida).toBeUndefined()
  })

  it('caminho que nao existe cai no 404 e sai do indice', () => {
    const r = rotaDe('/isso-nao-existe')
    expect(r.escondida).toBe(true)
    expect(r.titulo).toContain('não encontrada')
  })
})

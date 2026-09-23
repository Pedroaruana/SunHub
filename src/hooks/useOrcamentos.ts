import { create } from 'zustand'
import { gravarJson, lerJson } from '../lib/armazenamento.ts'
import { noNavegador } from '../lib/navegador.ts'

const CHAVE = 'sunhub.pacotes'
const LIMITE = 50

export type OrcamentoGuardado = {
  readonly protocolo: string
  readonly quando: string
  readonly hectares: number
  readonly minutosPorNoite: number
  readonly passagensPorNoite: number
  readonly noites: number
  readonly kwh: number
  readonly preco: number
  readonly tarifa: number
}

// o que volta do localStorage pode ter sido editado na mao, entao cada campo e
// conferido antes de virar item da lista
const eOrcamento = (v: unknown): v is OrcamentoGuardado => {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  return (
    typeof o.protocolo === 'string' &&
    typeof o.quando === 'string' &&
    !Number.isNaN(Date.parse(o.quando)) &&
    [
      'hectares',
      'minutosPorNoite',
      'passagensPorNoite',
      'noites',
      'kwh',
      'preco',
      'tarifa'
    ].every((campo) => typeof o[campo] === 'number' && Number.isFinite(o[campo]))
  )
}

const guardados = (): OrcamentoGuardado[] => {
  const cru = lerJson<unknown[]>(noNavegador ? localStorage : null, CHAVE)
  return Array.isArray(cru) ? cru.filter(eOrcamento) : []
}

type Estado = {
  readonly lista: readonly OrcamentoGuardado[]
  readonly guardar: (novo: OrcamentoGuardado) => void
  readonly apagarUm: (protocolo: string) => void
}

export const useOrcamentos = create<Estado>((set, get) => ({
  lista: guardados(),

  guardar: (novo) => {
    const lista = [novo, ...get().lista].slice(0, LIMITE)
    gravarJson(noNavegador ? localStorage : null, CHAVE, lista)
    set({ lista })
  },

  apagarUm: (protocolo) => {
    const lista = get().lista.filter((v) => v.protocolo !== protocolo)
    gravarJson(noNavegador ? localStorage : null, CHAVE, lista)
    set({ lista })
  }
}))

export const novoProtocolo = (quando: Date): string => {
  const p = (n: number, c: number) => String(n).padStart(c, '0')
  const sufixo = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0')
  return `SH-${quando.getFullYear()}-${p(quando.getMonth() + 1, 2)}${p(quando.getDate(), 2)}-${sufixo}`
}

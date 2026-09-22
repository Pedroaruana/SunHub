import { create } from 'zustand'
import { type Canto, validarArea } from '../domain/validacao.ts'
import { apagar, gravarJson, lerJson } from '../lib/armazenamento.ts'
import { noNavegador } from '../lib/navegador.ts'

const CHAVE_AREA = 'sunhub.area'

export type Area = {
  readonly cantos: readonly Canto[]
  readonly hectares: number
}

// a area vai em sessionStorage e nunca na URL: a regra do projeto e que a
// coordenada da propriedade nao aparece em endereco nem em log
const areaGuardada = (): Area | null => {
  const cru = lerJson<{ cantos?: unknown }>(noNavegador ? sessionStorage : null, CHAVE_AREA)
  if (!cru || !Array.isArray(cru.cantos)) return null

  const conferida = validarArea(cru.cantos as Canto[])
  if (!conferida.ok) return null

  return { cantos: cru.cantos as Canto[], hectares: conferida.valor }
}

type Estado = {
  readonly area: Area | null
  readonly passagensPorNoite: number
  readonly noites: number
  readonly definirArea: (cantos: readonly Canto[]) => void
  readonly limparArea: () => void
  readonly definirPacote: (passagensPorNoite: number, noites: number) => void
}

export const useFluxo = create<Estado>((set) => ({
  area: areaGuardada(),
  passagensPorNoite: 1,
  noites: 1,

  definirArea: (cantos) => {
    const conferida = validarArea(cantos)
    if (!conferida.ok) return
    const area: Area = { cantos, hectares: conferida.valor }
    gravarJson(noNavegador ? sessionStorage : null, CHAVE_AREA, { cantos })
    set({ area })
  },

  limparArea: () => {
    apagar(noNavegador ? sessionStorage : null, CHAVE_AREA)
    set({ area: null })
  },

  definirPacote: (passagensPorNoite, noites) => set({ passagensPorNoite, noites })
}))

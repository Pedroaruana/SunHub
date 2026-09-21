import { create } from 'zustand'
import { noNavegador } from '../lib/navegador.ts'
import type { pt } from './pt.ts'

// o portugues e a fonte da verdade: o tipo sai dele e o ingles tem que encaixar.
// se eu esquecer uma chave la, o TypeScript acusa antes de rodar
type Texto<T> = T extends string ? string : { readonly [K in keyof T]: Texto<T[K]> }

export type Dicionario = Texto<typeof pt>

export const IDIOMAS = ['pt', 'en'] as const
export type Idioma = (typeof IDIOMAS)[number]

export const NOME_DO_IDIOMA: Record<Idioma, string> = {
  pt: 'Português',
  en: 'English'
}

const CHAVE = 'sunhub.idioma'

const doNavegador = (): Idioma => {
  if (!noNavegador) return 'pt'
  const guardado = localStorage.getItem(CHAVE)
  if (guardado === 'pt' || guardado === 'en') return guardado
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

type Estado = {
  readonly idioma: Idioma
  readonly trocar: (idioma: Idioma) => void
}

export const useIdioma = create<Estado>((set) => ({
  idioma: doNavegador(),
  trocar: (idioma) => {
    if (!noNavegador) return
    localStorage.setItem(CHAVE, idioma)
    document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : 'en'
    set({ idioma })
  }
}))

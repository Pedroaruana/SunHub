import { en } from '../i18n/en.ts'
import { type Dicionario, useIdioma } from '../i18n/index.ts'
import { pt } from '../i18n/pt.ts'

const DICIONARIOS: Record<'pt' | 'en', Dicionario> = { pt, en }

export const useTexto = (): Dicionario => DICIONARIOS[useIdioma((e) => e.idioma)]

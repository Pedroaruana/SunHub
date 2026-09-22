import type { Idioma } from '../i18n/index.ts'

const LOCALE: Record<Idioma, string> = { pt: 'pt-BR', en: 'en-US' }

export const numero = (idioma: Idioma, valor: number, casas: number): string =>
  valor.toLocaleString(LOCALE[idioma], {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  })

// o preco fica em real nos dois idiomas porque a tarifa de referencia e brasileira.
// converter daria um numero que nao existe em lugar nenhum
export const dinheiro = (idioma: Idioma, valor: number): string =>
  valor.toLocaleString(LOCALE[idioma], {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

export const dataHora = (idioma: Idioma, quando: Date): string =>
  quando.toLocaleString(LOCALE[idioma], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

// troca {chave} pelo valor. o texto vive no dicionario e o numero vem de fora,
// senao nao daria pra traduzir frase que tem numero no meio
export const preencher = (
  modelo: string,
  valores: Record<string, string | number>
): string =>
  modelo.replace(/\{(\w+)\}/g, (inteiro, chave: string) =>
    chave in valores ? String(valores[chave]) : inteiro
  )

import { noNavegador } from './navegador.ts'

// tudo que sai daqui passa por validacao antes de virar estado. o que volta do
// navegador pode ter sido editado na mao, entao nao da pra confiar na forma
export const lerJson = <T>(deposito: Storage | null, chave: string): T | null => {
  if (!noNavegador || !deposito) return null
  try {
    const cru = deposito.getItem(chave)
    return cru ? (JSON.parse(cru) as T) : null
  } catch {
    return null
  }
}

export const gravarJson = (
  deposito: Storage | null,
  chave: string,
  valor: unknown
): void => {
  if (!noNavegador || !deposito) return
  try {
    deposito.setItem(chave, JSON.stringify(valor))
  } catch {
    // aba anonima e cota cheia derrubam o setItem. perder o rascunho e melhor
    // do que derrubar a tela na cara da pessoa
  }
}

export const apagar = (deposito: Storage | null, chave: string): void => {
  if (!noNavegador || !deposito) return
  try {
    deposito.removeItem(chave)
  } catch {
    // mesmo caso do gravar
  }
}

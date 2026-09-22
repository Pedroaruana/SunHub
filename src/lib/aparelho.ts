import { noNavegador } from './navegador.ts'

export type Onde = { readonly lon: number; readonly lat: number }

export type ResultadoDeLocal =
  | { readonly ok: true; readonly onde: Onde }
  | {
      readonly ok: false
      readonly motivo: 'negado' | 'indisponivel'
      readonly detalhe?: string
    }

const texto = (erro: unknown): string => {
  if (typeof erro === 'string') return erro
  if (typeof erro === 'object' && erro !== null && 'message' in erro) {
    return String((erro as { message: unknown }).message)
  }
  return String(erro)
}

const eNegado = (erro: unknown): boolean => {
  if (typeof erro === 'object' && erro !== null && 'code' in erro) {
    if ((erro as { code: unknown }).code === 1) return true
  }
  return /denied|permission/i.test(texto(erro))
}

// o proprio getCurrentPosition ja pede a permissao, mas so responde em https ou
// em localhost. em http na rede local o navegador bloqueia sem nem perguntar
export const ondeEstou = async (): Promise<ResultadoDeLocal> => {
  try {
    if (!noNavegador || !navigator.geolocation) {
      return { ok: false, motivo: 'indisponivel' }
    }

    const posicao = await new Promise<GeolocationPosition>((resolver, rejeitar) => {
      navigator.geolocation.getCurrentPosition(resolver, rejeitar, {
        enableHighAccuracy: false,
        timeout: 12_000
      })
    })

    return {
      ok: true,
      onde: { lon: posicao.coords.longitude, lat: posicao.coords.latitude }
    }
  } catch (erro) {
    // o detalhe vai pra tela de proposito: mensagem generica nao diz se foi GPS
    // desligado, sem sinal ou permissao negada
    return {
      ok: false,
      motivo: eNegado(erro) ? 'negado' : 'indisponivel',
      detalhe: texto(erro)
    }
  }
}

export const salvarArquivo = async (nome: string, conteudo: string): Promise<void> => {
  const arquivo = new Blob([conteudo], { type: 'application/json' })
  const endereco = URL.createObjectURL(arquivo)
  const link = document.createElement('a')
  link.href = endereco
  link.download = nome
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(endereco)
}

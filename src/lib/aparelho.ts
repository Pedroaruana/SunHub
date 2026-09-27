import { Capacitor } from '@capacitor/core'
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Geolocation } from '@capacitor/geolocation'
import { Share } from '@capacitor/share'
import { noNavegador } from './navegador.ts'

export const eApp = () => noNavegador && Capacitor.isNativePlatform()

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

// no app o plugin pede a permissao do jeito que o Android espera. no navegador o
// proprio getCurrentPosition ja pede, mas so em https ou localhost
export const ondeEstou = async (): Promise<ResultadoDeLocal> => {
  try {
    if (eApp()) {
      const permissao = await Geolocation.checkPermissions()
      if (permissao.location !== 'granted') {
        const pedida = await Geolocation.requestPermissions()
        if (pedida.location !== 'granted') return { ok: false, motivo: 'negado' }
      }
      // duas tentativas: a primeira pela rede, rapida e que basta pra girar o
      // globo. se o aparelho nao tiver posicao guardada ela falha, e ai vale a
      // pena ligar o GPS e esperar mais
      try {
        const rapida = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10_000,
          maximumAge: 300_000
        })
        return {
          ok: true,
          onde: { lon: rapida.coords.longitude, lat: rapida.coords.latitude }
        }
      } catch (primeira) {
        if (eNegado(primeira)) return { ok: false, motivo: 'negado' }

        const precisa = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 25_000
        })
        return {
          ok: true,
          onde: { lon: precisa.coords.longitude, lat: precisa.coords.latitude }
        }
      }
    }

    if (!noNavegador || !navigator.geolocation) return { ok: false, motivo: 'indisponivel' }

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
    // desligado, sem sinal ou servico do Google ausente
    return {
      ok: false,
      motivo: eNegado(erro) ? 'negado' : 'indisponivel',
      detalhe: texto(erro)
    }
  }
}

// no app o download por <a download> nao faz nada: a WebView nao tem pasta de
// downloads. entao o arquivo vai pro armazenamento do aparelho e abre a folha de
// compartilhar, que e como se manda arquivo pra fora no Android
export const salvarArquivo = async (nome: string, conteudo: string): Promise<void> => {
  if (eApp()) {
    const escrito = await Filesystem.writeFile({
      path: nome,
      data: conteudo,
      directory: Directory.Cache,
      encoding: Encoding.UTF8
    })
    await Share.share({ title: nome, url: escrito.uri })
    return
  }

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

import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { rotaDe, SITE } from '../lib/seo.ts'

const porNome = (nome: string, conteudo: string) => {
  const existente = document.head.querySelector(`meta[name="${nome}"]`)
  const tag = existente ?? document.createElement('meta')
  tag.setAttribute('name', nome)
  tag.setAttribute('content', conteudo)
  if (!existente) document.head.appendChild(tag)
}

const porPropriedade = (propriedade: string, conteudo: string) => {
  const existente = document.head.querySelector(`meta[property="${propriedade}"]`)
  const tag = existente ?? document.createElement('meta')
  tag.setAttribute('property', propriedade)
  tag.setAttribute('content', conteudo)
  if (!existente) document.head.appendChild(tag)
}

// o titulo, a descricao e o canonical mudam por rota. numa SPA nada disso muda
// sozinho, entao tem que ser feito na navegacao
export const useSeo = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const rota = rotaDe(pathname)
    const endereco = `${SITE}${rota.caminho}`

    document.title = rota.titulo
    porNome('description', rota.descricao)
    porNome('robots', rota.escondida ? 'noindex' : 'index,follow')
    porPropriedade('og:title', rota.titulo)
    porPropriedade('og:description', rota.descricao)
    porPropriedade('og:url', endereco)

    const canonical =
      document.head.querySelector('link[rel="canonical"]') ?? document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    canonical.setAttribute('href', endereco)
    if (!canonical.parentNode) document.head.appendChild(canonical)
  }, [pathname])
}

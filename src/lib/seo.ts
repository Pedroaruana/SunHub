export const SITE = 'https://sunhub.aruanapedro.workers.dev'

export type Rota = {
  readonly caminho: string
  readonly titulo: string
  readonly descricao: string
  // rota que nao deve entrar em indice de busca
  readonly escondida?: boolean
}

// canonical por rota, e nao o mesmo em todas. canonical repetido manda o buscador
// tirar as outras paginas do indice, e isso ja mordeu antes
export const ROTAS: readonly Rota[] = [
  {
    caminho: '/',
    titulo: 'SunHub, luz do Sol depois que ele se põe',
    descricao:
      'Simulador de refletores em órbita baixa: marque a área das suas placas, veja o Sol e a sombra em 24 horas e assista à passagem do refletor.'
  },
  {
    caminho: '/area',
    titulo: 'Marque a área das suas placas, SunHub',
    descricao:
      'Gire o globo até a sua região e desenhe os quatro cantos da área onde ficam as placas solares.'
  },
  {
    caminho: '/sol',
    titulo: 'O Sol e a sombra em 24 horas, SunHub',
    descricao:
      'A trajetória do Sol sobre a sua área e a sombra que ele projeta, hora a hora, com sombra calculada de verdade.'
  },
  {
    caminho: '/passagem',
    titulo: 'A passagem do refletor, SunHub',
    descricao:
      'O refletor cruza o céu a 640 km em 11 minutos e devolve luz do Sol para a sua área durante a noite.'
  },
  {
    caminho: '/pacote',
    titulo: 'Quanto de luz extra, SunHub',
    descricao:
      'Escolha quantos minutos de luz por noite e quantas noites. O preço sai da energia estimada, com a conta aberta.'
  },
  {
    caminho: '/orcamento',
    titulo: 'Orçamento simulado, SunHub',
    descricao:
      'Resumo do que foi reservado e as regras. Documento de demonstração, sem validade comercial.',
    escondida: true
  },
  {
    caminho: '/pacotes',
    titulo: 'Meus pacotes, SunHub',
    descricao: 'Os orçamentos simulados que você gerou, guardados no seu aparelho.',
    escondida: true
  },
  {
    caminho: '/privacidade',
    titulo: 'Privacidade, SunHub',
    descricao:
      'O que fica no seu aparelho, o que nunca é pedido e o único ponto em que dado seu sai daqui.'
  },
  {
    caminho: '/termos',
    titulo: 'Termos de uso, SunHub',
    descricao:
      'O SunHub é um simulador. Nenhuma energia é vendida e nenhum valor é cobrado.'
  },
  {
    caminho: '/cookies',
    titulo: 'Cookies, SunHub',
    descricao:
      'O SunHub não grava cookies. Esta página lista tudo que ele guarda no seu aparelho.'
  }
]

// a hospedagem serve o html da subpasta e redireciona /sol para /sol/. sem
// tirar essa barra, nenhuma rota batia aqui depois do redirecionamento: a tela
// montava, nao se achava na lista e se marcava como noindex sozinha
const semBarraNoFim = (caminho: string) =>
  caminho.length > 1 ? caminho.replace(/\/+$/, '') : caminho

export const rotaDe = (caminho: string): Rota => {
  const limpo = semBarraNoFim(caminho)

  return (
    ROTAS.find((r) => r.caminho === limpo) ?? {
      caminho: limpo,
      titulo: 'Página não encontrada, SunHub',
      descricao: 'Esta página não existe.',
      escondida: true
    }
  )
}

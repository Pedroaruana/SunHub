import { writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

// o eclipse desenhado pra ler em 16 pixels: disco cheio, metade escura, sem
// detalhe fino. anel e coroa somem nesse tamanho e viram sujeira
const marca = (lado, comFundo) => {
  const meio = lado / 2
  const raio = lado * (comFundo ? 0.3 : 0.42)
  const fundo = comFundo
    ? `<rect width="${lado}" height="${lado}" rx="${lado * 0.22}" fill="#03050a"/>`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">
  ${fundo}
  <circle cx="${meio}" cy="${meio}" r="${raio * 1.5}" fill="#cfe2fa" opacity=".18"/>
  <circle cx="${meio}" cy="${meio}" r="${raio}" fill="#f4f6fb"/>
  <path d="M${meio} ${meio - raio} A${raio} ${raio} 0 0 1 ${meio} ${meio + raio} Z" fill="#03050a"/>
</svg>`
}

const gerar = (arquivo, lado, comFundo) => {
  const png = new Resvg(marca(lado, comFundo), {
    fitTo: { mode: 'width', value: lado }
  })
    .render()
    .asPng()
  writeFileSync(`public/${arquivo}`, png)
  return `${arquivo} ${lado}x${lado}`
}

const feitos = [
  gerar('favicon-32.png', 32, false),
  gerar('favicon-192.png', 192, true),
  gerar('favicon-512.png', 512, true),
  gerar('apple-touch-icon.png', 180, true)
]

writeFileSync('public/favicon.svg', marca(64, false))

writeFileSync(
  'public/manifest.webmanifest',
  JSON.stringify(
    {
      name: 'SunHub',
      short_name: 'SunHub',
      description: 'Simulador de refletores em órbita baixa',
      start_url: '/',
      display: 'standalone',
      background_color: '#03050a',
      theme_color: '#03050a',
      lang: 'pt-BR',
      icons: [
        { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
        {
          src: '/favicon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    null,
    2
  )
)

console.log(`icones: ${feitos.join(', ')}, favicon.svg e manifest`)

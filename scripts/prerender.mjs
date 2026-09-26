import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const { ROTAS, SITE } = await import('../src/lib/seo.ts')

const DIST = 'dist'
const modelo = readFileSync(join(DIST, 'index.html'), 'utf8')

const escapar = (texto) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

// o SunHub e uma pagina so, entao robo sem JavaScript recebia tela em branco.
// aqui cada rota ganha um HTML proprio com o cabecalho certo, apontando para o
// mesmo bundle. quem roda JavaScript nem percebe
const cabecalho = (rota) => {
  const endereco = `${SITE}${rota.caminho}`
  const linhas = [
    `<title>${escapar(rota.titulo)}</title>`,
    `<meta name="description" content="${escapar(rota.descricao)}" />`,
    `<meta name="robots" content="${rota.escondida ? 'noindex' : 'index,follow'}" />`,
    `<link rel="canonical" href="${endereco}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapar(rota.titulo)}" />`,
    `<meta property="og:description" content="${escapar(rota.descricao)}" />`,
    `<meta property="og:url" content="${endereco}" />`,
    `<meta property="og:image" content="${SITE}/og.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`
  ]

  // o JSON-LD vai so na inicial. repetido em toda pagina o buscador desconta
  if (rota.caminho === '/') {
    linhas.push(
      `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'SunHub',
        url: SITE,
        applicationCategory: 'SimulationApplication',
        description: rota.descricao,
        inLanguage: ['pt-BR', 'en'],
        isAccessibleForFree: true
      })}</script>`
    )
  }

  return linhas.join('\n    ')
}

for (const rota of ROTAS) {
  const html = modelo.replace(/<title>[\s\S]*?<\/title>/, cabecalho(rota))

  const destino =
    rota.caminho === '/' ? join(DIST, 'index.html') : join(DIST, rota.caminho, 'index.html')

  mkdirSync(dirname(destino), { recursive: true })
  writeFileSync(destino, html)
}

const publicas = ROTAS.filter((r) => !r.escondida)

writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicas
  .map(
    (r) =>
      `  <url><loc>${SITE}${r.caminho === '/' ? '/' : r.caminho}</loc><changefreq>monthly</changefreq></url>`
  )
  .join('\n')}
</urlset>
`
)

writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /orcamento
Disallow: /pacotes

Sitemap: ${SITE}/sitemap.xml
`
)

writeFileSync(
  join(DIST, 'llms.txt'),
  `# SunHub

> Simulador de refletores orbitais. A pessoa marca a area das placas solares dela,
> ve o Sol e a sombra em 24 horas naquele ponto, assiste a passagem de um refletor
> que devolve luz do Sol durante a noite, e fecha um orcamento simulado.

Isto e uma demonstracao. Nao existe empresa SunHub, nenhuma energia e vendida e
nenhum valor e cobrado. Refletores orbitais para iluminar usinas fora do horario
de sol sao uma linha de pesquisa real, e e sobre ela que a simulacao foi feita.

## Como os numeros sao calculados

A energia sai de um modelo com premissas declaradas na propria tela: 180 W/m2 no
topo da atmosfera, 45% da area ocupada por placas, 21% de eficiencia e perda pela
massa de ar de 1/sen(elevacao). O preco sai da energia estimada multiplicada por
uma tarifa de referencia de R$ 0,62 por kWh.

## Paginas

${publicas.map((r) => `- [${r.titulo}](${SITE}${r.caminho}): ${r.descricao}`).join('\n')}
`
)

console.log(`prerender: ${ROTAS.length} rotas, sitemap, robots.txt e llms.txt`)

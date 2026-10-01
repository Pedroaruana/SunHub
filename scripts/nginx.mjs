import { readFileSync, writeFileSync } from 'node:fs'

// o public/_headers e lido pelo Cloudflare e pelo Netlify, mas o nginx nao sabe
// o que e aquilo. em vez de escrever a CSP de novo aqui e deixar as duas
// versoes divergirem com o tempo, esse script traduz um arquivo no outro
const ENTRADA = 'public/_headers'
const SAIDA = 'nginx.conf'

const linhas = readFileSync(ENTRADA, 'utf8').split('\n')

const blocos = []
let atual = null

for (const bruta of linhas) {
  const linha = bruta.replace(/\r$/, '')
  if (!linha.trim() || linha.trim().startsWith('#')) continue

  if (!linha.startsWith(' ')) {
    atual = { caminho: linha.trim(), cabecalhos: [] }
    blocos.push(atual)
    continue
  }

  const corte = linha.indexOf(': ')
  if (corte === -1 || !atual) continue
  atual.cabecalhos.push([linha.slice(0, corte).trim(), linha.slice(corte + 2).trim()])
}

const geral = blocos.find((b) => b.caminho === '/*')
if (!geral) throw new Error(`faltou o bloco /* em ${ENTRADA}`)

// aspas simples nao precisam de escape no nginx, aspas duplas sim, e a CSP vive
// cheia de aspas simples.
//
// a barra invertida vem antes da aspa, e a ordem importa: invertida, um valor
// terminado em barra comeria a aspa que eu mesmo acabei de por e a config sairia
// quebrada. hoje nenhum cabecalho tem barra, mas o escape nao pode depender
// disso continuar verdade
const valor = (v) => `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`

const sempre = geral.cabecalhos
  .map(([nome, v]) => `  add_header ${nome} ${valor(v)} always;`)
  .join('\n')

const comCache = blocos
  .filter((b) => b !== geral)
  .map((b) => {
    const prefixo = b.caminho.replace(/\*$/, '')
    const extras = [...geral.cabecalhos, ...b.cabecalhos]
      .map(([nome, v]) => `    add_header ${nome} ${valor(v)} always;`)
      .join('\n')
    return `  location ^~ ${prefixo} {\n${extras}\n  }`
  })
  .join('\n\n')

writeFileSync(
  SAIDA,
  `# gerado por scripts/nginx.mjs a partir de ${ENTRADA}. nao editar na mao
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;

  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
  gzip_min_length 1024;

${sempre}

${comCache}

  # o prerender gera um index.html por rota, entao /area tem que achar
  # /area/index.html. o ultimo degrau e a raiz, que monta a tela de 404
  location / {
    try_files $uri $uri/index.html /index.html;
  }
}
`
)

console.log(`nginx.conf gerado de ${ENTRADA}: ${blocos.length} blocos`)

import { writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const L = 1200
const A = 630

// prng com semente fixa: o ceu da imagem compartilhada tem que ser sempre o mesmo
const sorteio = (semente) => {
  let estado = semente
  return () => {
    estado = (estado * 1664525 + 1013904223) >>> 0
    return estado / 4294967296
  }
}
const proximo = sorteio(41)

let estrelas = ''
for (let i = 0; i < 260; i++) {
  const x = (proximo() * L).toFixed(1)
  const y = (proximo() * A).toFixed(1)
  const r = (0.6 + proximo() * 1.5).toFixed(2)
  const o = (0.2 + proximo() * 0.7).toFixed(2)
  estrelas += `<circle cx="${x}" cy="${y}" r="${r}" fill="#dfe8f5" opacity="${o}"/>`
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}" viewBox="0 0 ${L} ${A}">
  <defs>
    <radialGradient id="sol" cx="50%" cy="50%" r="50%">
      <stop offset="52%" stop-color="#e9f1ff" stop-opacity=".5"/>
      <stop offset="100%" stop-color="#e9f1ff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${L}" height="${A}" fill="#03050a"/>
  ${estrelas}

  <circle cx="330" cy="315" r="230" fill="url(#sol)"/>
  <circle cx="330" cy="315" r="118" fill="#f4f6fb"/>
  <path d="M330 197 A118 118 0 0 1 330 433 Z" fill="#03050a"/>
  <circle cx="330" cy="315" r="118" fill="none" stroke="#e4eefc" stroke-width="2" opacity=".75"/>

  <text x="620" y="268" font-family="IBM Plex Sans, Segoe UI, sans-serif" font-size="66" font-weight="700" fill="#eef3fb" letter-spacing="-2">SUNHUB</text>
  <text x="620" y="322" font-family="IBM Plex Mono, Consolas, monospace" font-size="17" fill="#7b93b8" letter-spacing="6">DESDE 2031</text>
  <text x="620" y="392" font-family="IBM Plex Sans, Segoe UI, sans-serif" font-size="30" fill="#a8c6e8">Luz do Sol depois que ele se põe</text>
  <text x="620" y="436" font-family="IBM Plex Sans, Segoe UI, sans-serif" font-size="21" fill="#8b9cb6">Refletores em órbita baixa, simulados</text>

  <rect x="620" y="480" width="360" height="1" fill="#22334a"/>
  <text x="620" y="520" font-family="IBM Plex Mono, Consolas, monospace" font-size="15" fill="#5f7a9c" letter-spacing="2">PLATAFORMA DE DEMONSTRAÇÃO</text>
</svg>`

const png = new Resvg(svg, { fitTo: { mode: 'width', value: L } }).render().asPng()
writeFileSync('public/og.png', png)
console.log(`og.png gerado, ${L}x${A}, ${(png.length / 1024).toFixed(0)} kB`)

import { writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const RES = 'android/app/src/main/res'

// o android corta o icone adaptativo em varios formatos. o desenho tem que caber
// na zona segura do meio, que e 72 de 108, senao a borda do eclipse some no corte
const foreground = (lado) => {
  const meio = lado / 2
  const raio = lado * 0.21

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">
  <circle cx="${meio}" cy="${meio}" r="${raio * 1.7}" fill="#cfe2fa" opacity=".2"/>
  <circle cx="${meio}" cy="${meio}" r="${raio}" fill="#f4f6fb"/>
  <path d="M${meio} ${meio - raio} A${raio} ${raio} 0 0 1 ${meio} ${meio + raio} Z" fill="#03050a"/>
</svg>`
}

// o icone antigo, pra aparelho sem icone adaptativo, ja vem com fundo e cantos
const legado = (lado, redondo) => {
  const meio = lado / 2
  const raio = lado * 0.3

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">
  ${
    redondo
      ? `<circle cx="${meio}" cy="${meio}" r="${meio}" fill="#03050a"/>`
      : `<rect width="${lado}" height="${lado}" rx="${lado * 0.22}" fill="#03050a"/>`
  }
  <circle cx="${meio}" cy="${meio}" r="${raio * 1.6}" fill="#cfe2fa" opacity=".18"/>
  <circle cx="${meio}" cy="${meio}" r="${raio}" fill="#f4f6fb"/>
  <path d="M${meio} ${meio - raio} A${raio} ${raio} 0 0 1 ${meio} ${meio + raio} Z" fill="#03050a"/>
</svg>`
}

const png = (svg, lado) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: lado } }).render().asPng()

const DENSIDADES = [
  ['mdpi', 48, 108],
  ['hdpi', 72, 162],
  ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324],
  ['xxxhdpi', 192, 432]
]

for (const [nome, ladoIcone, ladoFrente] of DENSIDADES) {
  const pasta = `${RES}/mipmap-${nome}`
  writeFileSync(`${pasta}/ic_launcher.png`, png(legado(ladoIcone, false), ladoIcone))
  writeFileSync(`${pasta}/ic_launcher_round.png`, png(legado(ladoIcone, true), ladoIcone))
  writeFileSync(
    `${pasta}/ic_launcher_foreground.png`,
    png(foreground(ladoFrente), ladoFrente)
  )
}

// o fundo do icone adaptativo era branco e brigava com a marca
writeFileSync(
  `${RES}/values/ic_launcher_background.xml`,
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#03050A</color>
</resources>
`
)

console.log(
  `icones do android: ${DENSIDADES.length} densidades, legado, redondo e adaptativo`
)

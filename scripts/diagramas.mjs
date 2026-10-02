import { mkdirSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'
import {
  areaDePlacasM2,
  energiaDaPassagemKwh,
  PREMISSAS_PADRAO
} from '../src/domain/energia.ts'
import { aproveitamento } from '../src/domain/incidencia.ts'
import {
  ALTITUDE_DO_REFLETOR_M,
  anguloMaximoDeVisada,
  passagemEm,
  RAIO_DA_TERRA_M
} from '../src/domain/orbita.ts'
import { orcar, TARIFA_DE_REFERENCIA } from '../src/domain/preco.ts'
import { hectaresDe } from '../src/domain/validacao.ts'

// a area de Bhadla, no Rajastao, que e a mesma usada nos testes. assim o numero
// do diagrama e exatamente o que a tela mostra pra aquele poligono
const BHADLA = [
  [71.92, 27.474],
  [71.927, 27.474],
  [71.927, 27.48],
  [71.92, 27.48]
]

// os desenhos saem das mesmas funcoes que a tela usa. se o modelo mudar, roda
// de novo e o diagrama acompanha, em vez de virar figura velha mentindo no
// README
const SANS = 'IBM Plex Sans, Segoe UI, sans-serif'
const MONO = 'IBM Plex Mono, Consolas, monospace'

const COR = {
  fundo: '#05070c',
  linha: '#22334a',
  texto: '#eef3fb',
  fraco: '#8b9cb6',
  tenue: '#5f7a9c',
  luz: '#dfe9f8',
  terra: '#16324f'
}

const grau = (rad) => (rad * 180) / Math.PI
const salvar = (nome, svg, largura) => {
  mkdirSync('docs', { recursive: true })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: largura } }).render().asPng()
  writeFileSync(`docs/${nome}.png`, png)
  console.log(
    `docs/${nome}.png, ${largura} de largura, ${(png.length / 1024).toFixed(0)} kB`
  )
}

// 1. a geometria da passagem: por que o comeco e o fim nao rendem quase nada
const geometria = () => {
  const L = 1000
  const A = 520
  const centroX = L / 2
  const raioTerra = 820
  const centroY = 1240
  const raioOrbita = raioTerra * (1 + ALTITUDE_DO_REFLETOR_M / RAIO_DA_TERRA_M)
  const visada = anguloMaximoDeVisada()

  // o arco e raso de proposito: e assim que ele e. 640 km de altitude contra
  // 6371 km de raio da Terra da pouco mais de um decimo, e a visada inteira
  // sao 24.7 graus de cada lado
  const em = (f) => {
    const p = passagemEm(f)
    const ang = f * visada
    return {
      f,
      x: centroX + Math.sin(ang) * raioOrbita,
      y: centroY - Math.cos(ang) * raioOrbita,
      elev: grau(p.elevacao),
      rende: aproveitamento(p.elevacao)
    }
  }

  const pontos = [-1, -0.6, -0.3, 0, 0.3, 0.6, 1].map(em)
  const rota = pontos
    .map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(0)} ${p.y.toFixed(0)}`)
    .join(' ')
  const meio = pontos[3]
  const chao = centroY - raioTerra

  const marcas = pontos
    .filter((p) => [-1, -0.6, 0, 0.6, 1].includes(p.f))
    .map((p) => {
      const forte = p.f === 0
      return `
  <circle cx="${p.x.toFixed(0)}" cy="${p.y.toFixed(0)}" r="${forte ? 7 : 4.5}" fill="${forte ? COR.luz : COR.tenue}"/>
  <text x="${p.x.toFixed(0)}" y="${(p.y - 20).toFixed(0)}" text-anchor="middle" font-family="${MONO}" font-size="16" fill="${forte ? COR.texto : COR.fraco}">${p.elev.toFixed(0)}°</text>
  <text x="${p.x.toFixed(0)}" y="${(p.y - 42).toFixed(0)}" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${COR.tenue}">${(p.rende * 100).toFixed(p.rende < 0.1 ? 1 : 0)}%</text>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}" viewBox="0 0 ${L} ${A}">
  <rect width="${L}" height="${A}" fill="${COR.fundo}"/>

  <circle cx="${centroX}" cy="${centroY}" r="${raioTerra}" fill="${COR.terra}" opacity=".6"/>
  <circle cx="${centroX}" cy="${centroY}" r="${raioTerra + 30}" fill="none" stroke="#7fb0e0" stroke-width="1.4" opacity=".3"/>

  <path d="${rota}" fill="none" stroke="${COR.linha}" stroke-width="1.8" stroke-dasharray="8 8"/>
  <path d="M${meio.x.toFixed(0)} ${meio.y.toFixed(0)} L${centroX} ${chao.toFixed(0)}" stroke="${COR.luz}" stroke-width="2.2" opacity=".8"/>
  <rect x="${centroX - 34}" y="${(chao - 3).toFixed(0)}" width="68" height="6" fill="${COR.luz}" opacity=".9"/>
  ${marcas}

  <text x="56" y="58" font-family="${SANS}" font-size="27" font-weight="600" fill="${COR.texto}">Uma passagem do refletor</text>
  <text x="56" y="88" font-family="${SANS}" font-size="17" fill="${COR.fraco}">altura no céu, e quanto da luz sobra depois do ar e da inclinação da placa</text>

  <text x="56" y="${A - 76}" font-family="${MONO}" font-size="14" fill="${COR.tenue}">ALTITUDE ${ALTITUDE_DO_REFLETOR_M / 1000} KM</text>
  <text x="56" y="${A - 52}" font-family="${MONO}" font-size="14" fill="${COR.tenue}">VISADA ${grau(visada).toFixed(1)}° DE CADA LADO</text>
  <text x="56" y="${A - 28}" font-family="${MONO}" font-size="14" fill="${COR.tenue}">11 MINUTOS DE PONTA A PONTA</text>

  <text x="${L - 56}" y="${A - 28}" text-anchor="end" font-family="${SANS}" font-size="16" fill="${COR.fraco}">no horizonte sobra menos de 1%, no alto sobra ${(aproveitamento(passagemEm(0).elevacao) * 100).toFixed(0)}%</text>
</svg>`
}

// 2. a cadeia do preco, com os numeros de uma area de verdade
const cadeia = (hectares) => {
  const { irradiancia, ocupacao, eficiencia } = PREMISSAS_PADRAO
  const placas = areaDePlacasM2(hectares, ocupacao) / 10_000
  const kwh = energiaDaPassagemKwh(hectares)
  const preco = orcar({ hectares, passagensPorNoite: 1, noites: 1 }).precoTotal

  const degraus = [
    ['Área marcada', `${hectares.toFixed(1)} ha`, 'o polígono desenhado no globo'],
    [
      'Placas dentro dela',
      `${placas.toFixed(1)} ha`,
      `${ocupacao * 100}% do terreno, o resto é corredor e acesso`
    ],
    [
      'Luz no topo da atmosfera',
      `${irradiancia} W/m²`,
      'o espelho devolvendo Sol para o ponto marcado'
    ],
    ['Perda no ar', '1 / sen(elev)', 'quanto mais baixo, mais atmosfera a luz atravessa'],
    [
      'Eficiência da placa',
      `${eficiencia * 100}%`,
      'silício comercial, o resto vira calor'
    ],
    [
      'Energia de uma passagem',
      `${kwh.toFixed(1)} kWh`,
      'a conta acima somada ao longo dos 11 minutos'
    ],
    [
      'Tarifa de referência',
      `R$ ${TARIFA_DE_REFERENCIA.toFixed(2)}`,
      'entre o rural sem imposto e o residencial com'
    ],
    ['Preço de uma passagem', `R$ ${preco.toFixed(2)}`, 'energia estimada vezes tarifa']
  ]

  const alturaDegrau = 62
  const topo = 132
  const L = 1000
  const A = topo + degraus.length * alturaDegrau + 54

  const linhas = degraus
    .map(([nome, valor, porque], i) => {
      const y = topo + i * alturaDegrau
      const ultimo = i === degraus.length - 1
      return `
  <line x1="56" y1="${y - 18}" x2="${L - 56}" y2="${y - 18}" stroke="${COR.linha}" stroke-width="1"/>
  <text x="76" y="${y + 6}" font-family="${SANS}" font-size="18" font-weight="${ultimo ? 600 : 500}" fill="${ultimo ? COR.luz : COR.texto}">${nome}</text>
  <text x="76" y="${y + 29}" font-family="${SANS}" font-size="14" fill="${COR.tenue}">${porque}</text>
  <text x="${L - 76}" y="${y + 10}" text-anchor="end" font-family="${MONO}" font-size="${ultimo ? 24 : 19}" fill="${ultimo ? COR.luz : COR.fraco}">${valor}</text>
  <rect x="56" y="${y - 18}" width="3" height="${alturaDegrau - 10}" fill="${ultimo ? COR.luz : COR.linha}"/>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}" viewBox="0 0 ${L} ${A}">
  <rect width="${L}" height="${A}" fill="${COR.fundo}"/>
  <text x="56" y="62" font-family="${SANS}" font-size="27" font-weight="600" fill="${COR.texto}">De onde sai o preço</text>
  <text x="56" y="94" font-family="${SANS}" font-size="17" fill="${COR.fraco}">cada degrau aparece na tela com o número e o motivo, e nenhum é tabela fechada</text>
  ${linhas}
</svg>`
}

salvar('passagem', geometria(), 1000)
salvar('cadeia-do-preco', cadeia(hectaresDe(BHADLA)), 1000)

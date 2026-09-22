import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'

// o Cesium carrega workers e assets em tempo de execucao. copiando pra public
// eles ficam disponiveis tanto no dev quanto no build, sem plugin no meio
const ORIGEM = 'node_modules/cesium/Build/Cesium'
const DESTINO = 'public/cesium'
const PASTAS = ['Workers', 'Assets', 'ThirdParty', 'Widgets']

if (!existsSync(ORIGEM)) {
  console.error('cesium nao esta instalado')
  process.exit(1)
}

rmSync(DESTINO, { recursive: true, force: true })
mkdirSync(DESTINO, { recursive: true })

for (const pasta of PASTAS) {
  cpSync(`${ORIGEM}/${pasta}`, `${DESTINO}/${pasta}`, { recursive: true })
}

console.log('assets do cesium em', DESTINO)

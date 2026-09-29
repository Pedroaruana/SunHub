import { defineConfig, devices } from '@playwright/test'

// roda contra o build, nao contra o vite dev. o que o usuario recebe e o
// bundle, com o html gerado por rota e o codigo minificado, e ja aconteceu de
// algo funcionar no dev e quebrar no build
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // teto de trabalhadores: o pedaco do Cesium tem 4 MB e varias telas rodando
  // ao mesmo tempo comecam a disputar cpu e a derrubar teste por tempo
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : 'line',
  use: {
    baseURL: 'http://localhost:4173',
    // sem isto o Pixel 7 vem em en-US e o app abre em ingles, porque o idioma
    // inicial sai do navigator.language. levei um tempo pra entender por que
    // nenhum texto em portugues era encontrado
    locale: 'pt-BR',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'celular',
      use: { ...devices['Pixel 7'] }
    }
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    // o build roda os geradores de icone, o vite e o prerender. no CI frio
    // isso passa de um minuto
    timeout: 180_000
  }
})

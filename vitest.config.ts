import { defineConfig } from 'vitest/config'

// o nucleo e o que mais der pra testar sem navegador. nada aqui monta
// componente, entao o ambiente padrao do node basta
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts']
  }
})

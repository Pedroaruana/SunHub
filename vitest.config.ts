import { defineConfig } from 'vitest/config'

// so o nucleo. nada aqui abre navegador nem monta componente, entao o ambiente
// padrao do node basta e a suite roda em menos de um segundo
export default defineConfig({
  test: {
    include: ['src/domain/**/*.test.ts']
  }
})

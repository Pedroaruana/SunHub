import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // os assets do Cesium vivem em public/cesium, copiados pelo scripts/cesium.mjs,
  // e o caminho e anunciado em window.CESIUM_BASE_URL no index.html
  plugins: [react(), tailwindcss()]
})

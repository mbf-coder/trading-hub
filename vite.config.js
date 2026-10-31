import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Base path for GitHub Pages project site: https://mbf-coder.github.io/trading-hub/
  base: '/trading-hub/',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 3000 },
  preview: { host: '0.0.0.0', port: 3000 }
})

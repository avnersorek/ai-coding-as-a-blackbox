import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import spaFallback from './vite-spa-fallback.js'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), spaFallback()],
  server: {
    port: 8080
  },
  preview: {
    port: 8080,
    open: false
  },
  base: mode === 'github-pages' ? '/ai-coding-as-a-blackbox/' : '/'
}))
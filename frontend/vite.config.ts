import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import spaFallback from './vite-spa-fallback.js'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react(), spaFallback()],
  server: {
    port: 8080
  },
  preview: {
    port: 8080,
    open: false
  },
  base: '/ai-coding-as-a-blackbox/'
}))

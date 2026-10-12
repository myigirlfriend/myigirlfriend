import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

const src = (path = '') => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@': src(),
      '@components': src('components'),
      '@pages': src('pages'),
      '@hooks': src('hooks'),
      '@store': src('store'),
      '@services': src('services'),
      '@config': src('config'),
      '@utils': src('utils'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
    allowedHosts: [
      'afternoon-estranged-extenuate.ngrok-free.dev',
    ],
  },
})

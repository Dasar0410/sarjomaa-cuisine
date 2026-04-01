import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
// Compute __dirname in ESM context so path resolution works reliably
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // Tailwind is already configured via postcss.config.js + tailwind.config.js
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2019',
  },
  server: {
    host: true,
  },
})

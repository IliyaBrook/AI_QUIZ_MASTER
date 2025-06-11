import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      { find: '@/pages', replacement: resolve(__dirname, 'src/pages') },
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
  plugins: [react()],
})

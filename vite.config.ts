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
      { find: '@/components', replacement: resolve(__dirname, 'src/components') },
      { find: '@/pages', replacement: resolve(__dirname, 'src/pages') },
      { find: '@/services', replacement: resolve(__dirname, 'src/services') },
      { find: '@/types', replacement: resolve(__dirname, 'src/types') },
      { find: '@/constants', replacement: resolve(__dirname, 'src/constants') },
      { find: '@/utils', replacement: resolve(__dirname, 'src/utils') },
      { find: '@/data', replacement: resolve(__dirname, 'src/data') },
      { find: '@/assets', replacement: resolve(__dirname, 'src/assets') },
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
  plugins: [react()],
})

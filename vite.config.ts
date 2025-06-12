import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  const pistonUrl = process.env.VITE_PISTON_URL;
  return {
    server: {
      port: 3000,
      proxy: {
        '/api/v2': {
          target: pistonUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: '@/components',
          replacement: resolve(__dirname, 'src/components'),
        },
        { find: '@/pages', replacement: resolve(__dirname, 'src/pages') },
        { find: '@/services', replacement: resolve(__dirname, 'src/services') },
        { find: '@/types', replacement: resolve(__dirname, 'src/types') },
        { find: '@/constants', replacement: resolve(__dirname, 'src/constants') },
        { find: '@/data', replacement: resolve(__dirname, 'src/data') },
        { find: '@/assets', replacement: resolve(__dirname, 'src/assets') },
        { find: '@', replacement: resolve(__dirname, 'src') },
      ],
    },
    plugins: [react()],
  };
});

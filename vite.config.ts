import * as node_fs from 'fs';
import * as path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

interface TsConfig {
  compilerOptions: {
    paths: Record<string, string[]>;
  };
}

function getPathsFromTsconfig(): Record<string, string> {
  const tsconfigStr = node_fs
    .readFileSync('./tsconfig.json', 'utf-8')
    .replace(/\/\/.*$/gm, '');
  const tsconfig: TsConfig = JSON.parse(tsconfigStr);
  const aliases: Record<string, string> = {};

  for (const [key, value] of Object.entries(tsconfig.compilerOptions.paths)) {
    if (value[0]) {
      const aliasKey = key.replace('/*', '');
      const aliasValue = path.resolve(__dirname, value[0].replace('/*', ''));
      aliases[aliasKey] = aliasValue;
    }
  }
  return aliases;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const pistonUrl = process.env.VITE_PISTON_URL;
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: {
        overlay: true,
      },
      proxy: {
        '/api/v2': {
          target: pistonUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: getPathsFromTsconfig(),
    },
    plugins: [react()],
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router'],
    },
  };
});

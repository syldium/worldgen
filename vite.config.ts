import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import createBiomeColors from './src/main/data/rollup-plugin-biome';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    //sourcemap: true,
    target: 'es2020'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts'
  },
  plugins: [
    react(),
    createBiomeColors(),
    {
      ...visualizer(),
      apply: 'build',
      enforce: 'post'
    }
  ]
});

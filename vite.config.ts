import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    //sourcemap: true,
    target: 'es2022'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    isolate: false
  },
  plugins: [
    react()
  ],
  ssr: {
    noExternal: [
      'json-view-for-react'
    ]
  }
});

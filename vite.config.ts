import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import createBiomeColors from "./src/main/data/rollup-plugin-biome";
import visualizer from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    //sourcemap: true,
    target: 'es2020'
  },
  plugins: [
    react(),
    createBiomeColors(),
    {
      ...visualizer(),
      apply: "build",
      enforce: "post",
    }
  ]
})

import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import createBiomeColors from "./src/main/data/rollup-plugin-biome";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    //sourcemap: true,
    target: 'es2020'
  },
  plugins: [reactRefresh(), createBiomeColors()]
})

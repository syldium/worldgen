import { Plugin } from 'vite';
import { BiomeColors } from '../viewer/biome/MultiNoiseMapWorker';
import { dataToEsm } from '@rollup/pluginutils';
import { rgbToBgrCanvas } from '../util/ColorHelper';

export default function createBiomeColors(): Plugin {
  const importId = 'biome-colors';
  return {
    name: 'create-biome-colors',
    resolveId(source: string) {
      if (source === importId) {
        return source;
      }
    },
    load(id: string) {
      if (id !== importId) {
        return null;
      }
      try {
        const colors: BiomeColors = {};
        for (const {
          name,
          color
        } of require('minecraft-data/minecraft-data/data/pc/1.16.1/biomes.json')) {
          colors[name] = rgbToBgrCanvas(color);
        }

        return {
          code: dataToEsm(colors, {
            compact: true
          }),
          map: { mappings: '' }
        };
      } catch (err) {
        this.warn({ message: err.message, id });
        return null;
      }
    }
  };
}
import { ViewableBiomeSource } from '../viewer/biome/types';
import { useState } from 'react';
import { BiomeColors } from '../viewer/biome/MultiNoiseMapWorker';
import { stripDefaultNamespace } from '../util/LabelHelper';
import { hashCode } from '../util/hashCode';
import VanillaBiomeColors from 'biome-colors';

export function useBiomeColors(
  source: ViewableBiomeSource
): [BiomeColors, (biome: string, bgr: number) => void] {
  const biomes: string[] = source.biomes.map((biome) =>
    typeof biome === 'string' ? biome : biome.biome
  );
  const [colors, setColors] = useState<BiomeColors>({});

  for (const biome of biomes) {
    const key = stripDefaultNamespace(biome);
    if (!(key in colors)) {
      const color = VanillaBiomeColors[key];
      colors[key] = color || hashCode(key) | (0xff << 24);
    }
  }
  return [
    colors,
    (biome: string, color: number) => setColors({ ...colors, [biome]: color })
  ];
}

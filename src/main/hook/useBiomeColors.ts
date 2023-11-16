import { useState } from 'react';
import { hashCode } from '../util/hashCode';
import { stripDefaultNamespace } from '../util/LabelHelper';
import { BiomeColors } from '../viewer/biome/MultiNoiseMapWorker';
import { ViewableBiomeSource } from '../viewer/biome/types';

const VanillaBiomeColors: Record<string, number> = {};

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

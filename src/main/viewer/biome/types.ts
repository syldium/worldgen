export interface CheckerboardBiomeSourceSettings {
  type: 'checkerboard' | 'minecraft:checkerboard';
  biomes: string[];
  scale?: number;
}

export interface BiomeParameters {
  biome: string;
  parameters: BiomeNoiseParameters;
}

export interface BiomeNoiseParameters {
  temperature: number;
  humidity: number;
  altitude: number;
  weirdness: number;
  offset: number;
}

export interface NoiseSettings {
  firstOctave: number;
  amplitudes: number[];
}

export interface MultiNoiseSettings {
  type: 'multi_noise' | 'minecraft:multi_noise';
  temperature_noise: NoiseSettings;
  humidity_noise: NoiseSettings;
  altitude_noise: NoiseSettings;
  weirdness_noise: NoiseSettings;
  biomes: BiomeParameters[];
  seed: number;
}

export type ViewableBiomeSource =
  | CheckerboardBiomeSourceSettings
  | MultiNoiseSettings;

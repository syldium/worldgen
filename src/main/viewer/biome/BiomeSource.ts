import {
  BiomeParameters,
  BiomeNoiseParameters,
  MultiNoiseSettings,
  CheckerboardBiomeSourceSettings
} from './types';
import { Random } from '../random/Random';
import { mod } from '../../util/MathHelper';
import { DoublePerlinSampler } from './PerlinSampler';

export interface BiomeSource {
  getBiomeAt(x: number, y: number, z: number): string;
}

export class CheckerboardBiomeSource implements BiomeSource {
  readonly biomes: string[];
  readonly size: number;

  constructor({ biomes, scale }: CheckerboardBiomeSourceSettings) {
    this.biomes = biomes;
    this.size = (scale || 2) + 2;
  }

  getBiomeAt(x: number, y: number, z: number): string {
    const biomeX = x >> 2;
    const biomeZ = z >> 2;
    return this.biomes[
      mod((biomeX >> this.size) + (biomeZ >> this.size), this.biomes.length)
    ];
  }
}

export class MultiNoiseBiomeSource implements BiomeSource {
  readonly biomes: BiomeParameters[];
  private readonly temperatureNoise: DoublePerlinSampler;
  private readonly humidityNoise: DoublePerlinSampler;
  private readonly altitudeNoise: DoublePerlinSampler;
  private readonly weirdnessNoise: DoublePerlinSampler;

  constructor(source: MultiNoiseSettings) {
    this.biomes = source.biomes;

    this.temperatureNoise = new DoublePerlinSampler(
      new Random(BigInt(source.seed)),
      source.temperature_noise
    );
    this.humidityNoise = new DoublePerlinSampler(
      new Random(BigInt(source.seed + 1)),
      source.humidity_noise
    );
    this.altitudeNoise = new DoublePerlinSampler(
      new Random(BigInt(source.seed + 2)),
      source.altitude_noise
    );
    this.weirdnessNoise = new DoublePerlinSampler(
      new Random(BigInt(source.seed + 3)),
      source.weirdness_noise
    );
  }

  getBiomeAt(x: number, y: number, z: number): string {
    const biomeX = x >> 2;
    const biomeY = y >> 2;
    const biomeZ = z >> 2;

    // Calculate a biome point using perlin biome samplers
    const temperature = this.temperatureNoise.sample(biomeX, biomeY, biomeZ);
    const humidity = this.humidityNoise.sample(biomeX, biomeY, biomeZ);
    const altitude = this.altitudeNoise.sample(biomeX, biomeY, biomeZ);
    const weirdness = this.weirdnessNoise.sample(biomeX, biomeY, biomeZ);

    // Determine the biome with the parameters closest to the current biome point
    let current: BiomeParameters | null = null;
    let minDistance = Number.MAX_SAFE_INTEGER;
    for (const biome of this.biomes) {
      const distance = this.getDistanceToBiome(
        temperature,
        humidity,
        altitude,
        weirdness,
        biome.parameters
      );
      if (distance < minDistance) {
        current = biome;
        minDistance = distance;
      }
    }

    return current!.biome;
  }

  getDistanceToBiome(
    temperature: number,
    humidity: number,
    altitude: number,
    weirdness: number,
    parameters: BiomeNoiseParameters
  ): number {
    return (
      (temperature - parameters.temperature) ** 2 +
      (humidity - parameters.humidity) ** 2 +
      (altitude - parameters.altitude) ** 2 +
      (weirdness - parameters.weirdness) ** 2 +
      (0 - parameters.offset) ** 2
    );
  }
}

import { Registries1_17 } from '../1.17/v1_17';
import { Biome } from './Biome';
import { ConfiguredSurfaceBuilder } from './ConfiguredSurfaceBuilder';
import { ConfiguredDecorator } from './ConfiguredDecorator';
import { Biomes } from '../1.17/Biome';
import { NoiseSettings } from './NoiseSettings';
import { NoiseSettingsOptions } from '../1.17/NoiseSettings';
import { BiomeSource } from './BiomeSource';
import { ConfiguredFeature } from './ConfiguredFeature';
import type { WorldgenRegistriesType } from '../../model/Registry';

export const Registries1_18: WorldgenRegistriesType = {
  ...Registries1_17,
  'worldgen/biome': [Biome, Biomes],
  'worldgen/biome_source': [BiomeSource],
  'worldgen/configured_decorator': [ConfiguredDecorator],
  'worldgen/configured_feature': [ConfiguredFeature],
  'worldgen/configured_surface_builder': [ConfiguredSurfaceBuilder],
  'worldgen/noise_settings': [NoiseSettings, NoiseSettingsOptions]
};

import { Registries1_17 } from '../1.17/v1_17';
import { Biome } from './Biome';
import { NoiseSettings } from './NoiseSettings';
import { NoiseSettingsOptions } from '../1.17/NoiseSettings';
import { BiomeSource } from './BiomeSource';
import { ConfiguredFeature } from './ConfiguredFeature';
import { MaterialRule } from './SurfaceRule';
import { EmptyModel } from '../../model/Model';
import { Noise, Noises } from './Noise';
import type { WorldgenRegistriesType } from '../../model/Registry';
import { PlacementModifier } from './PlacementModifier';
import { PlacedFeature } from './PlacedFeature';
import { BlockPredicate } from './BlockPredicate';

export const Registries1_18: WorldgenRegistriesType = {
  ...Registries1_17,
  block_predicate: [BlockPredicate],
  'worldgen/biome': [Biome],
  'worldgen/biome_source': [BiomeSource],
  'worldgen/configured_decorator': [EmptyModel],
  'worldgen/configured_feature': [ConfiguredFeature],
  'worldgen/configured_surface_builder': [EmptyModel],
  'worldgen/material_rule': [MaterialRule],
  'worldgen/noise': [Noise, Noises],
  'worldgen/noise_settings': [NoiseSettings, NoiseSettingsOptions],
  'worldgen/placement_modifier': [PlacementModifier],
  'worldgen/placed_feature': [PlacedFeature]
};

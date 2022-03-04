import { EmptyModel } from '../../model/Model';
import type { WorldgenRegistriesType } from '../../model/Registry';
import { NoiseSettingsOptions } from '../1.17/NoiseSettings';
import { Registries1_17 } from '../1.17/v1_17';
import { Biome } from './Biome';
import { BiomeSource } from './BiomeSource';
import { BlockPredicate } from './BlockPredicate';
import { ConfiguredFeature } from './ConfiguredFeature';
import { ConfiguredStructureFeature } from './ConfiguredStructureFeature';
import { Noise, Noises } from './Noise';
import { NoiseSettings } from './NoiseSettings';
import { PlacedFeature } from './PlacedFeature';
import { PlacementModifier } from './PlacementModifier';
import { MaterialRule } from './SurfaceRule';
import { TemplatePool } from './TemplatePool';

export const Registries1_18: WorldgenRegistriesType = {
  ...Registries1_17,
  block_predicate: [BlockPredicate],
  'worldgen/biome': [Biome],
  'worldgen/biome_source': [BiomeSource],
  'worldgen/configured_decorator': [EmptyModel],
  'worldgen/configured_feature': [ConfiguredFeature],
  'worldgen/configured_structure_feature': [ConfiguredStructureFeature],
  'worldgen/configured_surface_builder': [EmptyModel],
  'worldgen/material_rule': [MaterialRule],
  'worldgen/noise': [Noise, Noises],
  'worldgen/noise_settings': [NoiseSettings, NoiseSettingsOptions],
  'worldgen/placement_modifier': [PlacementModifier],
  'worldgen/placed_feature': [PlacedFeature],
  'worldgen/template_pool': [TemplatePool]
};

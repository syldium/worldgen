import { WorldgenRegistriesType } from '../../model/Registry';
import { DimensionTypes } from '../1.17/DimensionType';
import { Registries1_18 } from '../1.18/v1_18';
import { Biome } from './Biome';
import { BlockPredicate } from './BlockPredicate';
import { ConfiguredFeature } from './ConfiguredFeature';
import { DimensionType } from './DimensionType';
import { NoiseSettings, NoiseSettingsOptions } from './NoiseSettings';
import { StructureSet } from './StructureSet';
import { MaterialRule } from './SurfaceRule';

export const Registries1_18_2: WorldgenRegistriesType = {
  ...Registries1_18,
  block_predicate: [BlockPredicate],
  dimension_type: [DimensionType, DimensionTypes],
  'worldgen/biome': [Biome],
  'worldgen/configured_feature': [ConfiguredFeature],
  'worldgen/material_rule': [MaterialRule],
  'worldgen/noise_settings': [NoiseSettings, NoiseSettingsOptions],
  'worldgen/structure_set': [StructureSet]
};

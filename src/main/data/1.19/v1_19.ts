import { EmptyModel } from '../../model/Model';
import { WorldgenRegistriesType } from '../../model/Registry';
import { DimensionTypes } from '../1.17/DimensionType';
import { NoiseSettingsOptions } from '../1.18.2/NoiseSettings';
import { Registries1_18_2 } from '../1.18.2/v1_18_2';
import { Biome } from './Biome';
import { ChunkGenerator } from './ChunkGenerator';
import { ConfiguredCarver } from './ConfiguredCarver';
import { ConfiguredFeature } from './ConfiguredFeature';
import { DensityFunction } from './DensityFunction';
import { DimensionType } from './DimensionType';
import { FlatLevelGeneratorPreset } from './FlatLevelGeneratorPreset';
import { NoiseSettings } from './NoiseSettings';
import { Structure } from './Structure';
import { StructureSet } from './StructureSet';
import { WorldPreset } from './WorldPreset';

export const Registries1_19: WorldgenRegistriesType = {
  ...Registries1_18_2,
  dimension_type: [DimensionType, DimensionTypes],
  'worldgen/biome': [Biome],
  'worldgen/chunk_generator': [ChunkGenerator],
  'worldgen/configured_carver': [ConfiguredCarver],
  'worldgen/configured_feature': [ConfiguredFeature],
  'worldgen/configured_structure_feature': [EmptyModel],
  'worldgen/density_function': [DensityFunction],
  'worldgen/flat_level_generator_preset': [FlatLevelGeneratorPreset],
  'worldgen/noise_settings': [NoiseSettings, NoiseSettingsOptions],
  'worldgen/structure': [Structure],
  'worldgen/structure_set': [StructureSet],
  'worldgen/world_preset': [WorldPreset]
};

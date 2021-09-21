import { Dimension, Dimensions } from './Dimension';
import { DimensionType, DimensionTypes } from './DimensionType';
import { Biome, Biomes } from './Biome';
import { BiomeSource } from './BiomeSource';
import { ChunkGenerator, ChunkGenerators } from './ChunkGenerator';
import { ConfiguredCarver } from './ConfiguredCarver';
import { ConfiguredDecorator } from './ConfiguredDecorator';
import { ConfiguredFeature } from './ConfiguredFeature';
import { ConfiguredSurfaceBuilder } from './ConfiguredSurfaceBuilder';
import { NoiseSettings, NoiseSettingsOptions } from './NoiseSettings';
import { ProcessorList } from './StructureProcessor';
import type { WorldgenRegistriesType } from '../../model/Registry';

export const Registries1_17: WorldgenRegistriesType = {
  dimension: [Dimension, Dimensions],
  dimension_type: [DimensionType, DimensionTypes],
  'worldgen/biome': [Biome, Biomes],
  'worldgen/biome_source': [BiomeSource],
  'worldgen/chunk_generator': [ChunkGenerator, ChunkGenerators],
  'worldgen/configured_carver': [ConfiguredCarver],
  'worldgen/configured_decorator': [ConfiguredDecorator],
  'worldgen/configured_feature': [ConfiguredFeature],
  'worldgen/configured_structure_feature': [DimensionType],
  'worldgen/configured_surface_builder': [ConfiguredSurfaceBuilder],
  'worldgen/noise_settings': [NoiseSettings, NoiseSettingsOptions],
  'worldgen/processor_list': [ProcessorList]
};

import { EmptyModel } from '../../model/Model';
import type { WorldgenRegistriesType } from '../../model/Registry';
import { Biome } from './Biome';
import { BiomeSource } from './BiomeSource';
import { ChunkGenerator, ChunkGenerators } from './ChunkGenerator';
import { ConfiguredCarver } from './ConfiguredCarver';
import { ConfiguredDecorator } from './ConfiguredDecorator';
import { ConfiguredFeature } from './ConfiguredFeature';
import { ConfiguredSurfaceBuilder } from './ConfiguredSurfaceBuilder';
import { Dimension, Dimensions } from './Dimension';
import { DimensionType, DimensionTypes } from './DimensionType';
import { NoiseSettings, NoiseSettingsOptions } from './NoiseSettings';
import { ProcessorList } from './StructureProcessor';

export const Registries1_17: WorldgenRegistriesType = {
  'worldgen/material_condition': [EmptyModel],
  'worldgen/placed_feature': [EmptyModel],
  'worldgen/placement_modifier': [EmptyModel],
  block_predicate: [EmptyModel],
  dimension: [Dimension, Dimensions],
  dimension_type: [DimensionType, DimensionTypes],
  'worldgen/biome': [Biome],
  'worldgen/biome_source': [BiomeSource],
  'worldgen/chunk_generator': [ChunkGenerator, ChunkGenerators],
  'worldgen/configured_carver': [ConfiguredCarver],
  'worldgen/configured_decorator': [ConfiguredDecorator],
  'worldgen/configured_feature': [ConfiguredFeature],
  'worldgen/material_rule': [EmptyModel],
  'worldgen/noise': [EmptyModel],
  'worldgen/configured_structure_feature': [DimensionType],
  'worldgen/configured_surface_builder': [ConfiguredSurfaceBuilder],
  'worldgen/noise_settings': [NoiseSettings, NoiseSettingsOptions],
  'worldgen/processor_list': [ProcessorList]
};

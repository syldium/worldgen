import { Option } from '../component/ui/Select';
import { Model } from './Model';
import { DimensionType, DimensionTypes } from '../data/1.17/DimensionType';
import { ChunkGenerator, ChunkGenerators } from '../data/1.17/ChunkGenerator';
import { BiomeSource } from '../data/1.17/BiomeSource';
import {
  NoiseSettings,
  NoiseSettingsOptions
} from '../data/1.17/NoiseSettings';

export type GameRegistryKey =
  | 'block'
  | 'block_state'
  | 'entity_type'
  | 'sound_event'
  | 'structure'
  | 'tag/blocks';

export type WorldgenRegistryKey =
  | 'dimension'
  | 'dimension_type'
  | 'worldgen/biome'
  | 'worldgen/biome_source'
  | 'worldgen/chunk_generator'
  | 'worldgen/configured_carver'
  | 'worldgen/configured_feature'
  | 'worldgen/configured_structure_feature'
  | 'worldgen/configured_surface_builder'
  | 'worldgen/noise_settings'
  | 'worldgen/processor_list';

export type RegistryKey = GameRegistryKey | WorldgenRegistryKey;

export interface Registry {
  options: Option[];
}

type RegistryEntries = { [identifier: string]: Record<string, unknown> };
class WorldgenRegistry implements Registry {
  readonly entries: RegistryEntries;
  readonly model: Model;
  readonly options: Option[];

  constructor(
    model: Model,
    options: Option[] = [],
    entries: RegistryEntries = {}
  ) {
    this.model = model;
    this.options = options;
    this.entries = entries;
  }

  register(namespacedKey: string, schema: Record<string, unknown>): void {
    this.entries[namespacedKey] = schema;
  }
}

export type BlockStateRegistry = {
  [block: string]: {
    properties: Record<string, string[]>;
    default: Record<string, string>;
  };
};
export const DEFAULT_BLOCK_STATE = { default: {}, properties: {} };

export class WorldgenRegistryHolder {
  worldgen: Record<WorldgenRegistryKey, WorldgenRegistry> = {
    dimension: new WorldgenRegistry(DimensionType),
    dimension_type: new WorldgenRegistry(DimensionType, DimensionTypes),
    'worldgen/biome': new WorldgenRegistry(DimensionType),
    'worldgen/biome_source': new WorldgenRegistry(BiomeSource),
    'worldgen/chunk_generator': new WorldgenRegistry(
      ChunkGenerator,
      ChunkGenerators
    ),
    'worldgen/configured_carver': new WorldgenRegistry(DimensionType),
    'worldgen/configured_feature': new WorldgenRegistry(DimensionType),
    'worldgen/configured_structure_feature': new WorldgenRegistry(
      DimensionType
    ),
    'worldgen/configured_surface_builder': new WorldgenRegistry(DimensionType),
    'worldgen/noise_settings': new WorldgenRegistry(
      NoiseSettings,
      NoiseSettingsOptions
    ),
    'worldgen/processor_list': new WorldgenRegistry(DimensionType)
  };

  isRegistered(key: RegistryKey): key is WorldgenRegistryKey {
    return key in this.worldgen;
  }
}

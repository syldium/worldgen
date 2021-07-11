import { Option } from '../component/ui/Select';
import { Model } from './Model';
import { DimensionType, DimensionTypes } from '../data/1.17/DimensionType';
import { ChunkGenerator, ChunkGenerators } from '../data/1.17/ChunkGenerator';
import { BiomeSource } from '../data/1.17/BiomeSource';
import {
  NoiseSettings,
  NoiseSettingsOptions
} from '../data/1.17/NoiseSettings';
import { Biomes } from '../data/1.17/Biome';
import { Dimension, Dimensions } from '../data/1.17/Dimension';
import { ConfiguredFeature } from '../data/1.17/ConfiguredFeature';
import { ConfiguredDecorator } from '../data/1.17/ConfiguredDecorator';
import { GameVersion } from '../context/GameVersion';

export type GameRegistryKey =
  | 'block'
  | 'block_placer'
  | 'block_state'
  | 'block_state_provider'
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
  | 'worldgen/configured_decorator'
  | 'worldgen/configured_feature'
  | 'worldgen/configured_structure_feature'
  | 'worldgen/configured_surface_builder'
  | 'worldgen/noise_settings'
  | 'worldgen/processor_list';

export type RegistryKey = GameRegistryKey | WorldgenRegistryKey;

export interface Registry {
  options: Option[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Schema {}
export type RegistryEntries = { [identifier: string]: Schema };
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
    dimension: new WorldgenRegistry(Dimension, Dimensions),
    dimension_type: new WorldgenRegistry(DimensionType, DimensionTypes),
    'worldgen/biome': new WorldgenRegistry(DimensionType, Biomes),
    'worldgen/biome_source': new WorldgenRegistry(BiomeSource),
    'worldgen/chunk_generator': new WorldgenRegistry(
      ChunkGenerator,
      ChunkGenerators
    ),
    'worldgen/configured_carver': new WorldgenRegistry(DimensionType),
    'worldgen/configured_decorator': new WorldgenRegistry(ConfiguredDecorator),
    'worldgen/configured_feature': new WorldgenRegistry(ConfiguredFeature),
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
  readonly packFormat: number;

  constructor(version: GameVersion) {
    this.packFormat = version === '1.17' ? 7 : 6;
  }

  isRegistered(key: RegistryKey): key is WorldgenRegistryKey {
    return key in this.worldgen;
  }
}

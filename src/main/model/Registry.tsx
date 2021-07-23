import { Option } from '../component/ui/Select';
import { Model } from './Model';
import { DimensionType, DimensionTypes } from '../data/1.17/DimensionType';
import { ChunkGenerator, ChunkGenerators } from '../data/1.17/ChunkGenerator';
import { BiomeSource } from '../data/1.17/BiomeSource';
import {
  NoiseSettings,
  NoiseSettingsOptions
} from '../data/1.17/NoiseSettings';
import { Dimension, Dimensions } from '../data/1.17/Dimension';
import { ConfiguredFeature } from '../data/1.17/ConfiguredFeature';
import { ConfiguredDecorator } from '../data/1.17/ConfiguredDecorator';
import { GameVersion } from '../context/GameVersion';
import { Biome, Biomes } from '../data/1.17/Biome';
import JSZip from 'jszip';
import { stripDefaultNamespace } from '../util/LabelHelper';
import { loadVanillaZip } from '../util/FetchHelper';

export type GameRegistryKey =
  | 'block'
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
export class WorldgenRegistry implements Registry {
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
    this.options.push({
      label: '(Custom) ' + namespacedKey,
      value: namespacedKey
    });
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
  readonly worldgen: Record<WorldgenRegistryKey, WorldgenRegistry> = {
    dimension: new WorldgenRegistry(Dimension, Dimensions),
    dimension_type: new WorldgenRegistry(DimensionType, DimensionTypes),
    'worldgen/biome': new WorldgenRegistry(Biome, Biomes),
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
  vanillaZip?: JSZip;

  constructor(version: GameVersion | number) {
    this.packFormat =
      typeof version === 'number' ? version : version === '1.17' ? 7 : 6;
  }

  async vanillaResource(
    registry: WorldgenRegistryKey,
    namespacedKey: string
  ): Promise<Schema> {
    if (!this.vanillaZip) {
      this.vanillaZip = await loadVanillaZip();
    }
    const path =
      registry + '/' + stripDefaultNamespace(namespacedKey) + '.json';
    const file = this.vanillaZip.file(path);
    if (file === null) {
      return Promise.reject(
        new Error(
          `Unable to find the associated vanilla file (tested ${file}).`
        )
      );
    }
    return JSON.parse(await file.async('text'));
  }

  hasValues(): boolean {
    return Object.values(this.worldgen).some(
      (registry) => Object.keys(registry.entries).length > 0
    );
  }

  isRegistered(key: string): key is WorldgenRegistryKey {
    return key in this.worldgen;
  }

  register(
    registryKey: WorldgenRegistryKey,
    namespacedKey: string,
    schema: Record<string, unknown>
  ): void {
    this.worldgen[registryKey].register(namespacedKey, schema);
  }

  doesConflict(other: WorldgenRegistryHolder): number {
    let counter = 0;
    for (const [registryKey, registry] of this.entries) {
      for (const resourceKey of Object.keys(registry.entries)) {
        const entries = other.worldgen[registryKey].entries;
        if (resourceKey in entries) {
          counter += 1;
        }
      }
    }
    return counter;
  }

  merge(other: WorldgenRegistryHolder): void {
    for (const [registryKey, registry] of this.entries) {
      const o = other.worldgen[registryKey];
      Object.assign(registry.entries, o.entries);
      registry.options.push(...o.options);
    }
  }

  get entries(): [WorldgenRegistryKey, WorldgenRegistry][] {
    return Object.entries(this.worldgen) as [
      WorldgenRegistryKey,
      WorldgenRegistry
    ][];
  }
}

export const WorldgenNames: Record<WorldgenRegistryKey, string> = {
  dimension_type: 'dimension type',
  dimension: 'dimension',
  'worldgen/biome': 'biome',
  'worldgen/biome_source': 'biome source',
  'worldgen/chunk_generator': 'chunk generator',
  'worldgen/configured_carver': 'configured carver',
  'worldgen/configured_decorator': 'configured decorator',
  'worldgen/configured_feature': 'configured feature',
  'worldgen/configured_structure_feature': 'configured structure feature',
  'worldgen/configured_surface_builder': 'configured surface builder',
  'worldgen/noise_settings': 'noise settings',
  'worldgen/processor_list': 'processor list'
};
export function isWorldgenRegistry(key: string): key is WorldgenRegistryKey {
  return key in WorldgenNames;
}

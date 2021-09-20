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
import {
  GameVersion,
  PackFormatNumber,
  PackFormatString
} from '../context/GameVersion';
import { Biome, Biomes } from '../data/1.17/Biome';
import { customOption, stripDefaultNamespace } from '../util/LabelHelper';
import { loadVanillaZip } from '../util/FetchHelper';
import { ConfiguredCarver } from '../data/1.17/ConfiguredCarver';
import { ConfiguredSurfaceBuilder } from '../data/1.17/ConfiguredSurfaceBuilder';
import { ProcessorList } from '../data/1.17/StructureProcessor';
import { strFromU8, Unzipped } from 'fflate';
import type { WorldgenRegistryKey } from './RegistryKey';

export interface Registry {
  options: Option[];
  vanilla: Option[];
}

export type PostLoadCallback<S = Schema> = (schema: S) => void;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Schema {}
export type RegistryEntries = { [identifier: string]: Schema };
export class WorldgenRegistry implements Registry {
  readonly entries: RegistryEntries;
  readonly model: Model;
  options: Option[];
  vanilla: Option[];

  constructor(
    model: Model,
    vanilla: Option[] = [],
    entries: RegistryEntries = {}
  ) {
    this.model = model;
    this.options = [...vanilla];
    this.vanilla = vanilla;
    this.entries = entries;
  }

  register(namespacedKey: string, schema: Schema): Schema | undefined {
    const alreadyExists = this.entries[namespacedKey];
    this.entries[namespacedKey] = schema;
    if (!alreadyExists) {
      const options = this.options;
      const index = options.findIndex((o) => o.value === namespacedKey);
      const option = customOption(namespacedKey);
      if (index < 0) {
        options.push(option);
      } else {
        options[index] = option;
      }
    }
    return alreadyExists;
  }

  remove(namespacedKey: string): Schema {
    const exists = this.entries[namespacedKey];
    if (exists) {
      delete this.entries[namespacedKey];
      const options = this.options.filter((o) => o.value !== namespacedKey);
      const vanilla = this.vanilla.find((o) => o.value === namespacedKey);
      if (vanilla) {
        options.push(vanilla);
      }
      this.options = options;
    }
    return exists;
  }

  merge(other: WorldgenRegistry): void {
    for (const key of Object.keys(other.entries)) {
      if (!(key in this.entries)) {
        this.options.push(customOption(key));
      }
    }
    Object.assign(this.entries, other.entries);
  }

  withVanilla(current: readonly Option[]): this {
    const vanilla = this.vanilla;
    const empty = !vanilla.length;
    if (empty) {
      // Use the array directly without having to check for duplicates
      this.vanilla = [...current];
      if (!this.options.length) {
        // Are the custom options also empty?
        this.options = [...current];
        return this;
      }
    }

    let edited = false; // If the options array has been modified
    for (const option of current) {
      let pushOption = true;
      if (
        !empty &&
        (pushOption = !vanilla.some(
          (existing) => existing.value === option.value
        ))
      ) {
        vanilla.push(option);
      }
      if (pushOption && !(option.value in this.entries)) {
        this.options.push(option);
        edited = true;
      }
    }
    if (edited) {
      // Recreate the array to re-render
      this.options = [...this.options];
    }
    return this;
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
    'worldgen/configured_carver': new WorldgenRegistry(ConfiguredCarver),
    'worldgen/configured_decorator': new WorldgenRegistry(ConfiguredDecorator),
    'worldgen/configured_feature': new WorldgenRegistry(ConfiguredFeature),
    'worldgen/configured_structure_feature': new WorldgenRegistry(
      DimensionType
    ),
    'worldgen/configured_surface_builder': new WorldgenRegistry(
      ConfiguredSurfaceBuilder
    ),
    'worldgen/noise_settings': new WorldgenRegistry(
      NoiseSettings,
      NoiseSettingsOptions
    ),
    'worldgen/processor_list': new WorldgenRegistry(ProcessorList)
  };
  readonly packFormat: number;
  readonly gameVersion: GameVersion;
  vanillaZip?: Unzipped;

  constructor(version: GameVersion | keyof typeof PackFormatNumber) {
    this.packFormat =
      typeof version === 'number' ? version : PackFormatString[version];
    this.gameVersion =
      typeof version === 'number' ? PackFormatNumber[version] : version;
  }

  async vanillaResource(
    registry: WorldgenRegistryKey,
    namespacedKey: string,
    immediateSchema?: Schema,
    immediate?: (schema: Schema) => void
  ): Promise<Schema> {
    if (!this.vanillaZip) {
      if (immediateSchema && immediate) {
        immediate(immediateSchema);
      }
      this.vanillaZip = await loadVanillaZip(this.gameVersion);
    }
    const path =
      registry + '/' + stripDefaultNamespace(namespacedKey) + '.json';
    const file = this.vanillaZip[path];
    if (!file) {
      return Promise.reject(
        new Error(
          `Unable to find the associated vanilla file (tested ${path}).`
        )
      );
    }
    return JSON.parse(strFromU8(file));
  }

  withVanilla(current: WorldgenRegistryHolder): this {
    for (const [key, registry] of this.entries) {
      registry.withVanilla(current.worldgen[key].vanilla);
    }
    return this;
  }

  hasValues(): boolean {
    return Object.values(this.worldgen).some(
      (registry) => Object.keys(registry.entries).length > 0
    );
  }

  findNamespace(): string | undefined {
    for (const registry of Object.values(this.worldgen)) {
      for (const resourceKey of Object.keys(registry.entries)) {
        const sepIndex = resourceKey.indexOf(':');
        if (sepIndex >= 0) {
          const namespace = resourceKey.substr(0, sepIndex);
          if (namespace !== 'minecraft') {
            return namespace;
          }
        }
      }
    }
  }

  isRegistered(key: string): key is WorldgenRegistryKey {
    return key in this.worldgen;
  }

  register(
    registryKey: WorldgenRegistryKey,
    namespacedKey: string,
    schema: Schema
  ): Schema | undefined {
    return this.worldgen[registryKey].register(namespacedKey, schema);
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
    for (const [key, registry] of this.entries) {
      registry.merge(other.worldgen[key]);
    }
  }

  copyOptions(registryKeys: Iterable<WorldgenRegistryKey>): void {
    for (const key of registryKeys) {
      this.worldgen[key].options = [...this.worldgen[key].options];
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

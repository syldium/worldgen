import { strFromU8, Unzipped } from 'fflate';
import { Option } from '../component/ui/Select';
import {
  GameVersion,
  PackFormatNumber,
  PackFormatString
} from '../context/GameVersion';
import { Registries1_18_2 } from '../data/1.18.2/v1_18_2';
import { loadVanillaZip } from '../util/FetchHelper';
import { customOption, stripDefaultNamespace } from '../util/LabelHelper';
import { Model } from './Model';
import type {
  GameRegistryKey,
  RegistryKey,
  WorldgenRegistryKey
} from './RegistryKey';
import { GameRegistryKeys } from './RegistryKey';

export type ValueProvider = readonly Option[];
export type RegistryValueProvider = {
  [type in RegistryKey]?: { registry: ValueProvider; tag: ValueProvider };
};

export type Schema = unknown;
export type RegistryEntries = { [identifier: string]: Schema };

export class Registry {
  options: Option[] = [];
  vanilla: Option[] = [];
  readonly entries: RegistryEntries = {};
  private populated = false;

  constructor(vanilla: Option[] = []) {
    this.vanilla = vanilla;
    this.options = [...vanilla];
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

  withVanilla(current: readonly Option[]): this {
    if (this.populated || !current.length) {
      return this;
    }
    this.vanilla = [...current];
    this.populated = true;
    if (!this.options.length) {
      this.options = [...current];
      return this;
    }

    let edited = false; // If the options array has been modified
    for (const option of current) {
      if (!this.isRegistered(this.options, option)) {
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

  private isRegistered(collection: readonly Option[], option: Option) {
    return collection.some(
      (existing) => existing.value === option.value
    );
  }
}

export type PostLoadCallback<S = Schema> = (schema: S) => void;

export class WorldgenRegistry extends Registry {
  readonly model: Model;

  constructor(
    model: Model,
    vanilla: Option[] = []
  ) {
    super(vanilla);
    this.model = model;
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
}

export type BlockStateRegistry = {
  [block: string]: {
    properties: Record<string, string[]>;
    default: Record<string, string>;
  };
};
export const DEFAULT_BLOCK_STATE = { default: {}, properties: {} };

export type RegistryInfo = [Model, Option[]] | [Model];
export type WorldgenRegistriesType = Record<WorldgenRegistryKey, RegistryInfo>;
export class RegistryHolder {
  readonly game: Record<RegistryKey, Registry>;
  readonly tags: Record<RegistryKey, Registry>;
  readonly worldgen: Record<WorldgenRegistryKey, WorldgenRegistry>;
  readonly packFormat: number;
  readonly gameVersion: GameVersion;
  vanillaZip?: Unzipped;

  constructor(
    version: GameVersion | keyof typeof PackFormatNumber,
    provider: WorldgenRegistriesType = Registries1_18_2
  ) {
    this.packFormat = typeof version === 'number' ?
      version :
      PackFormatString[version];
    this.gameVersion = typeof version === 'number' ?
      PackFormatNumber[version] :
      version;
    this.worldgen = Object.fromEntries(
      Object.entries(provider).map(([key, registry]) => [
        key,
        // @ts-ignore
        new WorldgenRegistry(...registry)
      ])
    ) as Record<WorldgenRegistryKey, WorldgenRegistry>;
    const gameRegistries = Object.fromEntries(
      GameRegistryKeys.map((type) => [type, new Registry()])
    ) as Record<GameRegistryKey, Registry>;
    this.game = {
      ...this.worldgen,
      ...gameRegistries
    };
    this.tags = Object.fromEntries(
      Object.keys(this.game).map((type) => [type, new Registry()])
    ) as Record<RegistryKey, WorldgenRegistry>;
  }

  static async create(version: GameVersion): Promise<RegistryHolder> {
    switch (version) {
      case '1.19':
        return new RegistryHolder(
          version,
          (await import('../data/1.19/v1_19')).Registries1_19
        );
      case '1.18':
        return new RegistryHolder(
          version,
          (await import('../data/1.18/v1_18')).Registries1_18
        );
      case '1.17':
        return new RegistryHolder(
          version,
          (await import('../data/1.17/v1_17')).Registries1_17
        );
      default:
        return this.def();
    }
  }

  static def(): RegistryHolder {
    return new RegistryHolder('1.18.2', Registries1_18_2);
  }

  async resource(
    registry: WorldgenRegistryKey,
    namespacedKey: string,
    immediateSchema?: Schema,
    immediate?: (schema: Schema) => void
  ): Promise<Schema> {
    const entry = this.worldgen[registry].entries[namespacedKey];
    if (entry) {
      return entry;
    }
    return this.vanillaResource(
      registry,
      namespacedKey,
      immediateSchema,
      immediate
    );
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
    const path = registry + '/' + stripDefaultNamespace(namespacedKey) +
      '.json';
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

  withVanilla(vanilla: RegistryValueProvider): this {
    for (const [type, values] of Object.entries(vanilla)) {
      this.game[type as RegistryKey].withVanilla(values.registry);
      this.tags[type as RegistryKey].withVanilla(values.tag);
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
          const namespace = resourceKey.substring(0, sepIndex);
          if (namespace !== 'minecraft') {
            return namespace;
          }
        }
      }
    }
  }

  isWorldgen(key: string): key is WorldgenRegistryKey {
    return key in this.worldgen;
  }

  register(
    registryKey: WorldgenRegistryKey,
    namespacedKey: string,
    schema: Schema
  ): Schema | undefined {
    return this.worldgen[registryKey].register(namespacedKey, schema);
  }

  doesConflict(other: RegistryHolder): number {
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

  merge(other: RegistryHolder): void {
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
  block_predicate: 'block predicate',
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
  'worldgen/flat_level_generator_preset': 'flat level generator preset',
  'worldgen/material_condition': 'material condition',
  'worldgen/material_rule': 'material rule',
  'worldgen/noise': 'noise',
  'worldgen/noise_settings': 'noise settings',
  'worldgen/placed_feature': 'placed feature',
  'worldgen/placement_modifier': 'placement modifier',
  'worldgen/processor_list': 'processor list',
  'worldgen/structure': 'structure',
  'worldgen/structure_set': 'structure set',
  'worldgen/template_pool': 'template pool',
  'worldgen/world_preset': 'world preset'
};

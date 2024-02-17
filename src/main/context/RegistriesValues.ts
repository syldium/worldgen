import type { GameRegistryKey, RegistryKey } from '../model/RegistryKey';
import { dataUrl } from '../util/FetchHelper';
import type { GameVersion, PackFormatString } from './GameVersion';

export type Values = {
  registries: { [key in RegistryKey]?: string };
  tags: { [key in RegistryKey]?: string };
};
export type ValuesByVersion = {
  [
    version in keyof Omit<
      typeof PackFormatString,
      '1.16' | '1.17' | '1.18' | '1.18.2'
    >
  ]: Values;
};

const registryUrl = (version: GameVersion, registry: GameRegistryKey) =>
  `${dataUrl(version)}/${registry}/data.min.json`;
export const Labelled: Set<RegistryKey> = new Set([
  'worldgen/biome',
  'biome_particle'
]);
export const Values: ValuesByVersion = {
  '1.19': {
    tags: {
      'block': '1.19.3/tags/blocks.json',
      'worldgen/biome': '1.19.3/tags/worldgen/biome.json',
      'worldgen/flat_level_generator_preset':
        '1.19.3/tags/worldgen/flat_level_generator_preset.json',
      'worldgen/structure': '1.19.3/tags/worldgen/structure.json',
      'worldgen/world_preset': '1.19.3/tags/worldgen/world_preset.json'
    },
    registries: {
      'entity_type': registryUrl('1.19', 'entity_type'),
      'particle_type': registryUrl('1.19', 'particle_type'),
      'sound_event': registryUrl('1.19', 'sound_event'),
      'worldgen/biome': '1.19.3/worldgen/biome.json',
      'worldgen/configured_carver': '1.19.3/worldgen/configured_carver.json',
      'worldgen/configured_feature': '1.19.3/worldgen/configured_feature.json',
      'worldgen/density_function': '1.19.3/worldgen/density_function.json',
      'worldgen/flat_level_generator_preset':
        '1.19.3/worldgen/flat_level_generator_preset.json',
      'worldgen/noise': '1.19.3/worldgen/noise.json',
      'worldgen/noise_settings': '1.19.3/worldgen/noise_settings.json',
      'worldgen/placed_feature': '1.19.3/worldgen/placed_feature.json',
      'worldgen/processor_list': '1.19.3/worldgen/processor_list.json',
      'worldgen/structure': '1.19.3/worldgen/structure.json',
      'worldgen/structure_set': '1.19.3/worldgen/structure_set.json',
      'worldgen/template_pool': '1.19.3/worldgen/template_pool.json',
      'worldgen/world_preset': '1.19.3/worldgen/world_preset.json'
    }
  },
  '1.19.4': {
    tags: {
      'block': '1.19.4/tags/blocks.json',
      'worldgen/biome': '1.19.4/tags/worldgen/biome.json',
      'worldgen/flat_level_generator_preset':
        '1.19.3/tags/worldgen/flat_level_generator_preset.json',
      'worldgen/structure': '1.19.3/tags/worldgen/structure.json',
      'worldgen/world_preset': '1.19.3/tags/worldgen/world_preset.json'
    },
    registries: {
      'entity_type': registryUrl('1.19.4', 'entity_type'),
      'particle_type': registryUrl('1.19.4', 'particle_type'),
      'sound_event': registryUrl('1.19.4', 'sound_event'),
      'worldgen/biome': '1.19.3/worldgen/biome.json',
      'worldgen/configured_carver': '1.19.3/worldgen/configured_carver.json',
      'worldgen/configured_feature': '1.19.4/worldgen/configured_feature.json',
      'worldgen/density_function': '1.19.3/worldgen/density_function.json',
      'worldgen/flat_level_generator_preset':
        '1.19.3/worldgen/flat_level_generator_preset.json',
      'worldgen/noise': '1.19.3/worldgen/noise.json',
      'worldgen/noise_settings': '1.19.3/worldgen/noise_settings.json',
      'worldgen/placed_feature': '1.19.4/worldgen/placed_feature.json',
      'worldgen/processor_list': '1.19.3/worldgen/processor_list.json',
      'worldgen/structure': '1.19.3/worldgen/structure.json',
      'worldgen/structure_set': '1.19.3/worldgen/structure_set.json',
      'worldgen/template_pool': '1.19.3/worldgen/template_pool.json',
      'worldgen/world_preset': '1.19.3/worldgen/world_preset.json'
    }
  },
  '1.20.4': {
    tags: {
      'block': '1.20.4/tags/blocks.json',
      'worldgen/biome': '1.20.2/tags/worldgen/biome.json',
      'worldgen/flat_level_generator_preset':
        '1.19.4/tags/worldgen/flat_level_generator_preset.json',
      'worldgen/structure': '1.19.4/tags/worldgen/structure.json',
      'worldgen/world_preset': '1.19.4/tags/worldgen/world_preset.json'
    },
    registries: {
      'entity_type': registryUrl('1.20.4', 'entity_type'),
      'particle_type': registryUrl('1.20.4', 'particle_type'),
      'sound_event': registryUrl('1.20.4', 'sound_event'),
      'worldgen/biome': '1.20.2/worldgen/biome.json',
      'worldgen/configured_carver': '1.19.4/worldgen/configured_carver.json',
      'worldgen/configured_feature': '1.20.2/worldgen/configured_feature.json',
      'worldgen/density_function': '1.19.4/worldgen/density_function.json',
      'worldgen/flat_level_generator_preset':
        '1.19.4/worldgen/flat_level_generator_preset.json',
      'worldgen/noise': '1.19.4/worldgen/noise.json',
      'worldgen/noise_settings': '1.19.4/worldgen/noise_settings.json',
      'worldgen/placed_feature': '1.20.2/worldgen/placed_feature.json',
      'worldgen/processor_list': '1.20.2/worldgen/processor_list.json',
      'worldgen/structure': '1.20.2/worldgen/structure.json',
      'worldgen/structure_set': '1.20.2/worldgen/structure_set.json',
      'worldgen/template_pool': '1.20.2/worldgen/template_pool.json',
      'worldgen/world_preset': '1.19.4/worldgen/world_preset.json'
    }
  }
};

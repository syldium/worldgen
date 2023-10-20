import { RegistryKey } from '../model/RegistryKey';
import { PackFormatString } from './GameVersion';

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

export const Labelled: Set<RegistryKey> = new Set(['biome_particle']);
export const Values: ValuesByVersion = {
  '1.19': {
    registries: {
      'worldgen/flat_level_generator_preset':
        '1.19.3/worldgen/flat_level_generator_preset.json',
      'worldgen/noise': '1.19.3/worldgen/noise.json',
      'worldgen/template_pool': '1.19.3/worldgen/template_pool.json',
      'worldgen/noise_settings': '1.19.3/worldgen/noise_settings.json',
      'worldgen/biome': '1.19.3/worldgen/biome.json',
      'worldgen/world_preset': '1.19.3/worldgen/world_preset.json',
      'worldgen/structure_set': '1.19.3/worldgen/structure_set.json',
      'worldgen/configured_feature': '1.19.3/worldgen/configured_feature.json',
      'worldgen/processor_list': '1.19.3/worldgen/processor_list.json',
      'worldgen/density_function': '1.19.3/worldgen/density_function.json',
      'worldgen/structure': '1.19.3/worldgen/structure.json',
      'worldgen/placed_feature': '1.19.3/worldgen/placed_feature.json',
      'worldgen/configured_carver': '1.19.3/worldgen/configured_carver.json'
    },
    tags: {}
  },
  '1.19.4': {
    registries: {
      'worldgen/biome': '1.19.3/worldgen/biome.json',
      'worldgen/density_function': '1.19.3/worldgen/density_function.json',
      'worldgen/processor_list': '1.19.3/worldgen/processor_list.json',
      'worldgen/noise': '1.19.3/worldgen/noise.json',
      'worldgen/flat_level_generator_preset':
        '1.19.3/worldgen/flat_level_generator_preset.json',
      'worldgen/configured_feature': '1.19.4/worldgen/configured_feature.json',
      'worldgen/configured_carver': '1.19.3/worldgen/configured_carver.json',
      'worldgen/template_pool': '1.19.3/worldgen/template_pool.json',
      'worldgen/structure_set': '1.19.3/worldgen/structure_set.json',
      'worldgen/structure': '1.19.3/worldgen/structure.json',
      'worldgen/noise_settings': '1.19.3/worldgen/noise_settings.json',
      'worldgen/placed_feature': '1.19.4/worldgen/placed_feature.json',
      'worldgen/world_preset': '1.19.3/worldgen/world_preset.json'
    },
    tags: {}
  },
  '1.20': {
    registries: {
      'worldgen/biome': '1.20.2/worldgen/biome.json',
      'worldgen/structure': '1.20.2/worldgen/structure.json',
      'worldgen/processor_list': '1.20.2/worldgen/processor_list.json',
      'worldgen/noise_settings': '1.19.4/worldgen/noise_settings.json',
      'worldgen/flat_level_generator_preset':
        '1.19.4/worldgen/flat_level_generator_preset.json',
      'worldgen/configured_feature': '1.20.2/worldgen/configured_feature.json',
      'worldgen/density_function': '1.19.4/worldgen/density_function.json',
      'worldgen/configured_carver': '1.19.4/worldgen/configured_carver.json',
      'worldgen/noise': '1.19.4/worldgen/noise.json',
      'worldgen/world_preset': '1.19.4/worldgen/world_preset.json',
      'worldgen/template_pool': '1.20.2/worldgen/template_pool.json',
      'worldgen/structure_set': '1.20.2/worldgen/structure_set.json',
      'worldgen/placed_feature': '1.20.2/worldgen/placed_feature.json'
    },
    tags: {}
  }
};

export const GameRegistryKeys = [
  'block',
  'block_predicate',
  'block_state',
  'block_state_provider',
  'dimension',
  'dimension_type',
  'entity_type',
  'fluid',
  'particle_type',
  'sound_event',
  'structures'
] as const;
export type GameRegistryKey =
  | typeof GameRegistryKeys[number]
  | 'biome_particle';

const WorldgenRegistryKeys = [
  'block_predicate',
  'dimension',
  'dimension_type',
  'worldgen/biome',
  'worldgen/biome_source',
  'worldgen/chunk_generator',
  'worldgen/configured_carver',
  'worldgen/configured_decorator',
  'worldgen/configured_feature',
  'worldgen/configured_structure_feature',
  'worldgen/configured_surface_builder',
  'worldgen/material_condition',
  'worldgen/material_rule',
  'worldgen/noise',
  'worldgen/noise_settings',
  'worldgen/placed_feature',
  'worldgen/placement_modifier',
  'worldgen/processor_list',
  'worldgen/structure_set',
  'worldgen/template_pool'
] as const;
export type WorldgenRegistryKey = typeof WorldgenRegistryKeys[number];

export type RegistryKey = GameRegistryKey | WorldgenRegistryKey;

const set = new Set<string>([...GameRegistryKeys, ...WorldgenRegistryKeys]);
export const isRegistryKey = (key: string): key is RegistryKey => set.has(key);

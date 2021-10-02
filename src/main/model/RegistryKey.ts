export type GameRegistryKey =
  | 'biome_particle'
  | 'block'
  | 'block_state'
  | 'block_state_provider'
  | 'entity_type'
  | 'particle_type'
  | 'sound_event'
  | 'structure'
  | 'tags/blocks';

const WorldgenRegistryKeys = [
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
  'worldgen/noise_settings',
  'worldgen/processor_list'
] as const;
export type WorldgenRegistryKey = typeof WorldgenRegistryKeys[number];

export type RegistryKey = GameRegistryKey | WorldgenRegistryKey;

const set: Set<string> = new Set<WorldgenRegistryKey>(WorldgenRegistryKeys);
export function isWorldgenRegistryKey(key: string): key is WorldgenRegistryKey {
  return set.has(key);
}

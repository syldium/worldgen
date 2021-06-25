type GameRegistryKey =
  | 'block'
  | 'block_state'
  | 'entity_type'
  | 'predicate_type'
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

export type BlockStateRegistry = {
  [block: string]: {
    properties: Record<string, string[]>;
    default: Record<string, string>;
  };
};
export const DEFAULT_BLOCK_STATE = { default: {}, properties: {} };

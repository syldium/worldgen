import { EnumNode } from '../../model/node/EnumNode';

export const DecorationStep = EnumNode(
  [
    'raw_generation',
    'lakes',
    'local_modifications',
    'underground_structures',
    'surface_structures',
    'strongholds',
    'underground_ores',
    'underground_decoration',
    'fluid_springs',
    'vegetal_decoration',
    'top_layer_modification'
  ] as const
);

export const TerrainAdaptation = EnumNode(
  [
    'none',
    'bury',
    'beard_thin',
    'beard_box'
  ] as const,
  'none'
);

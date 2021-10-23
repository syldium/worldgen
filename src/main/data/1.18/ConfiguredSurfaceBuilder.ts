import { createSurfaceBuilderModel } from '../1.17/ConfiguredSurfaceBuilder';

const types = [
  'badlands',
  'basalt_deltas',
  'default',
  'eroded_badlands',
  'frozen_ocean',
  'giant_tree_taiga',
  'gravelly_mountain',
  'grove',
  'lofty_peaks',
  'mountain',
  'nether',
  'nether_forest',
  'nope',
  'shattered_savanna',
  'snowcapped_peaks',
  'snowy_slopes',
  'soul_sand_valley',
  'stone_shore',
  'stony_peaks',
  'swamp',
  'wooded_badlands'
] as const;

export const ConfiguredSurfaceBuilder = createSurfaceBuilderModel(types);
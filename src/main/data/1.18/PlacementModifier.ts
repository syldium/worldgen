import { SwitchNode } from '../../model/node/SwitchNode';
import { BlockPredicateSwitch } from './BlockPredicate';
import { EnumNode } from '../../model/node/EnumNode';
import { IntProvider } from '../1.17/NumberProvider';
import { Opt } from '../../model/node/ObjectNode';
import { IntNode } from '../../model/node/IntNode';
import { Heightmap } from '../1.17/WorldgenStep';
import { HeightProvider } from '../1.17/HeightProvider';
import { DoubleNode } from '../../model/node/FloatNode';
import { Model } from '../../model/Model';

const PlacementModifierSwitch = SwitchNode(
  {
    biome: {},
    block_predicate_filter: {
      predicate: BlockPredicateSwitch
    },
    carving_mask: {
      step: EnumNode(['air', 'liquid'] as const)
    },
    count: {
      count: IntProvider(0, 256)
    },
    count_on_every_layer: {
      count: IntProvider(0, 256)
    },
    environment_scan: {
      direction_of_search: EnumNode(['up', 'down'] as const),
      target_condition: BlockPredicateSwitch,
      allowed_search_condition: Opt(BlockPredicateSwitch),
      max_steps: IntNode({ min: 1, max: 32 })
    },
    heightmap: {
      heightmap: Heightmap
    },
    height_range: {
      height: HeightProvider
    },
    in_square: {},
    noise_based_count: {
      noise_to_count_ratio: IntNode(),
      noise_factor: DoubleNode(),
      noise_offset: DoubleNode({ default: 0 })
    },
    noise_threshold_count: {
      noise_level: DoubleNode(),
      below_noise: IntNode(),
      above_noise: IntNode()
    },
    rarity_filter: {
      chance: IntNode({ min: 1 })
    },
    random_offset: {
      xz_spread: IntProvider(-16, 16),
      y_spread: IntProvider(-16, 16)
    },
    surface_relative_threshold_filter: {
      heightmap: Heightmap,
      min_inclusive: Opt(IntNode()),
      max_inclusive: Opt(IntNode())
    },
    surface_water_depth_filter: {
      max_water_depth: IntNode()
    }
  },
  {},
  null
);

export const PlacementModifier: Model = {
  node: PlacementModifierSwitch,
  preset: () => ({})
};

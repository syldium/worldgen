import { Model } from '../../model/Model';
import { EnumNode } from '../../model/node/EnumNode';
import { DoubleNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { Empty, Obj, Opt } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { HeightProvider } from '../1.17/HeightProvider';
import { IntProvider } from '../1.17/NumberProvider';
import { Heightmap } from '../1.17/WorldgenStep';

const PlacementModifierSwitch = SwitchNode(
  {
    biome: Empty,
    block_predicate_filter: Obj({
      predicate: ResourceNode('block_predicate')
    }),
    carving_mask: Obj({
      step: EnumNode(['air', 'liquid'])
    }),
    count: Obj({
      count: IntProvider(0, 256)
    }),
    count_on_every_layer: Obj({
      count: IntProvider(0, 256)
    }),
    environment_scan: Obj({
      direction_of_search: EnumNode(['up', 'down']),
      target_condition: ResourceNode('block_predicate'),
      allowed_search_condition: Opt(ResourceNode('block_predicate')),
      max_steps: IntNode({ min: 1, max: 32 })
    }),
    heightmap: Obj({
      heightmap: Heightmap
    }),
    height_range: Obj({
      height: HeightProvider
    }),
    in_square: Empty,
    noise_based_count: Obj({
      noise_to_count_ratio: IntNode(),
      noise_factor: DoubleNode(),
      noise_offset: DoubleNode({ default: 0 })
    }),
    noise_threshold_count: Obj({
      noise_level: DoubleNode(),
      below_noise: IntNode(),
      above_noise: IntNode()
    }),
    rarity_filter: Obj({
      chance: IntNode({ min: 1 })
    }),
    random_offset: Obj({
      xz_spread: IntProvider(-16, 16),
      y_spread: IntProvider(-16, 16)
    }),
    surface_relative_threshold_filter: Obj({
      heightmap: Heightmap,
      min_inclusive: Opt(IntNode()),
      max_inclusive: Opt(IntNode())
    }),
    surface_water_depth_filter: Obj({
      max_water_depth: IntNode()
    })
  },
  {
    block_predicate_filter: {
      predicate: {
        blocks: ['minecraft:air'],
        type: 'minecraft:matching_blocks'
      }
    },
    carving_mask: {
      step: 'liquid'
    },
    count: {
      count: 64
    },
    count_on_every_layer: {
      count: 8
    },
    environment_scan: {
      direction_of_search: 'up',
      target_condition: {
        type: 'minecraft:solid'
      },
      allowed_search_condition: {
        blocks: ['minecraft:air'],
        type: 'minecraft:matching_blocks'
      },
      max_steps: 12
    },
    heightmap: {
      heightmap: 'WORLD_SURFACE_WG'
    },
    height_range: {
      height: {
        min_inclusive: {
          absolute: 40
        },
        max_inclusive: {
          absolute: 70
        },
        type: 'minecraft:uniform'
      }
    },
    noise_based_count: {
      noise_to_count_ratio: 160,
      noise_factor: 80.0,
      noise_offset: 0.3
    },
    noise_threshold_count: {
      noise_level: -0.8,
      below_noise: 15,
      above_noise: 4
    },
    rarity_filter: {
      chance: 32
    },
    random_offset: {
      xz_spread: 0,
      y_spread: -1
    },
    surface_relative_threshold_filter: {
      heightmap: 'OCEAN_FLOOR_WG',
      max_inclusive: -13
    },
    surface_water_depth_filter: {
      max_water_depth: 1
    }
  },
  null
);

export const PlacementModifier: Model = {
  node: PlacementModifierSwitch,
  preset: () => ({})
};

// surface_rule in noise_settings

import { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { DoubleNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Empty, Obj } from '../../model/node/ObjectNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { StringNode } from '../../model/node/StringNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { NoiseValues } from '../1.17/BiomeSource';
import { YOffset } from '../1.17/HeightProvider';
import { VerticalSurface } from '../1.17/WorldgenStep';

export const RuleCondition = SwitchNode(
  {
    above_preliminary_surface: Empty,
    biome: Obj({
      biome_is: ListNode(IdentifierNode('worldgen/biome'))
    }),
    hole: Empty,
    noise_threshold: Obj({
      name: StringNode(),
      noise: NoiseValues,
      min_threshold: DoubleNode(),
      max_threshold: DoubleNode()
    }),
    not: Obj({
      invert: ResourceNode('worldgen/material_condition')
    }),
    steep: Empty,
    stone_depth: Obj({
      offset: IntNode(),
      add_surface_depth: BoolNode(),
      add_surface_secondary_depth: BoolNode(),
      surface_type: VerticalSurface
    }),
    temperature: Empty,
    vertical_gradient: Obj({
      random_name: StringNode(),
      true_at_and_below: YOffset,
      false_at_and_above: YOffset
    }),
    water: Obj({
      offset: IntNode(),
      run_depth_multiplier: IntNode({ min: -20, max: 20 }),
      add_stone_depth: BoolNode()
    }),
    y_above: Obj({
      anchor: YOffset,
      run_depth_multiplier: IntNode({ min: -20, max: 20 }),
      add_stone_depth: BoolNode()
    })
  },
  {
    biome: {
      biome_is: ['minecraft:swamp']
    },
    noise_threshold: {
      noise: 'minecraft:surface',
      min_threshold: -0.9,
      max_threshold: -0.5
    },
    not: {
      invert: {
        type: 'minecraft:hole'
      }
    },
    stone_depth: {
      offset: 0,
      add_surface_depth: false,
      add_surface_secondary_depth: false,
      surface_type: 'ceiling'
    },
    vertical_gradient: {
      random_name: 'minecraft:bedrock_floor',
      true_at_and_below: {
        above_bottom: 0
      },
      false_at_and_above: {
        above_bottom: 5
      }
    },
    water: {
      offset: -1,
      surface_depth_multiplier: 0,
      add_stone_depth: false
    },
    y_above: {
      anchor: {
        absolute: 62
      },
      surface_depth_multiplier: 0,
      add_stone_depth: false
    }
  },
  null
);

export const RuleSource = SwitchNode(
  {
    bandlands: Empty,
    block: Obj({
      result_state: ResourceNode('block_state')
    }),
    condition: Obj({
      if_true: RuleCondition,
      then_run: ResourceNode('worldgen/material_rule')
    }),
    sequence: Obj({
      sequence: ListNode(ResourceNode('worldgen/material_rule'))
    })
  },
  {
    block: {
      result_state: {
        Name: 'coarse_dirt'
      }
    },
    condition: {
      if_true: {
        name: 'surface',
        noise: {
          firstOctave: -7,
          amplitudes: [1, 1, 1, 1]
        },
        min_threshold: -0.1818,
        max_threshold: 0.1818,
        type: 'minecraft:noise_threshold'
      },
      then_run: {
        result_state: {
          Name: 'minecraft:coarse_dirt'
        },
        type: 'minecraft:block'
      }
    }
  },
  null
);

export const MaterialRule: Model = {
  node: RuleSource,
  preset: () => ({})
};

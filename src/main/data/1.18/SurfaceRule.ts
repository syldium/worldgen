// surface_rule in noise_settings

import { BoolNode } from '../../model/node/BoolNode';
import { DoubleNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { NoiseValues } from '../1.17/BiomeSource';
import { Model } from '../../model/Model';
import { StringNode } from '../../model/node/StringNode';
import { YOffset } from '../1.17/HeightProvider';
import { VerticalSurface } from '../1.17/WorldgenStep';

export const RuleCondition = SwitchNode(
  {
    above_preliminary_surface: {},
    biome: {
      biome_is: ListNode(IdentifierNode('worldgen/biome'))
    },
    hole: {},
    noise_threshold: {
      name: StringNode(),
      noise: NoiseValues,
      min_threshold: DoubleNode(),
      max_threshold: DoubleNode()
    },
    not: {
      invert: ResourceNode('worldgen/material_condition')
    },
    steep: {},
    stone_depth: {
      offset: IntNode(),
      add_surface_depth: BoolNode(),
      add_surface_secondary_depth: BoolNode(),
      surface_type: VerticalSurface
    },
    temperature: {},
    vertical_gradient: {
      random_name: StringNode(),
      true_at_and_below: YOffset,
      false_at_and_above: YOffset
    },
    water: {
      offset: IntNode(),
      run_depth_multiplier: IntNode({ min: -20, max: 20 }),
      add_stone_depth: BoolNode()
    },
    y_above: {
      anchor: YOffset,
      run_depth_multiplier: IntNode({ min: -20, max: 20 }),
      add_stone_depth: BoolNode()
    }
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
    bandlands: {},
    block: {
      result_state: ResourceNode('block_state')
    },
    condition: {
      if_true: RuleCondition,
      then_run: ResourceNode('worldgen/material_rule')
    },
    sequence: {
      sequence: ListNode(ResourceNode('worldgen/material_rule'))
    }
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

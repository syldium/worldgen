import { SwitchNode } from '../../model/node/SwitchNode';
import { Model, ObjectModel } from '../../model/Model';
import { ListNode } from '../../model/node/ListNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { IntNode } from '../../model/node/IntNode';
import { Heightmap } from './WorldgenStep';
import { EnumNode, EnumNodeParams } from '../../model/node/EnumNode';
import { ObjectNode } from '../../model/node/ObjectNode';
import { FloatNode, Probability } from '../../model/node/FloatNode';
import { EitherNode } from '../../model/node/EitherNode';
import { Axis } from '../Axis';

const BlockAgeConfig: ObjectModel = {
  mossiness: FloatNode()
};
const BlockIgnoreConfig: ObjectModel = {
  blocks: ListNode(ResourceNode('block_state'))
};
const BlockRotConfig: ObjectModel = {
  integrity: IntNode({ default: 1 })
};
const GravityConfig: ObjectModel = {
  heightmap: {
    ...Heightmap,
    default: Heightmap.values.find((o) => o.value === 'WORLD_SURFACE_WG')
  } as EnumNodeParams,
  offset: IntNode({ default: 0 })
};

const RuleTest = SwitchNode(
  {
    always_true: {},
    block_match: {
      block: ResourceNode('block')
    },
    blockstate_match: {
      block_state: ResourceNode('block_state')
    },
    random_block_match: {
      block: ResourceNode('block'),
      ...Probability
    },
    random_blockstate_match: {
      block_state: ResourceNode('block_state'),
      ...Probability
    },
    tag_match: {
      tag: IdentifierNode('tags/blocks')
    }
  },
  {},
  null,
  'predicate_type'
);

const LinearPosTest: ObjectModel = {
  min_chance: FloatNode({ default: 0 }),
  max_chance: FloatNode({ default: 0 }),
  min_dist: FloatNode({ default: 0 }),
  max_dist: FloatNode({ default: 0 })
};

const PosRuleTest = SwitchNode(
  {
    always_true: {},
    linear_pos: LinearPosTest,
    axis_aligned_linear_pos: {
      ...LinearPosTest,
      axis: EnumNode(Axis, 'y')
    }
  },
  {},
  null,
  'predicate_type'
);

const ProcessorRule = ObjectNode({
  input_predicate: RuleTest,
  location_predicate: RuleTest,
  position_predicate: PosRuleTest,
  output_state: ResourceNode('block_state')
  //output_nbt: StringNode()
});

const CarrotRuleProcessor = {
  rules: [
    {
      output_state: {
        Properties: {
          age: '0'
        },
        Name: 'minecraft:potatoes'
      },
      input_predicate: {
        block: 'minecraft:wheat',
        probability: 0.2,
        predicate_type: 'minecraft:random_block_match'
      },
      location_predicate: {
        predicate_type: 'minecraft:always_true'
      }
    }
  ]
};

const StructureProcessor = SwitchNode(
  {
    blackstone_replace: {},
    block_age: BlockAgeConfig,
    block_ignore: BlockIgnoreConfig,
    block_rot: BlockRotConfig,
    gravity: GravityConfig,
    jigsaw_replacement: {},
    lava_submerged_block: {},
    nop: {},
    protected_blocks: {},
    rule: { rules: ListNode(ProcessorRule) }
  },
  {
    block_age: {
      mossiness: 0.05
    },
    block_ignore: {
      blocks: []
    },
    block_rot: {
      integrity: 0.05
    },
    rule: CarrotRuleProcessor
  },
  null,
  'processor_type'
);

const ProcessorListNode = ListNode(StructureProcessor);

export const ProcessorList: Model = {
  node: EitherNode({ processors: ProcessorListNode }, ProcessorListNode),
  preset: () => ({
    processors: [CarrotRuleProcessor]
  })
};

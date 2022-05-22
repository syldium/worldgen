import type { Model } from '../../model/Model';
import { EitherNode } from '../../model/node/EitherNode';
import { EnumNode, EnumNodeParams } from '../../model/node/EnumNode';
import { FloatNode, Probability } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Empty, Obj, OrElse } from '../../model/node/ObjectNode';
import { ResourceNode, TagNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { Axis } from '../Axis';
import { Heightmap } from './WorldgenStep';

const BlockAgeConfig = Obj({
  mossiness: FloatNode()
});
const BlockIgnoreConfig = Obj({
  blocks: ListNode(ResourceNode('block_state'))
});
const BlockRotConfig = Obj({
  integrity: FloatNode({ default: 1 })
});
const GravityConfig = Obj({
  heightmap: {
    ...Heightmap,
    default: Heightmap.values.find((o) => o.value === 'WORLD_SURFACE_WG')
  } as EnumNodeParams,
  offset: IntNode({ default: 0 })
});

const RuleTest = SwitchNode(
  {
    always_true: Empty,
    block_match: Obj({
      block: ResourceNode('block')
    }),
    blockstate_match: Obj({
      block_state: ResourceNode('block_state')
    }),
    random_block_match: Obj({
      block: ResourceNode('block'),
      ...Probability
    }),
    random_blockstate_match: Obj({
      block_state: ResourceNode('block_state'),
      ...Probability
    }),
    tag_match: Obj({
      tag: TagNode('block')
    })
  },
  {},
  null,
  'predicate_type'
);

const LinearPosTest = Obj({
  min_chance: FloatNode({ default: 0 }),
  max_chance: FloatNode({ default: 0 }),
  min_dist: FloatNode({ default: 0 }),
  max_dist: FloatNode({ default: 0 })
});

const PosRuleTest = OrElse(
  SwitchNode(
    {
      always_true: Empty,
      linear_pos: LinearPosTest,
      axis_aligned_linear_pos: Obj({
        ...LinearPosTest.records,
        axis: EnumNode(Axis, 'y')
      })
    },
    {},
    null,
    'predicate_type'
  ),
  { predicate_type: 'always_true' }
);

const ProcessorRule = Obj({
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
    blackstone_replace: Empty,
    block_age: BlockAgeConfig,
    block_ignore: BlockIgnoreConfig,
    block_rot: BlockRotConfig,
    gravity: GravityConfig,
    jigsaw_replacement: Empty,
    lava_submerged_block: Empty,
    nop: Empty,
    protected_blocks: Empty,
    rule: Obj({ rules: ListNode(ProcessorRule) })
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
  node: EitherNode(
    Obj({ processors: ProcessorListNode }),
    ProcessorListNode
  ),
  preset: () => ({
    processors: [CarrotRuleProcessor]
  })
};

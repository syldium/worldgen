import { Model } from '../../model/Model';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Empty, Obj, Opt } from '../../model/node/ObjectNode';
import { ResourceNode, TagNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { Direction } from '../1.17/Direction';

const List = ListNode(ResourceNode('block_predicate'));
const Offset = Opt(ListNode(IntNode({ min: -16, max: 16 }), 3));

export const BlockPredicateSwitch = SwitchNode(
  {
    all_of: Obj({
      predicates: List
    }),
    any_of: Obj({
      predicates: List
    }),
    has_sturdy_face: Obj({
      offset: Offset,
      direction: Direction
    }),
    inside_world_bounds: Obj({
      offset: Offset
    }),
    matching_blocks: Obj({
      blocks: ListNode(ResourceNode('block')),
      offset: Offset
    }),
    matching_block_tag: Obj({
      offset: Offset,
      tag: TagNode('block')
    }),
    matching_fluids: Obj({
      blocks: ListNode(ResourceNode('block')), // TODO fluid type
      offset: Offset
    }),
    not: Obj({
      predicate: ResourceNode('block_predicate')
    }),
    replaceable: Obj({
      offset: Offset
    }),
    solid: Obj({
      offset: Offset
    }),
    true: Empty,
    would_survive: Obj({
      offset: Offset,
      state: ResourceNode('block_state')
    })
  },
  {
    all_of: {
      predicates: [
        {
          offset: [0, -1, 0],
          blocks: ['minecraft:stone'],
          type: 'minecraft:matching_blocks'
        },
        {
          blocks: ['minecraft:water'],
          type: 'minecraft:matching_blocks'
        }
      ]
    },
    any_of: {
      predicates: []
    },
    has_sturdy_face: {
      direction: 'down'
    },
    matching_blocks: {
      blocks: ['minecraft:air']
    },
    matching_block_tag: {
      tag: 'base_stone_overworld'
    },
    not: {
      predicate: {
        blocks: ['minecraft:powder_snow'],
        type: 'minecraft:matching_blocks'
      }
    },
    would_survive: {
      state: {
        Properties: {
          stage: '0'
        },
        Name: 'minecraft:oak_sapling'
      }
    }
  },
  null
);

export const BlockPredicate: Model = {
  node: BlockPredicateSwitch,
  preset: () => ({})
};

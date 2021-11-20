import { SwitchNode } from '../../model/node/SwitchNode';
import { ListNode } from '../../model/node/ListNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { Opt } from '../../model/node/ObjectNode';
import { IntNode } from '../../model/node/IntNode';
import { Model } from '../../model/Model';
import { Direction } from '../1.17/Direction';

const List = ListNode(ResourceNode('block_predicate'));
const Offset = Opt(ListNode(IntNode({ min: -16, max: 16 }), 3));

export const BlockPredicateSwitch = SwitchNode({
  all_of: {
    predicates: List
  },
  any_of: {
    predicates: List
  },
  has_sturdy_face: {
    offset: Offset,
    direction: Direction
  },
  inside_world_bounds: {
    offset: Offset
  },
  matching_blocks: {
    blocks: ListNode(ResourceNode('block')),
    offset: Offset
  },
  matching_block_tag: {
    offset: Offset,
    tag: ResourceNode('tags/blocks')
  },
  matching_fluids: {
    blocks: ListNode(ResourceNode('block')), // TODO fluid type
    offset: Offset
  },
  not: {
    predicate: ResourceNode('block_predicate')
  },
  replaceable: {
    offset: Offset
  },
  solid: {
    offset: Offset
  },
  true: {},
  would_survive: {
    offset: Offset,
    state: ResourceNode('block_state')
  }
});

export const BlockPredicate: Model = {
  node: BlockPredicateSwitch,
  preset: () => ({})
};

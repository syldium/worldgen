import { Model } from '../../model/Model';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj, Opt } from '../../model/node/ObjectNode';
import { TagNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import {
  BlockPredicate as BlockPredicate1_18,
  BlockPredicateSwitch as predicates1_18
} from '../1.18/BlockPredicate';

const Offset = Opt(ListNode(IntNode({ min: -16, max: 16 }), 3));
export const BlockPredicate: Model = {
  node: SwitchNode(
    {
      ...predicates1_18.values,
      matching_blocks: Obj({
        blocks: TagNode('block'),
        offset: Offset
      }),
      matching_fluids: Obj({
        fluids: TagNode('fluid'),
        offset: Offset
      })
    },
    predicates1_18.preset,
    predicates1_18.config
  ),
  preset: BlockPredicate1_18.preset
};

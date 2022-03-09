import { EitherNode, EitherNodeParams } from '../../model/node/EitherNode';
import { NumberNodeParams } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj } from '../../model/node/ObjectNode';

export const RangeInterval = (
  node: NumberNodeParams,
  min = 'min',
  max = 'max'
): EitherNodeParams =>
  EitherNode(
    Obj({
      [min]: node,
      [max]: node
    }),
    ListNode(node, 2),
    node
  );

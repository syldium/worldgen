import { EitherNode, EitherNodeParams } from '../../model/node/EitherNode';
import { ListNode } from '../../model/node/ListNode';
import { NumberNodeParams } from '../../model/node/IntNode';
import { ObjectNode } from '../../model/node/ObjectNode';

export const RangeInterval = (
  node: NumberNodeParams,
  min = 'min',
  max = 'max'
): EitherNodeParams =>
  EitherNode(
    ObjectNode({
      [min]: node,
      [max]: node
    }),
    ListNode(node, 2),
    node
  );

import { EitherNode, EitherNodeParams } from '../../model/node/EitherNode';
import { NumberNodeParams } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
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

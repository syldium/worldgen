import type { ModelNode, NodeBase } from './Node';

export interface ListNodeParams<T extends ModelNode = ModelNode>
  extends NodeBase<'list'>
{
  of: T;
  fixed: number;
  weighted: boolean;
}

export const ListNode = <T extends ModelNode = ModelNode>(
  of: T,
  fixedSize = -1,
  weighted = false
): ListNodeParams<T> => {
  return {
    of,
    fixed: fixedSize,
    weighted: weighted,
    type: 'list',
    isValid: (value) =>
      Array.isArray(value) && (fixedSize === -1 || value.length === fixedSize)
  };
};

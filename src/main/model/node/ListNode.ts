import { NodeBase, NodeType } from './Node';

export interface ListNodeParams<T> extends NodeBase<'list'> {
  of: T;
  fixed: number;
  weighted: boolean;
}

export const ListNode = <T extends NodeBase<U>, U extends NodeType>(
  of: T,
  fixedSize = -1,
  weighted = false
): ListNodeParams<T> => {
  return {
    of,
    fixed: fixedSize,
    weighted: weighted,
    type: 'list',
    isValid: Array.isArray
  };
};

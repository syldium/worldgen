import { NodeBase, NodeType } from './Node';

export interface ListNodeParams<T> extends NodeBase<'list'> {
  of: T;
  weighted: boolean;
}

export const ListNode = <T extends NodeBase<U>, U extends NodeType>(
  of: T,
  weighted = false
): ListNodeParams<T> => {
  return {
    of,
    weighted: weighted,
    type: 'list',
    isValid: Array.isArray
  };
};

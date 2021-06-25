import { NodeBase, ModelNode } from './Node';

export interface EitherNodeParams extends NodeBase<'either'> {
  first: ModelNode;
  second: ModelNode;
}

export const EitherNode = (
  first: ModelNode,
  second: ModelNode
): EitherNodeParams => ({
  first,
  second,
  type: 'either',
  isValid: (value: unknown) => first.isValid(value) || second.isValid(value)
});

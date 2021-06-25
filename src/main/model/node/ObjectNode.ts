import { ModelNode, NodeBase } from './Node';

export interface ObjectNodeParams extends NodeBase<'object'> {
  records: Record<string, ModelNode>;
}

export const ObjectNode = (
  records: Record<string, ModelNode>
): ObjectNodeParams => ({
  records,
  type: 'object',
  isValid: (value: unknown) => {
    if (value === null || typeof value !== 'object') {
      return false;
    }
    for (const [name, node] of Object.entries(records)) {
      if (
        node.type !== 'optional' &&
        !Object.prototype.hasOwnProperty.call(value, name)
      ) {
        return false;
      }
    }
    return true;
  }
});

export interface OptionalNodeParams extends NodeBase<'optional'> {
  node: ModelNode;
}

export const Opt = (node: ModelNode): OptionalNodeParams => ({
  node,
  type: 'optional',
  isValid: (value: unknown) => value == null || node.isValid(value)
});

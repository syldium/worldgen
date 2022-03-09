import type { ModelNode, NodeBase } from './Node';

export interface ObjectNodeParams extends NodeBase<'object'> {
  records: Record<string, ModelNode>;
}

export const Obj = (
  records: Record<string, ModelNode>,
  def?: Record<string, unknown>
): ObjectNodeParams => ({
  default: def,
  records,
  type: 'object',
  isValid: (value: unknown) => {
    if (value === null || typeof value !== 'object') {
      return false;
    }
    return Object.entries(records).every(([name, node]) =>
      node.isValid((value as Record<string, unknown>)[name])
    );
  }
});
export const Empty = Obj({});

export interface OptionalNodeParams extends NodeBase<'optional'> {
  node: ModelNode;
}

export const Opt = (node: ModelNode): OptionalNodeParams => ({
  node,
  type: 'optional',
  isValid: (value: unknown) => value == null || node.isValid(value)
});

export const OrElse = <T extends ModelNode>(node: T, defValue: unknown): T => {
  node.default = defValue;
  return node;
};

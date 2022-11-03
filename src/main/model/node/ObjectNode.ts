import type { RegistryHolder } from '../Registry';
import type { ModelNode, NodeBase } from './Node';
import type { ErrorCollector } from './Node';

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
  validate: function (
    path: string,
    value: unknown,
    errors: ErrorCollector,
    holder?: RegistryHolder
  ) {
    if (value == null && typeof this.default !== 'undefined') {
      return;
    } else if (typeof value !== 'object') {
      return errors.add(path, 'Expected an object');
    }
    const obj = value as Record<string, unknown>;
    for (const key in this.records) {
      this.records[key].validate(path + '.' + key, obj[key], errors, holder);
    }
  }
});
export const Empty = Obj({});

export interface OptionalNodeParams extends NodeBase<'optional'> {
  node: ModelNode;
}

export const Opt = (node: ModelNode): OptionalNodeParams => ({
  node,
  type: 'optional',
  validate: (
    path: string,
    value: unknown,
    errors: ErrorCollector,
    holder?: RegistryHolder
  ) => value == null || node.validate(path, value, errors, holder)
});

export const OrElse = <T extends ModelNode>(node: T, defValue: unknown): T => {
  node.default = defValue;
  return node;
};

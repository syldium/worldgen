import type { ModelNode, NodeBase, ValidationContext } from './Node';
import type { ErrorCollector } from './Node';
import { nestedValidationContext } from './Node';

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
    ctx?: ValidationContext
  ) {
    if (value == null && typeof this.default !== 'undefined') {
      return;
    } else if (typeof value !== 'object') {
      return errors.add(path, 'Expected an object');
    }
    const obj = value as Record<string, unknown>;
    for (const key in this.records) {
      ctx?.ignoreKeys?.add(key);
      this.records[key].validate(
        path + '.' + key,
        obj[key],
        errors,
        nestedValidationContext(ctx)
      );
    }
    if (ctx?.ignoreKeys) {
      for (const key in obj) {
        if (
          !(key in this.records) && !ctx.ignoreKeys.has(key) && this !== Empty
        ) {
          errors.add(
            path + '.' + key,
            `Unknown ${key} key (available: ${
              Object.keys(this.records).join(',')
            })`
          );
        }
      }
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
    ctx?: ValidationContext
  ) => value == null || node.validate(path, value, errors, ctx)
});

export const OrElse = <T extends ModelNode>(node: T, defValue: unknown): T => {
  node.default = defValue;
  return node;
};

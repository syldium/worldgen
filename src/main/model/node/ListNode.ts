import type { ModelNode, NodeBase, ValidationContext } from './Node';
import type { ErrorCollector } from './Node';
import { nestedValidationContext } from './Node';

export interface ListNodeParams<T extends ModelNode = ModelNode>
  extends NodeBase<'list'>
{
  of: T;
  fixed: number;
  weighted: boolean;
  one: boolean;
}

export const ListNode = <T extends ModelNode = ModelNode>(
  of: T,
  fixedSize = -1,
  weighted = false,
  one = false
): ListNodeParams<T> => {
  return {
    of,
    fixed: fixedSize,
    weighted,
    one,
    type: 'list',
    validate: function (
      path: string,
      value: unknown,
      errors: ErrorCollector,
      ctx?: ValidationContext
    ) {
      ctx = nestedValidationContext(ctx);
      if (!Array.isArray(value)) {
        if (this.one) {
          return this.of.validate(path, value, errors, ctx);
        }
        return errors.add(path, 'Expected an array');
      }
      if (this.fixed !== -1 && value.length !== fixedSize) {
        errors.add(path, 'Expected an array of length ' + fixedSize);
      }
      for (const i in value) {
        if (this.weighted) {
          this.of.validate(
            path + '[' + i + '].data',
            value[i].data,
            errors,
            ctx
          );
        } else {
          this.of.validate(path + '[' + i + ']', value[i], errors, ctx);
        }
      }
    }
  };
};

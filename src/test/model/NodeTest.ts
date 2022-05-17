import type { ModelNode, PathError } from '../../main/model/node/Node';
import { ErrorCollector } from '../../main/model/node/Node';

export function validate(node: ModelNode, value: unknown): true | PathError[] {
  const errors = new ErrorCollector();
  node.validate('', value, errors);
  if (!errors.size) {
    return true;
  }
  return errors.errors;
}

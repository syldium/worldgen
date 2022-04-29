import type { NodeBase } from './Node';
import type { ErrorCollector } from './Node';

export type StringNodeParams = NodeBase<'string'>;
export const StringNode = (def?: string): StringNodeParams => ({
  default: def,
  type: 'string',
  validate: function (path: string, value: unknown, errors: ErrorCollector) {
    if (value == null && typeof this.default === 'string') {
      return;
    }
    if (typeof value !== 'string') {
      errors.add(path, 'Excepted a string');
    }
  }
});

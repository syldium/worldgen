import type { ErrorCollector, NodeBase } from './Node';

export interface BoolNodeParams extends NodeBase<'bool'> {
  default?: boolean;
}

export const BoolNode = (def?: boolean): BoolNodeParams => {
  return {
    default: def,
    type: 'bool',
    validate: function (path: string, value: unknown, errors: ErrorCollector) {
      if (value == null && typeof this.default === 'boolean') {
        return;
      }
      if (typeof value !== 'boolean') {
        errors.add(path, 'Expected a boolean');
      }
    }
  };
};

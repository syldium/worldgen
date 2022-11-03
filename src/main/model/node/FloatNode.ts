import type { NumberNodeParams } from './IntNode';
import type { ErrorCollector } from './Node';

export const FloatNode = (
  config?: Partial<NumberNodeParams>
): NumberNodeParams => {
  const min = config?.min;
  const max = config?.max;
  const step = config?.step ?? 0.1;
  return {
    preset: config?.preset ?? 0,
    min,
    max,
    step,
    default: config?.default,
    type: 'float',
    validate: function (path: string, value: unknown, errors: ErrorCollector) {
      if (value == null && typeof this.default === 'number') {
        return;
      }
      if (typeof value !== 'number' || Number.isNaN(value)) {
        errors.add(path, 'Expected a floating point number');
      } else if (
        typeof this.min === 'number' && value < this.min ||
        typeof this.max === 'number' && value > this.max
      ) {
        errors.add(
          path,
          `Expected a floating point number between ${this.min} and ${this.max}`
        );
      }
    }
  };
};

export const DoubleNode = FloatNode;

export const Probability = {
  probability: FloatNode({ min: 0, max: 1 })
};

export const Range = {
  range: FloatNode({ min: 0, max: 1 })
};

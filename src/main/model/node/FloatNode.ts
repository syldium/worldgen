import {
  FLOAT_MAX_VALUE,
  FLOAT_MIN_VALUE,
  isInRange
} from '../../util/MathHelper';
import type { NumberNodeParams } from './IntNode';
import type { ErrorCollector } from './Node';

export const FloatNode = (
  config?: Partial<NumberNodeParams>
): NumberNodeParams => {
  const min = config?.min ?? FLOAT_MIN_VALUE;
  const max = config?.max ?? FLOAT_MAX_VALUE;
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
      if (Number.isNaN(value) || !isInRange(value as number, min, max)) {
        errors.add(path, 'Expected a floating point number');
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

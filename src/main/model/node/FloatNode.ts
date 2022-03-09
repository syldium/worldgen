import {
  FLOAT_MAX_VALUE,
  FLOAT_MIN_VALUE,
  isInRange
} from '../../util/MathHelper';
import { NumberNodeParams } from './IntNode';

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
    isValid: (value: unknown) =>
      !Number.isNaN(value) && isInRange(value as number, min, max, step)
  };
};

export const DoubleNode = FloatNode;

export const Probability = {
  probability: FloatNode({ min: 0, max: 1 })
};

export const Range = {
  range: FloatNode({ min: 0, max: 1 })
};

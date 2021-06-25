import { NodeBase } from './Node';
import {
  INT_MAX_VALUE,
  INT_MIN_VALUE,
  isInRange,
  LONG_MAX_VALUE,
  LONG_MIN_VALUE
} from '../../util/MathHelper';

export interface NumberNodeParams extends NodeBase<'int' | 'float'> {
  /** A preset value for the generator */
  preset: number;

  /** The minimum accepted value */
  min: number;

  /** The maximum accepted value */
  max: number;

  /** Number to divide the value by (0 = any) */
  step: number;

  /** A default value for the game, when the node is absent */
  default?: number;
}

export const IntNode = (
  config?: Partial<NumberNodeParams>
): NumberNodeParams => {
  const min = config?.min ?? INT_MIN_VALUE;
  const max = config?.max ?? INT_MAX_VALUE;
  const step = config?.step ?? 1;
  return {
    preset: config?.preset ?? 0,
    min,
    max,
    step,
    default: config?.default,
    type: 'int',
    isValid: (value: unknown) =>
      Number.isInteger(value) && isInRange(value as number, min, max, step)
  };
};

export const LongNode = (
  config?: Partial<NumberNodeParams>
): NumberNodeParams =>
  IntNode({
    min: config?.min ?? LONG_MIN_VALUE,
    max: config?.max ?? LONG_MAX_VALUE
  });

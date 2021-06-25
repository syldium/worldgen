import { NodeBase } from './Node';

export interface BoolNodeParams extends NodeBase<'bool'> {
  default?: boolean;
}

const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean';
export const BoolNode = (def?: boolean): BoolNodeParams => {
  return { default: def, type: 'bool', isValid: isBoolean };
};

import type { NodeBase } from './Node';

export type StringNodeParams = NodeBase<'string'>;
export const StringNode = (def?: string): StringNodeParams => ({
  default: def,
  type: 'string',
  isValid: (val) => typeof val === 'string'
});

import { EnumNode } from '../../model/node/EnumNode';

export const Direction = EnumNode(
  [
    'down',
    'up',
    'north',
    'south',
    'west',
    'east'
  ] as const
);

import { SwitchNode } from '../../model/node/SwitchNode';
import { IntProvider } from './NumberProvider';

export const BlockPlacer = SwitchNode(
  {
    simple_block_placer: {},
    double_plant_placer: {},
    column_placer: {
      value: IntProvider()
    }
  },
  {
    column_placer: {
      size: {
        type: 'minecraft:biased_to_bottom',
        value: {
          min_inclusive: 1,
          max_inclusive: 3
        }
      }
    }
  },
  null
);

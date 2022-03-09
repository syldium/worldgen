import { Empty, Obj } from '../../model/node/ObjectNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { IntProvider } from './NumberProvider';

export const BlockPlacer = SwitchNode(
  {
    simple_block_placer: Empty,
    double_plant_placer: Empty,
    column_placer: Obj({
      value: IntProvider()
    })
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

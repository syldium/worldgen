import { Model, ObjectModel } from '../../model/Model';
import { Heightmap } from '../1.17/WorldgenStep';
import { IntNode } from '../../model/node/IntNode';
import { INT_MAX_VALUE, INT_MIN_VALUE } from '../../util/MathHelper';
import {
  ConfiguredDecorator as Decorator1_17,
  DecoratorsSwitch
} from '../1.17/ConfiguredDecorator';
import { SwitchNode } from '../../model/node/SwitchNode';

const SurfaceRelativeThresholdConfig: ObjectModel = {
  heightmap: Heightmap,
  min_inclusive: IntNode({ default: INT_MIN_VALUE }),
  max_inclusive: IntNode({ default: INT_MAX_VALUE })
};

export const ConfiguredDecorator: Model = {
  node: SwitchNode(
    {
      ...DecoratorsSwitch.values,
      surface_relative_threshold: SurfaceRelativeThresholdConfig
    },
    {
      ...DecoratorsSwitch.preset,
      surface_relative_threshold: {
        config: {
          heightmap: 'OCEAN_FLOOR_WG',
          max_inclusive: -13
        }
      }
    }
  ),
  preset: Decorator1_17.preset
};

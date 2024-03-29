import { Model } from '../../model/Model';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { INT_MAX_VALUE, INT_MIN_VALUE } from '../../util/MathHelper';
import {
  ConfiguredDecorator as Decorator1_17,
  DecoratorsSwitch
} from '../1.17/ConfiguredDecorator';
import { BlockPos } from '../1.17/ConfiguredFeature';
import { Heightmap } from '../1.17/WorldgenStep';

const BlockFilterConfig = Obj({
  allowed: ListNode(ResourceNode('block')),
  disallowed: ListNode(ResourceNode('block')),
  offset: BlockPos
});

const BlockSurvivesFilterConfig = Obj({
  state: ResourceNode('block_state')
});

const SurfaceRelativeThresholdConfig = Obj({
  heightmap: Heightmap,
  min_inclusive: IntNode({ default: INT_MIN_VALUE }),
  max_inclusive: IntNode({ default: INT_MAX_VALUE })
});

export const ConfiguredDecorator: Model = {
  node: SwitchNode(
    {
      ...DecoratorsSwitch.values,
      block_filter: BlockFilterConfig,
      block_survives_filter: BlockSurvivesFilterConfig,
      surface_relative_threshold: SurfaceRelativeThresholdConfig
    },
    {
      ...DecoratorsSwitch.preset,
      block_filter: {
        config: {
          allowed: ['snow_block', 'powder_snow'],
          offset: [0, -1, 0]
        }
      },
      block_survives_filter: {
        state: {
          Properties: {
            stage: '0'
          },
          Name: 'oak_sapling'
        }
      },
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

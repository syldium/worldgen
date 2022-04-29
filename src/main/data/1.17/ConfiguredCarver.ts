import type { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { FloatNode, Probability } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { Obj, Opt } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { HeightProvider, YOffset } from './HeightProvider';
import { FloatProvider } from './NumberProvider';

const CarverDebugConfig = Obj({
  debug_mode: BoolNode(false),
  air_state: Opt(ResourceNode('block_state')),
  water_state: Opt(ResourceNode('block_state')),
  lava_state: Opt(ResourceNode('block_state')),
  barrier_state: Opt(ResourceNode('block_state'))
});

const CarverConfig = {
  ...Probability,
  y: HeightProvider,
  yScale: FloatProvider(),
  lava_level: YOffset,
  aquifers_enabled: BoolNode(),
  debug_settings: CarverDebugConfig
};

export const CaveCarverConfig = {
  ...CarverConfig,
  horizontal_radius_multiplier: FloatProvider(),
  vertical_radius_multiplier: FloatProvider(),
  floor_level: FloatProvider(-1, 1)
};

export const RavineCarverConfig = {
  ...CarverConfig,
  vertical_rotation: FloatProvider(),
  shape: Obj({
    distance_factor: FloatProvider(),
    thickness: FloatProvider(),
    width_smoothness: IntNode({ min: 0 }),
    horizontal_radius_factor: FloatProvider(),
    vertical_radius_default_factor: FloatNode(),
    vertical_radius_center_factor: FloatNode()
  })
};

export const ConfiguredCarver: Model = {
  node: SwitchNode({
    cave: Obj(CaveCarverConfig),
    nether_cave: Obj(CaveCarverConfig),
    canyon: Obj(RavineCarverConfig),
    underwater_canyon: Obj(RavineCarverConfig),
    underwater_cave: Obj(CaveCarverConfig)
  }),
  preset: () => ({
    config: {
      lava_level: {
        above_bottom: 10
      },
      aquifers_enabled: true,
      debug_settings: {
        water_state: {
          Properties: {
            waterlogged: 'false',
            lit: 'false',
            candles: '1'
          },
          Name: 'minecraft:candle'
        },
        lava_state: {
          Name: 'minecraft:orange_stained_glass'
        },
        barrier_state: {
          Name: 'minecraft:glass'
        },
        air_state: {
          Properties: {
            powered: 'false',
            facing: 'north',
            face: 'wall'
          },
          Name: 'minecraft:crimson_button'
        }
      },
      probability: 0.14285715,
      y: {
        min_inclusive: {
          absolute: 0
        },
        max_inclusive: {
          absolute: 127
        },
        inner: 8,
        type: 'minecraft:biased_to_bottom'
      },
      yScale: 0.5,
      horizontal_radius_multiplier: 1.0,
      vertical_radius_multiplier: 1.0,
      floor_level: -0.7
    },
    type: 'minecraft:cave'
  })
};

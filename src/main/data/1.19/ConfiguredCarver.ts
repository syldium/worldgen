import { Model } from '../../model/Model';
import { Obj } from '../../model/node/ObjectNode';
import { TagNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import {
  CaveCarverConfig as CaveCarverConfig1_18,
  RavineCarverConfig as RavineCarverConfig1_18
} from '../1.18/ConfiguredCarver';

export const CaveCarverConfig = {
  ...CaveCarverConfig1_18,
  replaceable: TagNode('block')
};

export const RavineCarverConfig = {
  ...RavineCarverConfig1_18,
  replaceable: TagNode('block')
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
    type: 'minecraft:cave',
    config: {
      debug_settings: {
        air_state: {
          Name: 'minecraft:crimson_button',
          Properties: {
            face: 'wall',
            facing: 'north',
            powered: 'false'
          }
        },
        barrier_state: {
          Name: 'minecraft:glass'
        },
        lava_state: {
          Name: 'minecraft:orange_stained_glass'
        },
        water_state: {
          Name: 'minecraft:candle',
          Properties: {
            candles: '1',
            lit: 'false',
            waterlogged: 'false'
          }
        }
      },
      floor_level: {
        type: 'minecraft:uniform',
        value: {
          max_exclusive: -0.4,
          min_inclusive: -1.0
        }
      },
      horizontal_radius_multiplier: {
        type: 'minecraft:uniform',
        value: {
          max_exclusive: 1.4,
          min_inclusive: 0.7
        }
      },
      lava_level: {
        above_bottom: 8
      },
      probability: 0.15,
      replaceable: '#minecraft:overworld_carver_replaceables',
      vertical_radius_multiplier: {
        type: 'minecraft:uniform',
        value: {
          max_exclusive: 1.3,
          min_inclusive: 0.8
        }
      },
      y: {
        type: 'minecraft:uniform',
        max_inclusive: {
          absolute: 180
        },
        min_inclusive: {
          above_bottom: 8
        }
      },
      yScale: {
        type: 'minecraft:uniform',
        value: {
          max_exclusive: 0.9,
          min_inclusive: 0.1
        }
      }
    }
  })
};

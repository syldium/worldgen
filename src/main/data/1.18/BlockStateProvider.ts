import { DataType } from '../../hook/useCrud';
import { ObjectModel } from '../../model/Model';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode, LongNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { NoiseValues } from '../1.17/BiomeSource';
import { RangeInterval } from './RangeInterval';

const BlockStateList = ListNode(ResourceNode('block_state'));

const seeded: ObjectModel = {
  seed: LongNode(),
  noise: NoiseValues,
  scale: FloatNode({ min: 0, max: 1 })
};
const noise: ObjectModel = {
  ...seeded,
  states: BlockStateList
};
const dualNoise: ObjectModel = {
  ...noise,
  variety: RangeInterval(
    IntNode({ min: 1, max: 64 }),
    'min_inclusive',
    'max_inclusive'
  ),
  slow_noise: NoiseValues,
  slow_scale: FloatNode({ min: 0 })
};
const noiseThreshold: ObjectModel = {
  ...seeded,
  threshold: FloatNode({ min: -1, max: 1 }),
  high_chance: FloatNode({ min: 0, max: 1 }),
  default_state: ResourceNode('block_state'),
  low_states: BlockStateList,
  high_states: BlockStateList
};

export const SeededBlockStateProviders: Record<string, ObjectModel> = {
  noise_provider: noise,
  dual_noise_provider: dualNoise,
  noise_threshold_provider: noiseThreshold
};

export const SeededBlockStateProviderPresets: Record<
  string,
  Record<string, DataType>
> = {
  noise_2d_provider: {
    seed: 1234,
    noise: {
      firstOctave: 0,
      amplitudes: [1]
    },
    scale: 0.020833334,
    states: [
      {
        Name: 'dandelion'
      },
      {
        Name: 'poppy'
      },
      {
        Name: 'allium'
      },
      {
        Name: 'azure_bluet'
      },
      {
        Name: 'red_tulip'
      },
      {
        Name: 'orange_tulip'
      },
      {
        Name: 'white_tulip'
      },
      {
        Name: 'pink_tulip'
      },
      {
        Name: 'oxeye_daisy'
      },
      {
        Name: 'cornflower'
      },
      {
        Name: 'lily_of_the_valley'
      }
    ],
    type: 'noise_2d_provider'
  },
  dual_noise_2d_provider: {
    seed: 1234,
    noise: {
      firstOctave: -3,
      amplitudes: [1]
    },
    scale: 1.0,
    states: [
      {
        Properties: {
          half: 'lower'
        },
        Name: 'tall_grass'
      },
      {
        Name: 'allium'
      },
      {
        Name: 'poppy'
      },
      {
        Name: 'azure_bluet'
      },
      {
        Name: 'dandelion'
      },
      {
        Name: 'cornflower'
      },
      {
        Name: 'oxeye_daisy'
      },
      {
        Name: 'grass'
      }
    ],
    variety: [1, 3],
    slow_noise: {
      firstOctave: -10,
      amplitudes: [1]
    },
    slow_scale: 1.0,
    type: 'dual_noise_2d_provider'
  },
  state_provider: {
    high_chance: 0.33333334,
    default_state: {
      Name: 'dandelion'
    },
    low_states: [
      {
        Name: 'orange_tulip'
      },
      {
        Name: 'red_tulip'
      },
      {
        Name: 'pink_tulip'
      },
      {
        Name: 'white_tulip'
      }
    ],
    high_states: [
      {
        Name: 'poppy'
      },
      {
        Name: 'azure_bluet'
      },
      {
        Name: 'oxeye_daisy'
      },
      {
        Name: 'cornflower'
      }
    ],
    seed: 1234,
    noise: {
      firstOctave: 0,
      amplitudes: [1]
    },
    scale: 0.005,
    threshold: -0.8,
    type: 'noise_2d_cutoff_provider'
  }
};

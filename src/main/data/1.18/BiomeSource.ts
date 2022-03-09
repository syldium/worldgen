import type { Model } from '../../model/Model';
import { FloatNode } from '../../model/node/FloatNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import {
  BiomeSource as BiomeSource1_17,
  BiomeSourceSwitch as BiomeSourceSwitch1_17
} from '../1.17/BiomeSource';
import { RangeInterval } from './RangeInterval';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { vanilla_layered, ...sources } = BiomeSourceSwitch1_17.values;

const range = RangeInterval(FloatNode({ min: -2, max: 2 }));
const MultiNoise = Obj({
  biomes: ListNode(
    Obj({
      biome: ResourceNode('worldgen/biome'),
      parameters: Obj({
        continentalness: range,
        depth: range,
        erosion: range,
        humidity: range,
        temperature: range,
        weirdness: range,
        offset: FloatNode({ min: 0, max: 1 })
      })
    })
  )
});

export const BiomeSource: Model = {
  node: SwitchNode(
    { ...sources, multi_noise: MultiNoise },
    {
      ...BiomeSourceSwitch1_17.preset,
      multi_noise: {
        // @ts-ignore
        biomes: [
          {
            parameters: {
              continentalness: [-0.45, -0.19],
              depth: 1,
              erosion: [-1, 1],
              humidity: [-1, 1],
              temperature: [0.55, 1],
              weirdness: [-1, 1],
              offset: 0
            },
            biome: 'minecraft:warm_ocean'
          }
        ]
      }
    },
    BiomeSourceSwitch1_17.config,
    BiomeSourceSwitch1_17.typeField
  ),
  preset: BiomeSource1_17.preset
};

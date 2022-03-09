import { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode, LongNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj } from '../../model/node/ObjectNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';

const BiomeNoiseParameters = Obj({
  biome: ResourceNode('worldgen/biome'),
  parameters: Obj({
    altitude: FloatNode({ min: -2, max: 2 }),
    weirdness: FloatNode({ min: -2, max: 2 }),
    temperature: FloatNode({ min: -2, max: 2 }),
    humidity: FloatNode({ min: -2, max: 2 }),
    offset: FloatNode({ min: 0, max: 1 })
  })
});

export const NoiseValues = Obj({
  firstOctave: IntNode(),
  amplitudes: ListNode(FloatNode())
});

const generatorSeed = 286956243;
export const VANILLA_LAYERED_BIOME_SOURCE = {
  seed: generatorSeed,
  large_biomes: false
};
export const FIXED_BIOME_SOURCE = {
  biome: 'minecraft:plains'
};

export const BiomeSourceSwitch = SwitchNode(
  {
    checkerboard: Obj({
      biomes: ListNode(IdentifierNode('worldgen/biome')),
      scale: IntNode({ min: 0, max: 62, default: 2 })
    }),
    fixed: Obj({
      biome: IdentifierNode('worldgen/biome')
    }),
    multi_noise: Obj({
      seed: LongNode(),
      biomes: ListNode(BiomeNoiseParameters),
      humidity_noise: NoiseValues,
      altitude_noise: NoiseValues,
      weirdness_noise: NoiseValues,
      temperature_noise: NoiseValues
    }),
    vanilla_layered: Obj({
      legacy_biome_init_layer: BoolNode(false),
      large_biomes: BoolNode(false),
      seed: LongNode()
    }),
    the_end: Obj({
      seed: LongNode()
    })
  },
  {
    checkerboard: {
      seed: generatorSeed,
      biomes: ['minecraft:ocean', 'minecraft:plains']
    },
    fixed: FIXED_BIOME_SOURCE,
    multi_noise: {
      seed: generatorSeed,
      temperature_noise: {
        firstOctave: -7,
        amplitudes: [1, 1]
      },
      humidity_noise: {
        firstOctave: -7,
        amplitudes: [1, 1]
      },
      altitude_noise: {
        firstOctave: -7,
        amplitudes: [1, 1]
      },
      weirdness_noise: {
        firstOctave: -7,
        amplitudes: [1, 1]
      },
      biomes: [
        {
          biome: 'minecraft:plains',
          parameters: {
            altitude: 0,
            weirdness: 0,
            offset: 0,
            temperature: 0.6,
            humidity: 0.4
          }
        },
        {
          biome: 'minecraft:ocean',
          parameters: {
            altitude: 0,
            weirdness: 0,
            offset: 0,
            temperature: 0.5,
            humidity: 0.5
          }
        }
      ]
    },
    vanilla_layered: VANILLA_LAYERED_BIOME_SOURCE,
    the_end: { seed: generatorSeed }
  },
  null
);

export const BiomeSource: Model = {
  node: BiomeSourceSwitch,
  preset: () => FIXED_BIOME_SOURCE
};

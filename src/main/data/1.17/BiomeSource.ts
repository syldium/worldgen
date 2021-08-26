import { FloatNode } from '../../model/node/FloatNode';
import { ObjectNode } from '../../model/node/ObjectNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { IntNode, LongNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { BoolNode } from '../../model/node/BoolNode';
import { Model } from '../../model/Model';

const BiomeNoiseParameters = ObjectNode({
  parameters: ObjectNode({
    altitude: FloatNode({ min: -2, max: 2 }),
    weirdness: FloatNode({ min: -2, max: 2 }),
    temperature: FloatNode({ min: -2, max: 2 }),
    humidity: FloatNode({ min: -2, max: 2 }),
    offset: FloatNode({ min: 0, max: 1 })
  }),
  biome: ResourceNode('worldgen/biome')
});

const NoiseParameters = ObjectNode({
  firstOctave: IntNode(),
  amplitudes: ListNode(FloatNode())
});

const generatorSeed = 286956243;
export const VANILLA_LAYERED_BIOME_SOURCE = {
  seed: generatorSeed,
  large_biomes: false
};
export const BiomeSource: Model = {
  node: SwitchNode(
    {
      checkerboard: {
        biomes: ListNode(IdentifierNode('worldgen/biome')),
        scale: IntNode({ min: 0, max: 62, default: 2 })
      },
      fixed: {
        biome: IdentifierNode('worldgen/biome')
      },
      multi_noise: {
        seed: LongNode(),
        biomes: ListNode(BiomeNoiseParameters),
        humidity_noise: NoiseParameters,
        altitude_noise: NoiseParameters,
        weirdness_noise: NoiseParameters,
        temperature_noise: NoiseParameters
      },
      vanilla_layered: {
        legacy_biome_init_layer: BoolNode(false),
        large_biomes: BoolNode(false),
        seed: LongNode()
      },
      the_end: {
        seed: LongNode()
      }
    },
    {
      checkerboard: {
        seed: generatorSeed,
        biomes: ['minecraft:ocean', 'minecraft:plains']
      },
      fixed: {
        seed: generatorSeed,
        biome: 'minecraft:plains'
      },
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
  ),
  preset: () => ({
    type: 'minecraft:fixed',
    seed: generatorSeed,
    biome: 'minecraft:plains'
  })
};

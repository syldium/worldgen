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
        humidity_noise: NoiseParameters,
        altitude_noise: NoiseParameters,
        weirdness_noise: NoiseParameters,
        temperature_noise: NoiseParameters,
        seed: LongNode(),
        biomes: ListNode(BiomeNoiseParameters)
      },
      vanilla_layered: {
        legacy_biome_init_layer: BoolNode(false),
        large_biomes: BoolNode(false),
        seed: IntNode()
      }
    },
    {},
    null
  ),
  preset: () => ({})
};

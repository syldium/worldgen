import { ObjectNode } from '../../model/node/ObjectNode';
import { BoolNode } from '../../model/node/BoolNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { Model, ObjectModel } from '../../model/Model';
import { IntNode } from '../../model/node/IntNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { ListNode } from '../../model/node/ListNode';
import { Option } from '../../component/ui/Select';
import { labelizeOption } from '../../util/LabelHelper';

const FlatBlockLayer = ObjectNode({
  block: IdentifierNode('block'),
  height: IntNode({ min: 0, max: 4064 })
});

const FlatGenerator: ObjectModel = {
  settings: ObjectNode({
    //structures: ListNode(), // TODO
    layers: ListNode(FlatBlockLayer),
    features: BoolNode(false),
    lakes: BoolNode(false),
    biome: IdentifierNode('worldgen/biome')
  })
};
const NoiseGenerator: ObjectModel = {
  biome_source: ResourceNode('worldgen/biome_source'),
  seed: IntNode(),
  settings: IdentifierNode('worldgen/noise_settings')
};

export const ChunkGenerator: Model = {
  node: SwitchNode(
    {
      debug: {},
      flat: FlatGenerator,
      noise: NoiseGenerator
    },
    {
      debug: { type: 'minecraft:debug' },
      flat: {
        type: 'minecraft:flat',
        settings: {
          structures: {
            structures: {}
          },
          layers: [
            {
              block: 'minecraft:bedrock',
              height: 1
            },
            {
              block: 'minecraft:sandstone',
              height: 70
            }
          ],
          biome: 'minecraft:plains'
        }
      },
      noise: {
        type: 'minecraft:noise',
        seed: 286956243,
        biome_source: {
          type: 'minecraft:fixed',
          seed: 286956243,
          biome: 'minecraft:plains'
        },
        settings: 'minecraft:overworld'
      }
    },
    null
  ),
  preset: () => ({
    biome_source: {
      seed: 0,
      large_biomes: false,
      type: 'minecraft:vanilla_layered'
    },
    seed: 0,
    settings: 'minecraft:overworld',
    type: 'minecraft:noise'
  })
};

export const ChunkGenerators: Option[] = [
  'overworld',
  'overworld_caves',
  'the_nether',
  'the_end'
].map(labelizeOption);

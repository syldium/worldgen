import { Option } from '../../component/ui/Select';
import { Model, ObjectModel } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { ObjectNode } from '../../model/node/ObjectNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { labelizeOption } from '../../util/LabelHelper';
import {
  BiomeSource,
  FIXED_BIOME_SOURCE,
  VANILLA_LAYERED_BIOME_SOURCE
} from './BiomeSource';

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

const generatorSeed = 286956243;
export const ChunkGenerator: Model = {
  node: SwitchNode(
    {
      debug: {},
      flat: FlatGenerator,
      noise: NoiseGenerator
    },
    {
      flat: {
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
        seed: generatorSeed,
        biome_source: BiomeSource.preset('1.17'),
        settings: 'minecraft:overworld'
      }
    },
    null
  ),
  preset: (version) => ({
    biome_source: version === '1.18' ?
      FIXED_BIOME_SOURCE :
      VANILLA_LAYERED_BIOME_SOURCE,
    seed: generatorSeed,
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

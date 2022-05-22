import type { Option } from '../../component/ui/Select';
import type { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Empty, Obj } from '../../model/node/ObjectNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { labelizeOption } from '../../util/LabelHelper';
import {
  BiomeSource,
  FIXED_BIOME_SOURCE,
  VANILLA_LAYERED_BIOME_SOURCE
} from './BiomeSource';

const FlatBlockLayer = Obj({
  block: IdentifierNode('block'),
  height: IntNode({ min: 0, max: 4064 })
});

const FlatGenerator = Obj({
  settings: Obj({
    //structures: ListNode(), // TODO
    layers: ListNode(FlatBlockLayer),
    features: BoolNode(false),
    lakes: BoolNode(false),
    biome: IdentifierNode('worldgen/biome')
  })
});
export const NoiseGenerator = {
  biome_source: ResourceNode('worldgen/biome_source'),
  seed: IntNode(),
  settings: IdentifierNode('worldgen/noise_settings')
};

const generatorSeed = 286956243;
export const ChunkGenerator: Model = {
  node: SwitchNode(
    {
      debug: Empty,
      flat: FlatGenerator,
      noise: Obj(NoiseGenerator)
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
    biome_source: version === '1.16' || version === '1.17' ?
      VANILLA_LAYERED_BIOME_SOURCE :
      FIXED_BIOME_SOURCE,
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

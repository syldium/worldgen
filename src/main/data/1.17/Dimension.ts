import { forEveryType } from '../../model/node/SwitchNode';
import { Model } from '../../model/Model';
import { ResourceNode } from '../../model/node/ResourceNode';
import { Option } from '../../component/ui/Select';
import { labelizeOption } from '../../util/LabelHelper';

const generator = ResourceNode('worldgen/chunk_generator');
const dimensions = ['overworld', 'the_nether', 'the_end'] as const;

export const Dimension: Model = {
  node: forEveryType(dimensions, generator, {}, 'generator'),
  preset: () => ({
    type: 'minecraft:overworld',
    generator: {
      biome_source: {
        seed: 0,
        large_biomes: false,
        type: 'minecraft:vanilla_layered'
      },
      seed: 0,
      settings: 'minecraft:overworld',
      type: 'minecraft:noise'
    }
  })
};

export const Dimensions: Option[] = dimensions.map(labelizeOption);

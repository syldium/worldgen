import { Model } from '../../model/Model';
import { ResourceNode } from '../../model/node/ResourceNode';
import { Option } from '../../component/ui/Select';
import { labelizeOption } from '../../util/LabelHelper';
import { ChunkGenerator } from './ChunkGenerator';

const dimensions = ['overworld', 'the_nether', 'the_end'] as const;

const preset = {
  generator: ChunkGenerator.preset('1.17')
};
export const Dimension: Model = {
  node: {
    type: ResourceNode('dimension_type'),
    generator: ResourceNode('worldgen/chunk_generator')
  },
  preset: () => ({
    type: 'minecraft:overworld',
    generator: preset.generator
  })
};

export const Dimensions: Option[] = dimensions.map(labelizeOption);

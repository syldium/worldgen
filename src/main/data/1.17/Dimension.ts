import { Option } from '../../component/ui/Select';
import { Model } from '../../model/Model';
import { ResourceNode } from '../../model/node/ResourceNode';
import { labelizeOption } from '../../util/LabelHelper';
import { ChunkGenerator } from './ChunkGenerator';

const dimensions = ['overworld', 'the_nether', 'the_end'] as const;

export const Dimension: Model = {
  node: {
    type: ResourceNode('dimension_type'),
    generator: ResourceNode('worldgen/chunk_generator')
  },
  preset: (version) => ({
    type: 'minecraft:overworld',
    generator: ChunkGenerator.preset(version)
  })
};

export const Dimensions: Option[] = dimensions.map(labelizeOption);

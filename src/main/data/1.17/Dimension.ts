import { forEveryType } from '../../model/node/SwitchNode';
import { Model } from '../../model/Model';
import { ResourceNode } from '../../model/node/ResourceNode';
import { Option } from '../../component/ui/Select';
import { labelizeOption } from '../../util/LabelHelper';
import { ChunkGenerator } from './ChunkGenerator';

const generator = ResourceNode('worldgen/chunk_generator');
const dimensions = ['overworld', 'the_nether', 'the_end'] as const;

const preset = {
  generator: ChunkGenerator.preset('1.17')
};
export const Dimension: Model = {
  node: forEveryType(dimensions, generator, preset as any, 'generator'),
  preset: () => ({
    type: 'minecraft:overworld',
    generator: preset.generator
  })
};

export const Dimensions: Option[] = dimensions.map(labelizeOption);

import { Model } from '../../model/Model';
import { MapNode } from '../../model/node/MapNode';
import { Obj } from '../../model/node/ObjectNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';

const DimensionOptions = Obj({
  type: ResourceNode('dimension_type'),
  generator: ResourceNode('worldgen/chunk_generator')
});

export const WorldPreset: Model = {
  node: Obj({
    dimensions: MapNode(IdentifierNode('dimension'), DimensionOptions)
  }),
  preset: () => ({
    dimensions: {
      'minecraft:the_end': {
        type: 'minecraft:the_end',
        generator: {
          biome_source: {
            type: 'minecraft:the_end'
          },
          settings: 'minecraft:end',
          type: 'minecraft:noise'
        }
      },
      'minecraft:overworld': {
        type: 'minecraft:overworld',
        generator: {
          biome_source: {
            preset: 'minecraft:overworld',
            type: 'minecraft:multi_noise'
          },
          settings: 'minecraft:overworld',
          type: 'minecraft:noise'
        }
      },
      'minecraft:the_nether': {
        type: 'minecraft:the_nether',
        generator: {
          biome_source: {
            preset: 'minecraft:nether',
            type: 'minecraft:multi_noise'
          },
          settings: 'minecraft:nether',
          type: 'minecraft:noise'
        }
      }
    }
  })
};

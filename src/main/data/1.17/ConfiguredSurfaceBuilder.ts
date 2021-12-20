import { Model, ObjectModel } from '../../model/Model';
import { ResourceNode } from '../../model/node/ResourceNode';
import { forEveryType } from '../../model/node/SwitchNode';

const config: ObjectModel = {
  top_material: ResourceNode('block_state'),
  under_material: ResourceNode('block_state'),
  underwater_material: ResourceNode('block_state')
};

const types = [
  'default',
  'mountain',
  'shattered_savanna',
  'gravelly_mountain',
  'giant_tree_taiga',
  'swamp',
  'badlands',
  'wooded_badlands',
  'eroded_badlands',
  'frozen_ocean',
  'nether',
  'nether_forest',
  'soul_sand_valley',
  'basalt_deltas',
  'nope'
] as const;

export const createSurfaceBuilderModel = (types: readonly string[]): Model => ({
  node: forEveryType(types, config),
  preset: () => ({
    config: {
      top_material: {
        Properties: {
          snowy: 'false'
        },
        Name: 'minecraft:grass_block'
      },
      under_material: {
        Name: 'minecraft:dirt'
      },
      underwater_material: {
        Name: 'minecraft:gravel'
      }
    },
    type: 'minecraft:default'
  })
});

export const ConfiguredSurfaceBuilder = createSurfaceBuilderModel(types);

import { Model } from '../../model/Model';
import { ListNode } from '../../model/node/ListNode';
import { ResourceNode } from '../../model/node/ResourceNode';

export const PlacedFeature: Model = {
  node: {
    feature: ResourceNode('worldgen/configured_feature'),
    placement: ListNode(ResourceNode('worldgen/placement_modifier'))
  },
  preset: () => ({
    feature: 'minecraft:trees_plains',
    placement: [
      {
        count: {
          distribution: [
            {
              data: 0,
              weight: 19
            },
            {
              data: 1,
              weight: 1
            }
          ],
          type: 'minecraft:weighted_list'
        },
        type: 'minecraft:count'
      },
      {
        type: 'minecraft:in_square'
      },
      {
        max_water_depth: 0,
        type: 'minecraft:surface_water_depth_filter'
      },
      {
        heightmap: 'OCEAN_FLOOR',
        type: 'minecraft:heightmap'
      },
      {
        predicate: {
          state: {
            Properties: {
              stage: '0'
            },
            Name: 'minecraft:oak_sapling'
          },
          type: 'minecraft:would_survive'
        },
        type: 'minecraft:block_predicate_filter'
      },
      {
        type: 'minecraft:biome'
      }
    ]
  })
};

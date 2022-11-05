import { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { Probability } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Empty, Obj, Opt } from '../../model/node/ObjectNode';
import { ResourceNode, TagNode } from '../../model/node/ResourceNode';
import { SwitchNode, SwitchNodeParams } from '../../model/node/SwitchNode';
import { Direction } from '../1.17/Direction';
import { IntProvider } from '../1.17/NumberProvider';
import { ConfiguredFeature as ConfiguredFeature1_18_2 } from '../1.18.2/ConfiguredFeature';

const features1_18_2 = ConfiguredFeature1_18_2.node as SwitchNodeParams;

const TrunkPlacerBaseConfig = Obj({
  base_height: IntNode({ min: 0, max: 32 }),
  height_rand_a: IntNode({ min: 0, max: 24 }),
  height_rand_b: IntNode({ min: 0, max: 24 })
});

const FoliagePlacerBaseConfig = {
  radius: IntProvider(0, 16),
  offset: IntProvider(0, 16)
};

const TreeConfig = {
  trunk_provider: ResourceNode('block_state_provider'),
  foliage_provider: ResourceNode('block_state_provider'),
  dirt_provider: ResourceNode('block_state_provider'),
  root_placer: Opt(SwitchNode(
    {
      mangrove_root_placer: Obj({
        mangrove_root_placement: Obj({
          can_grow_through: TagNode('block'),
          muddy_roots_in: TagNode('block'),
          muddy_roots_provider: ResourceNode('block_state_provider'),
          max_root_width: IntNode({ min: 1, max: 12 }),
          max_root_length: IntNode({ min: 1, max: 64 }),
          random_skew_chance: Probability.probability
        })
      })
    },
    {},
    null,
    'type',
    Obj({
      trunk_offset_y: IntProvider(),
      root_provider: ResourceNode('block_state_provider'),
      above_root_placement: Opt(Obj({
        above_root_provider: ResourceNode('block_state_provider'),
        above_root_placement_chance: Probability.probability
      }))
    })
  )),
  trunk_placer: SwitchNode(
    {
      straight_trunk_placer: TrunkPlacerBaseConfig,
      forking_trunk_placer: TrunkPlacerBaseConfig,
      giant_trunk_placer: TrunkPlacerBaseConfig,
      mega_jungle_trunk_placer: TrunkPlacerBaseConfig,
      dark_oak_trunk_placer: TrunkPlacerBaseConfig,
      fancy_trunk_placer: TrunkPlacerBaseConfig,
      bending_trunk_placer: Obj({
        ...TrunkPlacerBaseConfig.records,
        min_height_for_leaves: IntNode({
          min: 1,
          default: 1
        }),
        bend_length: IntProvider(1, 64)
      }),
      upwards_branching_trunk_placer: Obj({
        ...TrunkPlacerBaseConfig.records,
        extra_branch_steps: IntProvider(1),
        place_branch_per_log_probability: Probability.probability,
        extra_branch_length: IntProvider(0),
        can_grow_through: TagNode('block')
      })
    },
    {},
    null
  ),
  foliage_placer: SwitchNode(
    {
      blob_foliage_placer: Obj({
        ...FoliagePlacerBaseConfig,
        height: IntNode({ min: 0, max: 16 })
      }),
      spruce_foliage_placer: Obj({
        ...FoliagePlacerBaseConfig,
        trunk_height: IntProvider(0, 24)
      }),
      pine_foliage_placer: Obj({
        ...FoliagePlacerBaseConfig,
        height: IntProvider(0, 24)
      }),
      acacia_foliage_placer: Obj(FoliagePlacerBaseConfig),
      bush_foliage_placer: Obj(FoliagePlacerBaseConfig),
      fancy_foliage_placer: Obj(FoliagePlacerBaseConfig),
      jungle_foliage_placer: Obj({
        ...FoliagePlacerBaseConfig,
        height: IntNode({ min: 0, max: 16 })
      }),
      mega_pine_foliage_placer: Obj({
        ...FoliagePlacerBaseConfig,
        crown_height: IntProvider(0, 24)
      }),
      dark_oak_foliage_placer: Obj(FoliagePlacerBaseConfig),
      random_spread_foliage_placer: Obj({
        ...FoliagePlacerBaseConfig,
        foliage_height: IntProvider(1, 512),
        leaf_placement_attempts: IntNode({ min: 0, max: 256 })
      })
    },
    {},
    null
  ),
  minimum_size: SwitchNode(
    {
      two_layers_feature_size: Obj({
        min_clipped_height: Opt(IntNode({ min: 0, max: 80 })),
        limit: IntNode({ min: 0, max: 81, default: 1 }),
        lower_size: IntNode({ min: 0, max: 16, default: 0 }),
        upper_size: IntNode({ min: 0, max: 16, default: 1 })
      }),
      three_layers_feature_size: Obj({
        min_clipped_height: Opt(IntNode({ min: 0, max: 80 })),
        limit: IntNode({ min: 0, max: 80, default: 1 }),
        lower_size: IntNode({ min: 0, max: 16, default: 0 }),
        middle_size: IntNode({ min: 0, max: 16, default: 1 }),
        upper_size: IntNode({ min: 0, max: 16, default: 1 }),
        upper_limit: IntNode({ min: 0, max: 80, default: 1 })
      })
    },
    {},
    null
  ),
  decorators: ListNode(
    SwitchNode(
      {
        alter_ground: Obj({
          provider: ResourceNode('block_state_provider')
        }),
        beehive: Obj(Probability),
        cocoa: Obj(Probability),
        leave_vine: Empty,
        trunk_vine: Empty,
        attached_to_leaves: Obj({
          ...Probability,
          exclusion_radius_xz: IntNode({ min: 0, max: 16 }),
          exclusion_radius_y: IntNode({ min: 0, max: 16 }),
          block_provider: ResourceNode('block_state_provider'),
          required_empty_blocks: IntNode({ min: 1, max: 16 }),
          directions: ListNode(Direction)
        })
      },
      {
        alter_ground: {
          provider: {
            state: {
              Properties: {
                snowy: 'false'
              },
              Name: 'minecraft:podzol'
            },
            type: 'minecraft:simple_state_provider'
          }
        },
        beehive: {
          probability: 0.05
        },
        cocoa: {
          probability: 0.2
        },
        attached_to_leaves: {
          block_provider: {
            type: 'minecraft:randomized_int_state_provider',
            property: 'age',
            source: {
              type: 'minecraft:simple_state_provider',
              state: {
                Name: 'minecraft:mangrove_propagule',
                Properties: {
                  age: '0',
                  hanging: 'true',
                  stage: '0',
                  waterlogged: 'false'
                }
              }
            },
            values: {
              type: 'minecraft:uniform',
              value: {
                max_inclusive: 4,
                min_inclusive: 0
              }
            }
          },
          directions: [
            'down'
          ],
          exclusion_radius_xz: 1,
          exclusion_radius_y: 0,
          probability: 0.14,
          required_empty_blocks: 2
        }
      },
      null
    )
  ),
  ignore_vines: BoolNode(false),
  force_dirt: BoolNode(false)
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { glow_lichen, ice_patch, surface_disk, ...featureValues } =
  features1_18_2.values;
export const ConfiguredFeature: Model = {
  node: SwitchNode(
    {
      ...featureValues,
      disk: Obj({
        state_provider: Obj({
          rules: ListNode(
            Obj({
              if_true: ResourceNode('block_predicate'),
              then: ResourceNode('block_state_provider')
            })
          ),
          fallback: ResourceNode('block_state_provider')
        }),
        target: ResourceNode('block_predicate'),
        radius: IntProvider(0, 8),
        half_height: IntNode({ min: 0, max: 4 })
      }),
      multiface_growth: glow_lichen,
      sculk_patch: Obj({
        charge_count: IntNode({ min: 1, max: 32 }),
        amount_per_charge: IntNode({ min: 1, max: 500 }),
        spread_attempts: IntNode({ min: 1, max: 64 }),
        growth_rounds: IntNode({ min: 0, max: 8 }),
        spread_rounds: IntNode({ min: 0, max: 8 }),
        extra_rare_growths: IntProvider(),
        catalyst_chance: Probability.probability
      }),
      tree: Obj(TreeConfig)
    },
    features1_18_2.preset
  ),
  preset: ConfiguredFeature1_18_2
    .preset
};

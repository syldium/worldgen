import { IntProvider } from './NumberProvider';
import { Model, ObjectModel } from '../../model/Model';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { ObjectNode, Opt } from '../../model/node/ObjectNode';
import { FloatNode, Probability } from '../../model/node/FloatNode';
import { BoolNode } from '../../model/node/BoolNode';
import { EnumNode } from '../../model/node/EnumNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { VerticalSurface } from './WorldgenStep';
import FeatureDefaults, { DECORATED_TREE} from './ConfiguredFeatureDefault';

const BlockPileConfig: ObjectModel = {
  state_provider: ResourceNode('block_state_provider')
};

const DiskConfig: ObjectModel = {
  state: ResourceNode('block_state'),
  radius: IntNode({ min: 0, max: 8 }),
  half_height: IntNode({ min: 0, max: 4 }),
  targets: ListNode(ResourceNode('block_state'))
};

const FossilConfig: ObjectModel = {
  fossil_structures: ListNode(IdentifierNode('structure')),
  overlay_structures: ListNode(IdentifierNode('structure')),
  fossil_processors: ResourceNode('worldgen/processor_list'), // type
  overlay_processors: ResourceNode('worldgen/processor_list'), // type
  max_empty_corners_allowed: IntNode({ min: 0, max: 7 })
};

const GeodeConfig: ObjectModel = {
  blocks: ObjectNode({
    filling_provider: ResourceNode('block_state_provider'),
    inner_layer_provider: ResourceNode('block_state_provider'),
    alternate_inner_layer_provider: ResourceNode('block_state_provider'),
    middle_layer_provider: ResourceNode('block_state_provider'),
    outer_layer_provider: ResourceNode('block_state_provider'),
    inner_placements: ListNode(ResourceNode('block_state')),
    cannot_replace: IdentifierNode('tag/blocks'),
    invalid_blocks: IdentifierNode('tag/blocks')
  }),
  layers: ObjectNode({
    filling: FloatNode({ min: 0.01, max: 50, default: 1.7 }),
    inner_layer: FloatNode({ min: 0.01, max: 50, default: 2.2 }),
    middle_layer: FloatNode({ min: 0.01, max: 50, default: 3.2 }),
    outer_layer: FloatNode({ min: 0.01, max: 50, default: 4.2 })
  }),
  crack: ObjectNode({
    generate_crack_chance: FloatNode({ min: 0, max: 1, default: 1 }),
    base_crack_size: FloatNode({ min: 0, max: 5, default: 2 }),
    crack_point_offset: IntNode({ min: 0, max: 10, default: 2 })
  }),
  use_potential_placements_chance: FloatNode({
    min: 0,
    max: 1,
    default: 0.35
  }),
  use_alternate_layer0_chance: FloatNode({ min: 0, max: 1, default: 0 }),
  placements_require_layer0_alternate: BoolNode(true),
  outer_wall_distance: IntProvider(1, 20),
  distribution_points: IntProvider(1, 20),
  point_offset: IntProvider(0, 10),
  min_gen_offset: IntNode({ default: -16 }),
  max_gen_offset: IntNode({ default: 16 }),
  noise_multiplier: FloatNode({ min: 0, max: 1, default: 0.05 }),
  invalid_blocks_threshold: IntNode()
};

const GlowLichenConfig: ObjectModel = {
  search_range: IntNode({ min: 1, max: 64, default: 10 }),
  can_place_on_floor: BoolNode(false),
  can_place_on_ceiling: BoolNode(false),
  can_place_on_wall: BoolNode(false),
  chance_of_spreading: FloatNode({ min: 0, max: 1, default: 0.5 }),
  can_be_placed_on: ListNode(ResourceNode('block_state'))
};

const GrowingPlantConfig: ObjectModel = {
  //height_distribution: ListNode(UniformDistributionNode(), true), // TODO IntProvider
  direction: EnumNode([
    'down',
    'up',
    'north',
    'south',
    'west',
    'east'
  ] as const),
  body_provider: ResourceNode('block_state_provider'),
  head_provider: ResourceNode('block_state_provider'),
  allow_water: BoolNode()
};

const HugeMushroomConfig: ObjectModel = {
  cap_provider: ResourceNode('block_state_provider'),
  stem_provider: ResourceNode('block_state_provider'),
  foliage_radius: IntNode({ default: 2 })
};

const NetherrackReplaceBlobsConfig: ObjectModel = {
  target: ResourceNode('block_state'),
  state: ResourceNode('block_state'),
  radius: IntProvider(0, 12)
};

const BlockPredicate = SwitchNode({
  always_true: {},
  block_match: {
    block: ResourceNode('block')
  },
  blockstate_match: {
    block_state: ResourceNode('block_state')
  },
  tag_match: {
    tag: IdentifierNode('tag/blocks')
  },
  random_block_match: {
    block: ResourceNode('block'),
    ...Probability
  },
  random_blockstate_match: {
    block: ResourceNode('block_state'),
    ...Probability
  }
});
const ReplaceTarget = ObjectNode({
  target: BlockPredicate,
  state: ResourceNode('block_state')
});
const ReplaceSingleBlockConfig: ObjectModel = {
  targets: ListNode(ReplaceTarget)
};
const OreConfig = ObjectNode({
  targets: ReplaceTarget,
  size: IntNode({ min: 0, max: 64 }),
  discard_chance_on_air_exposure: FloatNode({ min: 0, max: 1 })
});

const RandomPatchConfig: ObjectModel = {
  can_replace: BoolNode(false),
  project: BoolNode(true),
  need_water: BoolNode(false),
  xspread: IntNode({ default: 7 }),
  yspread: IntNode({ default: 3 }),
  zspread: IntNode({ default: 7 }),
  tries: IntNode({ default: 128 }),
  state_provider: ResourceNode('block_state_provider'),
  block_placer: ResourceNode('block_placer'),
  whitelist: ListNode(ResourceNode('block_state')),
  blacklist: ListNode(ResourceNode('block_state'))
};

const RootSystemConfig: ObjectModel = {
  feature: ResourceNode('worldgen/configured_feature'),
  required_vertical_space_for_tree: IntNode({ min: 1, max: 64 }),
  root_radius: IntNode({ min: 1, max: 64 }),
  root_replaceable: IdentifierNode('tag/blocks'),
  root_state_provider: ResourceNode('block_state_provider'),
  root_placement_attempts: IntNode({ min: 1, max: 256 }),
  root_column_max_height: IntNode({ min: 1, max: 4096 }),
  hanging_root_radius: IntNode({ min: 1, max: 64 }),
  hanging_roots_vertical_span: IntNode({ min: 0, max: 16 }),
  hanging_root_state_provider: ResourceNode('block_state_provider'),
  hanging_root_placement_attempts: IntNode({ min: 1, max: 256 }),
  allowed_vertical_water_for_tree: IntNode({ min: 1, max: 64 })
};

const SimpleBlockConfig: ObjectModel = {
  to_place: ResourceNode('block_state_provider'),
  place_on: ListNode(ResourceNode('block_state')),
  place_in: ListNode(ResourceNode('block_state')),
  place_under: ListNode(ResourceNode('block_state'))
};

const SpringConfig: ObjectModel = {
  state: ResourceNode('block_state'), // TODO fluid
  requires_block_below: BoolNode(true),
  rock_count: IntNode({ default: 4 }),
  hole_count: IntNode({ default: 1 }),
  valid_blocks: ListNode(ResourceNode('block'))
};

const TrunkPlacerBaseConfig: ObjectModel = {
  base_height: IntNode({ min: 0, max: 32 }),
  height_rand_a: IntNode({ min: 0, max: 24 }),
  height_rand_b: IntNode({ min: 0, max: 24 })
};

const FoliagePlacerBaseConfig: ObjectModel = {
  radius: IntProvider(0, 16),
  offset: IntProvider(0, 16)
};

const TreeConfig: ObjectModel = {
  trunk_provider: ResourceNode('block_state_provider'),
  foliage_provider: ResourceNode('block_state_provider'),
  sapling_provider: ResourceNode('block_state_provider'),
  dirt_provider: ResourceNode('block_state_provider'),
  trunk_placer: SwitchNode(
    {
      straight_trunk_placer: TrunkPlacerBaseConfig,
      forking_trunk_placer: TrunkPlacerBaseConfig,
      giant_trunk_placer: TrunkPlacerBaseConfig,
      mega_jungle_trunk_placer: TrunkPlacerBaseConfig,
      dark_oak_trunk_placer: TrunkPlacerBaseConfig,
      fancy_trunk_placer: TrunkPlacerBaseConfig,
      bending_trunk_placer: {
        ...TrunkPlacerBaseConfig,
        min_height_for_leaves: IntNode({
          min: 1,
          default: 1
        }),
        bend_length: IntProvider(1, 64)
      }
    },
    {},
    null
  ),
  foliage_placer: SwitchNode(
    {
      blob_foliage_placer: {
        ...FoliagePlacerBaseConfig,
        height: IntNode({ min: 0, max: 16 })
      },
      spruce_foliage_placer: {
        ...FoliagePlacerBaseConfig,
        trunk_height: IntProvider(0, 24)
      },
      pine_foliage_placer: {
        ...FoliagePlacerBaseConfig,
        height: IntProvider(0, 24)
      },
      acacia_foliage_placer: FoliagePlacerBaseConfig,
      bush_foliage_placer: FoliagePlacerBaseConfig,
      fancy_foliage_placer: FoliagePlacerBaseConfig,
      jungle_foliage_placer: {
        ...FoliagePlacerBaseConfig,
        height: IntNode({ min: 0, max: 16 })
      },
      mega_pine_foliage_placer: {
        ...FoliagePlacerBaseConfig,
        crown_height: IntProvider(0, 24)
      },
      dark_oak_foliage_placer: FoliagePlacerBaseConfig,
      random_spread_foliage_placer: {
        ...FoliagePlacerBaseConfig,
        foliage_height: IntProvider(1, 512),
        leaf_placement_attempts: IntNode({ min: 0, max: 256 })
      }
    },
    {},
    null
  ),
  minimum_size: SwitchNode(
    {
      two_layers_feature_size: {
        min_clipped_height: Opt(IntNode({ min: 0, max: 80 })),
        limit: IntNode({ min: 0, max: 81, default: 1 }),
        lower_size: IntNode({ min: 0, max: 16, default: 0 }),
        upper_size: IntNode({ min: 0, max: 16, default: 1 })
      },
      three_layers_feature_size: {
        min_clipped_height: Opt(IntNode({ min: 0, max: 80 })),
        limit: IntNode({ min: 0, max: 80, default: 1 }),
        lower_size: IntNode({ min: 0, max: 16, default: 0 }),
        middle_size: IntNode({ min: 0, max: 16, default: 1 }),
        upper_size: IntNode({ min: 0, max: 16, default: 1 }),
        upper_limit: IntNode({ min: 0, max: 80, default: 1 })
      }
    },
    {},
    null
  ),
  decorators: ListNode(
    SwitchNode(
      {
        alter_ground: ObjectNode({
          provider: ResourceNode('block_state_provider')
        }),
        beehive: ObjectNode(Probability),
        cocoa: ObjectNode(Probability),
        leave_vine: {},
        trunk_vine: {}
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
          },
          type: 'minecraft:alter_ground'
        },
        beehive: {
          probability: 0.05,
          type: 'minecraft:beehive'
        }
      },
      null
    )
  ),
  ignore_vines: BoolNode(false),
  force_dirt: BoolNode(false)
};

const VegetationPatchConfig: ObjectModel = {
  replaceable: IdentifierNode('tag/blocks'),
  ground_state: ResourceNode('block_state_provider'),
  vegetation_feature: ResourceNode('worldgen/configured_feature'),
  surface: VerticalSurface,
  depth: IntProvider(1, 128),
  extra_bottom_block_chance: Probability.probability,
  vertical_range: IntNode({ min: 1, max: 256 }),
  vegetation_chance: Probability.probability,
  xz_radius: IntProvider(),
  extra_edge_column_chance: Probability.probability
};

const UnderwaterMagmaConfig: ObjectModel = {
  floor_search_range: IntNode({ min: 0, max: 512 }),
  placement_radius_around_floor: IntNode({ min: 0, max: 64 }),
  placement_probability_per_valid_position: FloatNode({ min: 0, max: 1 })
};

const CountConfig: ObjectModel = {
  count: IntProvider(0, 256)
};

const StateConfig: ObjectModel = {
  state: ResourceNode('block_state')
};

export const ConfiguredFeature: Model = {
  node: SwitchNode(
    {
      bamboo: Probability,
      basalt_pillar: {},
      block_pile: BlockPileConfig,
      blue_ice: {},
      bonus_chest: {},
      chorus_plant: {},
      coral_mushroom: {},
      coral_tree: {},
      desert_well: {},
      disk: DiskConfig,
      flower: RandomPatchConfig,
      forest_rock: StateConfig,
      fossil: FossilConfig,
      freeze_top_layer: {},
      geode: GeodeConfig,
      glow_lichen: GlowLichenConfig,
      glowstone_blob: {},
      growing_plant: GrowingPlantConfig,
      huge_brown_mushroom: HugeMushroomConfig,
      huge_red_mushroom: HugeMushroomConfig,
      iceberg: StateConfig,
      ice_patch: DiskConfig,
      ice_spike: {},
      kelp: {},
      lake: StateConfig,
      monster_room: {},
      nether_forest_vegetation: BlockPileConfig,
      netherrack_replace_blobs: NetherrackReplaceBlobsConfig,
      no_bonemeal_flower: RandomPatchConfig,
      no_op: {},
      ore: OreConfig,
      random_patch: RandomPatchConfig,
      replace_single_block: ReplaceSingleBlockConfig,
      root_system: RootSystemConfig,
      scattered_ore: OreConfig,
      seagrass: Probability,
      sea_pickle: CountConfig,
      simple_block: SimpleBlockConfig,
      spring_feature: SpringConfig,
      tree: TreeConfig,
      underwater_magma: UnderwaterMagmaConfig,
      vegetation_patch: VegetationPatchConfig,
      waterlogged_vegetation_patch: VegetationPatchConfig,
      vines: {},
      void_start_platform: {}
    },
    FeatureDefaults
  ),
  preset: () => DECORATED_TREE
};

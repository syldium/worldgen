import { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { FloatNode, Probability } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Empty, Obj, Opt } from '../../model/node/ObjectNode';
import {
  IdentifierNode,
  ResourceNode,
  TagNode
} from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { BlockPlacer } from './BlockPlacer';
import {
  DECORATED_FILL_LAYER,
  DECORATED_NO_BONEMEAL_FLOWER,
  DECORATED_TREE
} from './ConfiguredFeatureDefault';
import { Direction } from './Direction';
import { FloatProvider, IntProvider } from './NumberProvider';
import { VerticalSurface } from './WorldgenStep';

const BasaltColumnsConfig = Obj({
  reach: IntProvider(0, 3),
  height: IntProvider(1, 10)
});

const BlockPileConfig = Obj({
  state_provider: ResourceNode('block_state_provider')
});

const DecoratedConfig = Obj({
  feature: IdentifierNode('worldgen/configured_feature')
});

const DeltaConfig = Obj({
  contents: ResourceNode('block_state'),
  rim: ResourceNode('block_state'),
  size: IntProvider(0, 16),
  rim_size: IntProvider(0, 16)
});

const DiskConfig = Obj({
  state: ResourceNode('block_state'),
  radius: IntProvider(0, 8),
  half_height: IntNode({ min: 0, max: 4 }),
  targets: ListNode(ResourceNode('block_state'))
});

const DripstoneClusterConfig = Obj({
  floor_to_ceiling_search_range: IntNode({ min: 5, max: 512 }),
  height: IntProvider(1, 128),
  radius: IntProvider(1, 128),
  max_stalagmite_stalactite_height_diff: IntNode({ min: 0, max: 64 }),
  height_deviation: IntNode({ min: 1, max: 64 }),
  dripstone_block_layer_thickness: IntProvider(0, 128),
  density: FloatProvider(0, 2),
  wetness: FloatProvider(0, 2),
  chance_of_dripstone_column_at_max_distance_from_center: FloatNode({
    min: 0,
    max: 1
  }),
  max_distance_from_edge_affecting_chance_of_dripstone_column: IntNode({
    min: 1,
    max: 64
  }),
  max_distance_from_center_affecting_height_bias: IntNode({ min: 1, max: 64 })
});

export const BlockPos = ListNode(IntNode(), 3);
const EndGatewayConfig = Obj({
  exact: BoolNode(),
  exit: Opt(BlockPos)
});

const EndSpikeConfig = Obj({
  crystal_beam_target: Opt(BlockPos),
  crystal_invulnerable: BoolNode(false),
  spikes: ListNode(
    Obj({
      centerX: IntNode({ default: 0 }),
      centerZ: IntNode({ default: 0 }),
      height: IntNode({ default: 0 }),
      guarded: BoolNode(false)
    })
  )
});

const FillLayerConfig = Obj({
  height: IntNode({ min: 0, max: 4064 }),
  state: ResourceNode('block_state')
});

const FossilConfig = Obj({
  fossil_structures: ListNode(IdentifierNode('structures')),
  overlay_structures: ListNode(IdentifierNode('structures')),
  fossil_processors: ResourceNode('worldgen/processor_list'), // type
  overlay_processors: ResourceNode('worldgen/processor_list'), // type
  max_empty_corners_allowed: IntNode({ min: 0, max: 7 })
});

const GeodeConfig = Obj({
  blocks: Obj({
    filling_provider: ResourceNode('block_state_provider'),
    inner_layer_provider: ResourceNode('block_state_provider'),
    alternate_inner_layer_provider: ResourceNode('block_state_provider'),
    middle_layer_provider: ResourceNode('block_state_provider'),
    outer_layer_provider: ResourceNode('block_state_provider'),
    inner_placements: ListNode(ResourceNode('block_state')),
    cannot_replace: TagNode('block'),
    invalid_blocks: TagNode('block')
  }),
  layers: Obj({
    filling: FloatNode({ min: 0.01, max: 50, default: 1.7 }),
    inner_layer: FloatNode({ min: 0.01, max: 50, default: 2.2 }),
    middle_layer: FloatNode({ min: 0.01, max: 50, default: 3.2 }),
    outer_layer: FloatNode({ min: 0.01, max: 50, default: 4.2 })
  }),
  crack: Obj({
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
});

const GlowLichenConfig = Obj({
  search_range: IntNode({ min: 1, max: 64, default: 10 }),
  can_place_on_floor: BoolNode(false),
  can_place_on_ceiling: BoolNode(false),
  can_place_on_wall: BoolNode(false),
  chance_of_spreading: FloatNode({ min: 0, max: 1, default: 0.5 }),
  can_be_placed_on: ListNode(ResourceNode('block_state'))
});

const GrowingPlantConfig = Obj({
  height_distribution: ListNode(IntProvider(), -1, true),
  direction: Direction,
  body_provider: ResourceNode('block_state_provider'),
  head_provider: ResourceNode('block_state_provider'),
  allow_water: BoolNode()
});

const HugeFungusConfig = Obj({
  valid_base_block: ResourceNode('block_state'),
  stem_state: ResourceNode('block_state'),
  hat_state: ResourceNode('block_state'),
  decor_state: ResourceNode('block_state'),
  planted: BoolNode(false)
});

const HugeMushroomConfig = Obj({
  cap_provider: ResourceNode('block_state_provider'),
  stem_provider: ResourceNode('block_state_provider'),
  foliage_radius: IntNode({ default: 2 })
});

const LargeDripstoneConfig = Obj({
  floor_to_ceiling_search_range: IntNode({ min: 1, max: 512 }),
  column_radius: IntProvider(1, 60),
  height_scale: FloatProvider(0, 20),
  max_column_radius_to_cave_height_ratio: FloatNode({ min: 0.1, max: 1 }),
  stalactite_bluntness: FloatProvider(0.1, 10),
  stalagmite_bluntness: FloatProvider(0.1, 10),
  wind_speed: FloatProvider(0, 2),
  min_radius_for_wind: IntNode({ min: 0, max: 100 }),
  min_bluntness_for_wind: FloatNode({ min: 0, max: 5 })
});

const NetherrackReplaceBlobsConfig = Obj({
  target: ResourceNode('block_state'),
  state: ResourceNode('block_state'),
  radius: IntProvider(0, 12)
});

const BlockPredicate = SwitchNode(
  {
    always_true: Empty,
    block_match: Obj({
      block: ResourceNode('block')
    }),
    blockstate_match: Obj({
      block_state: ResourceNode('block_state')
    }),
    tag_match: Obj({
      tag: TagNode('block')
    }),
    random_block_match: Obj({
      block: ResourceNode('block'),
      ...Probability
    }),
    random_blockstate_match: Obj({
      block: ResourceNode('block_state'),
      ...Probability
    })
  },
  {
    block_match: {
      block: 'minecraft:stone'
    },
    blockstate_match: {
      block_state: {
        Name: 'minecraft:stone'
      }
    },
    tag_match: {
      tag: 'minecraft:base_stone_overworld'
    }
  },
  null,
  'predicate_type'
);
const ReplaceTarget = {
  target: BlockPredicate,
  state: ResourceNode('block_state')
};
const ReplaceSingleBlockConfig = Obj({
  targets: ListNode(Obj(ReplaceTarget))
});
const OreConfig = Obj({
  targets: ListNode(Obj(ReplaceTarget)),
  size: IntNode({ min: 0, max: 64 }),
  discard_chance_on_air_exposure: FloatNode({ min: 0, max: 1 })
});

const RandomBooleanSelector = Obj({
  feature_true: ResourceNode('worldgen/configured_feature'),
  feature_false: ResourceNode('worldgen/configured_feature')
});

const RandomPatchConfig = Obj({
  can_replace: BoolNode(false),
  project: BoolNode(true),
  need_water: BoolNode(false),
  xspread: IntNode({ default: 7 }),
  yspread: IntNode({ default: 3 }),
  zspread: IntNode({ default: 7 }),
  tries: IntNode({ default: 128 }),
  state_provider: ResourceNode('block_state_provider'),
  block_placer: BlockPlacer,
  whitelist: ListNode(ResourceNode('block_state')),
  blacklist: ListNode(ResourceNode('block_state'))
});

const RandomConfig = Obj({
  default: ResourceNode('worldgen/configured_feature'),
  features: ListNode(
    Obj({
      feature: ResourceNode('worldgen/configured_feature'),
      chance: FloatNode({ min: 0, max: 1 })
    })
  )
});

export const RootSystemConfig = {
  feature: ResourceNode('worldgen/configured_feature'),
  required_vertical_space_for_tree: IntNode({ min: 1, max: 64 }),
  root_radius: IntNode({ min: 1, max: 64 }),
  root_replaceable: TagNode('block'),
  root_state_provider: ResourceNode('block_state_provider'),
  root_placement_attempts: IntNode({ min: 1, max: 256 }),
  root_column_max_height: IntNode({ min: 1, max: 4096 }),
  hanging_root_radius: IntNode({ min: 1, max: 64 }),
  hanging_roots_vertical_span: IntNode({ min: 0, max: 16 }),
  hanging_root_state_provider: ResourceNode('block_state_provider'),
  hanging_root_placement_attempts: IntNode({ min: 1, max: 256 }),
  allowed_vertical_water_for_tree: IntNode({ min: 1, max: 64 })
};

const SimpleBlockConfig = Obj({
  to_place: ResourceNode('block_state_provider'),
  place_on: ListNode(ResourceNode('block_state')),
  place_in: ListNode(ResourceNode('block_state')),
  place_under: ListNode(ResourceNode('block_state'))
});

const SimpleRandomConfig = Obj({
  features: ListNode(ResourceNode('worldgen/configured_feature'))
});

const SmallDripstoneConfig = Obj({
  max_placements: IntNode({ min: 0, max: 100 }),
  empty_space_search_radius: IntNode({ min: 0, max: 20 }),
  max_offset_from_origin: IntNode({ min: 0, max: 20 }),
  chance_of_taller_dripstone: FloatNode({ min: 0, max: 1 })
});

const SpringConfig = Obj({
  state: ResourceNode('block_state'), // TODO fluid
  requires_block_below: BoolNode(true),
  rock_count: IntNode({ default: 4 }),
  hole_count: IntNode({ default: 1 }),
  valid_blocks: ListNode(ResourceNode('block'))
});

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
      bending_trunk_placer: Obj({
        ...TrunkPlacerBaseConfig.records,
        min_height_for_leaves: IntNode({
          min: 1,
          default: 1
        }),
        bend_length: IntProvider(1, 64)
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
        trunk_vine: Empty
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
        }
      },
      null
    )
  ),
  ignore_vines: BoolNode(false),
  force_dirt: BoolNode(false)
};

export const VegetationPatchConfig = {
  replaceable: TagNode('block'),
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

const UnderwaterMagmaConfig = Obj({
  floor_search_range: IntNode({ min: 0, max: 512 }),
  placement_radius_around_floor: IntNode({ min: 0, max: 64 }),
  placement_probability_per_valid_position: FloatNode({ min: 0, max: 1 })
});

const CountConfig = Obj({
  count: IntProvider(0, 256)
});

const StateConfig = Obj({
  state: ResourceNode('block_state')
});

export const ConfiguredFeature: Model = {
  node: SwitchNode(
    {
      bamboo: Obj(Probability),
      basalt_columns: BasaltColumnsConfig,
      basalt_pillar: Empty,
      block_pile: BlockPileConfig,
      blue_ice: Empty,
      bonus_chest: Empty,
      chorus_plant: Empty,
      coral_claw: Empty,
      coral_mushroom: Empty,
      coral_tree: Empty,
      decorated: DecoratedConfig,
      delta_feature: DeltaConfig,
      desert_well: Empty,
      disk: DiskConfig,
      dripstone_cluster: DripstoneClusterConfig,
      end_gateway: EndGatewayConfig,
      end_island: Empty,
      end_spike: EndSpikeConfig,
      fill_layer: FillLayerConfig,
      flower: RandomPatchConfig,
      forest_rock: StateConfig,
      fossil: FossilConfig,
      freeze_top_layer: Empty,
      geode: GeodeConfig,
      glow_lichen: GlowLichenConfig,
      glowstone_blob: Empty,
      growing_plant: GrowingPlantConfig,
      huge_brown_mushroom: HugeMushroomConfig,
      huge_fungus: HugeFungusConfig,
      huge_red_mushroom: HugeMushroomConfig,
      iceberg: StateConfig,
      ice_patch: DiskConfig,
      ice_spike: Empty,
      kelp: Empty,
      lake: StateConfig,
      large_dripstone: LargeDripstoneConfig,
      monster_room: Empty,
      nether_forest_vegetation: BlockPileConfig,
      netherrack_replace_blobs: NetherrackReplaceBlobsConfig,
      no_bonemeal_flower: RandomPatchConfig,
      no_op: Empty,
      ore: OreConfig,
      random_boolean_selector: RandomBooleanSelector,
      random_patch: RandomPatchConfig,
      random_selector: RandomConfig,
      replace_single_block: ReplaceSingleBlockConfig,
      root_system: Obj(RootSystemConfig),
      scattered_ore: OreConfig,
      seagrass: Obj(Probability),
      sea_pickle: CountConfig,
      simple_block: SimpleBlockConfig,
      simple_random_selector: SimpleRandomConfig,
      small_dripstone: SmallDripstoneConfig,
      spring_feature: SpringConfig,
      tree: Obj(TreeConfig),
      twisting_vines: Empty,
      underwater_magma: UnderwaterMagmaConfig,
      vegetation_patch: Obj(VegetationPatchConfig),
      vines: Empty,
      void_start_platform: Empty,
      waterlogged_vegetation_patch: Obj(VegetationPatchConfig),
      weeping_vines: Empty
    },
    {
      bamboo: 'bamboo',
      basalt_columns: 'small_basalt_columns',
      basalt_pillar: 'basalt_pillar',
      block_pile: 'pile_hay',
      blue_ice: 'blue_ice',
      bonus_chest: 'bonus_chest',
      chorus_plant: 'chorus_plant',
      coral_claw: {},
      coral_mushroom: {},
      coral_tree: {},
      delta_feature: 'delta',
      desert_well: 'desert_well',
      disk: 'disk_clay',
      dripstone_cluster: 'dripstone_cluster',
      end_gateway: 'end_gateway',
      end_island: 'end_island',
      end_spike: 'end_spike',
      fill_layer: DECORATED_FILL_LAYER,
      flower: 'flower_plain',
      forest_rock: 'forest_rock',
      fossil: 'fossil',
      freeze_top_layer: 'freeze_top_layer',
      geode: 'amethyst_geode',
      glow_lichen: 'glow_lichen',
      growing_plant: 'cave_vine',
      huge_brown_mushroom: 'huge_brown_mushroom',
      huge_fungus: 'warped_fungi',
      huge_red_mushroom: 'huge_red_mushroom',
      ice_patch: 'ice_patch',
      ice_spike: 'ice_spike',
      iceberg: 'iceberg_blue',
      kelp: 'kelp_cold',
      lake: 'lake_water',
      large_dripstone: 'large_dripstone',
      monster_room: 'monster_room',
      nether_forest_vegetation: 'nether_sprouts',
      netherrack_replace_blobs: 'basalt_blobs',
      // @ts-ignore
      no_bonemeal_flower: DECORATED_NO_BONEMEAL_FLOWER,
      no_op: {},
      ore: 'ore_copper',
      random_boolean_selector: 'mushroom_field_vegetation',
      random_patch: 'patch_cactus',
      random_selector: 'plain_vegetation',
      replace_single_block: 'ore_emerald',
      root_system: 'rooted_azalea_trees',
      scattered_ore: 'prototype_ore_lapis_buried',
      sea_pickle: 'sea_pickle',
      seagrass: 'seagrass_simple',
      simple_block: 'moss_vegetation',
      simple_random_selector: 'forest_flower_vegetation',
      small_dripstone: 'small_dripstone',
      spring_feature: 'spring_water',
      tree: 'trees_badlands',
      twisting_vines: 'twisting_vines',
      underwater_magma: 'prototype_underwater_magma',
      vegetation_patch: 'moss_patch',
      vines: 'vines',
      void_start_platform: 'void_start_platform',
      waterlogged_vegetation_patch: 'clay_pool_with_dripleaves',
      weeping_vines: 'weeping_vines'
    }
  ),
  preset: () => DECORATED_TREE
};

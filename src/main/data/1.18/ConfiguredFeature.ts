import { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Empty, Obj, ObjectNodeParams } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import type { SwitchNodeParams } from '../../model/node/SwitchNode';
import { omit } from '../../util/DataHelper';
import {
  ConfiguredFeature as ConfiguredFeature1_17,
  RootSystemConfig as RootSystemConfig1_17,
  VegetationPatchConfig as VegetationPatchConfig1_17
} from '../1.17/ConfiguredFeature';
import { Direction } from '../1.17/Direction';
import { IntProvider } from '../1.17/NumberProvider';

const BlockColumnConfig = Obj({
  direction: Direction,
  allowed_placement: ResourceNode('block_predicate'),
  prioritize_tip: BoolNode(),
  layers: ListNode(
    Obj({
      height: IntProvider(0),
      provider: ResourceNode('block_state_provider')
    })
  )
});

const GlowLichenConfig = Obj({
  search_range: IntNode({ min: 1, max: 64, default: 10 }),
  can_place_on_floor: BoolNode(false),
  can_place_on_ceiling: BoolNode(false),
  can_place_on_wall: BoolNode(false),
  chance_of_spreading: FloatNode({ min: 0, max: 1, default: 0.5 }),
  can_be_placed_on: ListNode(ResourceNode('block'))
});

const NetherForestVegetationConfig = Obj({
  state_provider: ResourceNode('block_state_provider'),
  spread_width: IntNode({ min: 1 }),
  spread_height: IntNode({ min: 1 })
});

const PointedDripstoneConfig = Obj({
  chance_of_taller_dripstone: FloatNode({ min: 0, max: 1, default: 0.2 }),
  chance_of_directional_spread: FloatNode({ min: 0, max: 1, default: 0.7 }),
  chance_of_spread_radius2: FloatNode({ min: 0, max: 1, default: 0.5 }),
  chance_of_spread_radius3: FloatNode({ min: 0, max: 1, default: 0.5 })
});

const SimpleRandomConfig = Obj({
  features: ListNode(ResourceNode('worldgen/placed_feature'))
});

const SimpleBlockConfig = Obj({
  to_place: ResourceNode('block_state_provider')
});

const RootSystemConfig = Obj({
  ...RootSystemConfig1_17,
  feature: ResourceNode('worldgen/placed_feature'),
  allowed_tree_position: ResourceNode('block_predicate')
});

const RandomBooleanSelector = Obj({
  feature_true: ResourceNode('worldgen/placed_feature'),
  feature_false: ResourceNode('worldgen/placed_feature')
});

const RandomConfig = Obj({
  default: ResourceNode('worldgen/placed_feature'),
  features: ListNode(
    Obj({
      feature: ResourceNode('worldgen/placed_feature'),
      chance: FloatNode({ min: 0, max: 1 })
    })
  )
});

const RandomPatchConfig = Obj({
  tries: IntNode({ min: 1, default: 128 }),
  xz_spread: IntNode({ min: 0, default: 7 }),
  y_spread: IntNode({ min: 0, default: 3 }),
  feature: ResourceNode('worldgen/placed_feature')
});

const VegetationPatchConfig = Obj({
  ...VegetationPatchConfig1_17,
  vegetation_feature: ResourceNode('worldgen/placed_feature')
});

const features1_17 = ConfiguredFeature1_17.node as SwitchNodeParams;
const featureValues = omit(features1_17.values, 'decorated', 'lake_water');
const tree = omit(
  (features1_17.values.tree as ObjectNodeParams).records,
  'sapling_provider'
);
export const ConfiguredFeature: Model = {
  node: SwitchNode(
    {
      ...featureValues,
      block_column: BlockColumnConfig,
      flower: RandomPatchConfig,
      glow_lichen: GlowLichenConfig,
      lake: Obj({
        fluid: ResourceNode('block_state_provider'),
        barrier: ResourceNode('block_state_provider')
      }),
      monster_room_deep: Empty,
      nether_forest_vegetation: NetherForestVegetationConfig,
      no_bonemeal_flower: RandomPatchConfig,
      ore_gold_lower: Empty,
      pointed_dripstone: PointedDripstoneConfig,
      random_boolean_selector: RandomBooleanSelector,
      random_selector: RandomConfig,
      random_patch: RandomPatchConfig,
      root_system: RootSystemConfig,
      simple_block: SimpleBlockConfig,
      simple_random_selector: SimpleRandomConfig,
      tree: Obj(tree),
      vegetation_patch: VegetationPatchConfig,
      waterlogged_vegetation_patch: VegetationPatchConfig
    },
    {
      ...features1_17.preset,
      // @ts-ignore
      bamboo: 'bamboo_some_podzol',
      basalt_columns: 'small_basalt_columns',
      basalt_pillar: 'basalt_pillar',
      block_column: 'patch_cactus',
      block_pile: 'pile_melon',
      blue_ice: 'blue_ice',
      bonus_chest: 'bonus_chest',
      chorus_plant: 'chorus_plant',
      delta_feature: 'delta',
      desert_well: 'desert_well',
      disk: 'disk_clay',
      dripstone_cluster: 'dripstone_cluster',
      end_gateway: 'end_gateway_delayed',
      end_island: 'end_island',
      end_spike: 'end_spike',
      flower: 'flower_swamp',
      forest_rock: 'forest_rock',
      fossil: 'fossil_coal',
      freeze_top_layer: 'freeze_top_layer',
      geode: 'amethyst_geode',
      glow_lichen: 'glow_lichen',
      glowstone_blob: 'glowstone_extra',
      huge_brown_mushroom: 'huge_brown_mushroom',
      huge_fungus: 'warped_fungus_planted',
      huge_red_mushroom: 'huge_red_mushroom',
      iceberg: 'iceberg_blue',
      ice_patch: 'ice_patch',
      ice_spike: 'ice_spike',
      kelp: 'kelp',
      lake: 'lake_lava',
      large_dripstone: 'large_dripstone',
      monster_room: 'monster_room',
      nether_forest_vegetation: 'nether_sprouts_bonemeal',
      netherrack_replace_blobs: 'blackstone_blobs',
      ore: 'ore_gravel_nether',
      random_boolean_selector: 'mushroom_island_vegetation',
      random_patch: 'patch_grass',
      random_selector: 'trees_savanna',
      root_system: 'rooted_azalea_tree',
      scattered_ore: 'ore_ancient_debris_large',
      seagrass: 'seagrass_mid',
      sea_pickle: 'sea_pickle',
      simple_block: 'single_piece_of_grass',
      simple_random_selector: 'warm_ocean_vegetation',
      spring_feature: 'spring_nether_closed',
      tree: 'oak',
      twisting_vines: 'twisting_vines_bonemeal',
      underwater_magma: 'underwater_magma',
      vegetation_patch: 'clay_with_dripleaves',
      vines: 'vines',
      void_start_platform: 'void_start_platform',
      waterlogged_vegetation_patch: 'clay_pool_with_dripleaves',
      weeping_vines: 'weeping_vines'
    }
  ),
  preset: ConfiguredFeature1_17.preset
};

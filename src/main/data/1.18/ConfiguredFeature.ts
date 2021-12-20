import { Model, ObjectModel } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { ObjectNode } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import type { SwitchNodeParams } from '../../model/node/SwitchNode';
import {
  ConfiguredFeature as ConfiguredFeature1_17,
  RootSystemConfig as RootSystemConfig1_17,
  VegetationPatchConfig as VegetationPatchConfig1_17
} from '../1.17/ConfiguredFeature';

const GlowLichenConfig: ObjectModel = {
  search_range: IntNode({ min: 1, max: 64, default: 10 }),
  can_place_on_floor: BoolNode(false),
  can_place_on_ceiling: BoolNode(false),
  can_place_on_wall: BoolNode(false),
  chance_of_spreading: FloatNode({ min: 0, max: 1, default: 0.5 }),
  can_be_placed_on: ListNode(ResourceNode('block'))
};

const SimpleRandomConfig: ObjectModel = {
  features: ListNode(ResourceNode('worldgen/placed_feature'))
};

const RootSystemConfig: ObjectModel = {
  ...RootSystemConfig1_17,
  feature: ResourceNode('worldgen/placed_feature'),
  allowed_tree_position: ResourceNode('block_predicate')
};

const RandomBooleanSelector: ObjectModel = {
  feature_true: ResourceNode('worldgen/placed_feature'),
  feature_false: ResourceNode('worldgen/placed_feature')
};

const RandomConfig: ObjectModel = {
  default: ResourceNode('worldgen/placed_feature'),
  features: ListNode(
    ObjectNode({
      feature: ResourceNode('worldgen/placed_feature'),
      chance: FloatNode({ min: 0, max: 1 })
    })
  )
};

const VegetationPatchConfig: ObjectModel = {
  ...VegetationPatchConfig1_17,
  vegetation_feature: ResourceNode('worldgen/placed_feature')
};

const features1_17 = ConfiguredFeature1_17.node as SwitchNodeParams;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { decorated, lake_water, ...featureValues } = features1_17.values;
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { sapling_provider, ...tree } = features1_17.values.tree;
export const ConfiguredFeature: Model = {
  node: SwitchNode(
    {
      ...featureValues,
      glow_lichen: GlowLichenConfig,
      lake: {
        fluid: ResourceNode('block_state_provider'),
        barrier: ResourceNode('block_state_provider')
      },
      monster_room_deep: {},
      ore_gold_lower: {},
      random_boolean_selector: RandomBooleanSelector,
      random_selector: RandomConfig,
      root_system: RootSystemConfig,
      simple_random_selector: SimpleRandomConfig,
      tree,
      vegetation_patch: VegetationPatchConfig,
      waterlogged_vegetation_patch: VegetationPatchConfig
    },
    features1_17.preset
  ),
  preset: ConfiguredFeature1_17.preset
};

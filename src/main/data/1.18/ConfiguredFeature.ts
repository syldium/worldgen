import { ConfiguredFeature as ConfiguredFeature1_17 } from '../1.17/ConfiguredFeature';
import { Model, ObjectModel } from '../../model/Model';
import { SwitchNode } from '../../model/node/SwitchNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { IntNode } from '../../model/node/IntNode';
import { BoolNode } from '../../model/node/BoolNode';
import { FloatNode } from '../../model/node/FloatNode';
import { ListNode } from '../../model/node/ListNode';
import type { SwitchNodeParams } from '../../model/node/SwitchNode';

const GlowLichenConfig: ObjectModel = {
  search_range: IntNode({ min: 1, max: 64, default: 10 }),
  can_place_on_floor: BoolNode(false),
  can_place_on_ceiling: BoolNode(false),
  can_place_on_wall: BoolNode(false),
  chance_of_spreading: FloatNode({ min: 0, max: 1, default: 0.5 }),
  can_be_placed_on: ListNode(ResourceNode('block'))
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
      tree,
      monster_room_deep: {},
      ore_gold_lower: {}
    },
    features1_17.preset
  ),
  preset: ConfiguredFeature1_17.preset
};

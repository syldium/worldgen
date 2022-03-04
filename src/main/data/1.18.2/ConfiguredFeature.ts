import { Model, ObjectModel } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import {
  IdentifierNode,
  ResourceNode,
  TagNode
} from '../../model/node/ResourceNode';
import { SwitchNode, SwitchNodeParams } from '../../model/node/SwitchNode';
import {
  ConfiguredFeature as ConfiguredFeature1_18
} from '../1.18/ConfiguredFeature';

const GlowLichenConfig: ObjectModel = {
  search_range: IntNode({ min: 1, max: 64, default: 10 }),
  can_place_on_floor: BoolNode(false),
  can_place_on_ceiling: BoolNode(false),
  can_place_on_wall: BoolNode(false),
  chance_of_spreading: FloatNode({ min: 0, max: 1, default: 0.5 }),
  can_be_placed_on: TagNode('block')
};

const SimpleRandomConfig: ObjectModel = {
  features: TagNode('worldgen/placed_feature')
};

const SpringConfig: ObjectModel = {
  state: ResourceNode('block_state'), // TODO fluid
  requires_block_below: BoolNode(true),
  rock_count: IntNode({ default: 4 }),
  hole_count: IntNode({ default: 1 }),
  valid_blocks: TagNode('block')
};

const features1_18 = ConfiguredFeature1_18.node as SwitchNodeParams;
export const ConfiguredFeature: Model = {
  node: SwitchNode(
    {
      ...features1_18.values,
      glow_lichen: GlowLichenConfig,
      simple_random_selector: SimpleRandomConfig,
      spring_feature: SpringConfig
    },
    features1_18.preset
  ),
  preset: ConfiguredFeature1_18.preset
};

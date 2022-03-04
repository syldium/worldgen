import { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { IntNode } from '../../model/node/IntNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { VerticalSurface } from '../1.17/WorldgenStep';
import {
  RuleCondition as RuleCondition1_18,
  RuleSource as RuleSource1_18
} from '../1.18/SurfaceRule';

const RuleCondition = SwitchNode({
  ...RuleCondition1_18.values,
  stone_depth: {
    offset: IntNode(),
    add_surface_depth: BoolNode(),
    secondary_depth_range: IntNode(),
    surface_type: VerticalSurface
  }
});

export const MaterialRule: Model = {
  node: SwitchNode(
    {
      ...RuleSource1_18.values,
      condition: {
        if_true: RuleCondition,
        then_run: ResourceNode('worldgen/material_rule')
      }
    },
    RuleSource1_18.preset,
    RuleSource1_18.config
  ),
  preset: () => ({})
};

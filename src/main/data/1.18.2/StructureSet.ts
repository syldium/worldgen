import { Model } from '../../model/Model';
import { EnumNode } from '../../model/node/EnumNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj, Opt } from '../../model/node/ObjectNode';
import { IdentifierNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';

export const StructureSet: Model = {
  node: Obj({
    structures: ListNode(Obj({
      structure: IdentifierNode('worldgen/configured_structure_feature'),
      weight: IntNode({ min: 1 })
    })),
    placement: SwitchNode({
      concentric_rings: Obj({
        distance: IntNode({ min: 0, max: 1023 }),
        spread: IntNode({ min: 0, max: 1023 }),
        count: IntNode({ min: 1, max: 4095 })
      }),
      random_spread: Obj({
        spread_type: EnumNode(['linear', 'triangular'] as const, 'linear'),
        spacing: IntNode({ min: 0, max: 4096 }),
        separation: IntNode({ min: 0, max: 4096 }),
        salt: IntNode({ min: 0 }),
        locate_offset: Opt(ListNode(
          IntNode({ min: -16, max: 16, default: 0 }),
          3
        ))
      })
    }, {
      concentric_rings: {
        distance: 32,
        spread: 3,
        count: 128
      },
      random_spread: {
        spacing: 2,
        separation: 1,
        salt: 7431
      }
    }, null)
  }),
  preset: () => ({
    structures: [
      {
        structure: 'minecraft:nether_fossil',
        weight: 1
      }
    ],
    placement: {
      type: 'minecraft:random_spread',
      spacing: 2,
      separation: 1,
      salt: 7431
    }
  })
};

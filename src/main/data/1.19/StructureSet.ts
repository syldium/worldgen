import type { Model } from '../../model/Model';
import { EnumNode } from '../../model/node/EnumNode';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj, Opt } from '../../model/node/ObjectNode';
import { IdentifierNode, TagNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { StructureSet as StructureSet1_18_2 } from '../1.18.2/StructureSet';

export const StructureSet: Model = {
  node: Obj({
    structures: ListNode(Obj({
      structure: IdentifierNode('worldgen/structure'),
      weight: IntNode({ min: 1 })
    })),
    placement: SwitchNode(
      {
        concentric_rings: Obj({
          distance: IntNode({ min: 0, max: 1023 }),
          spread: IntNode({ min: 0, max: 1023 }),
          count: IntNode({ min: 1, max: 4095 }),
          preferred_biomes: TagNode('worldgen/biome')
        }),
        random_spread: Obj({
          spread_type: EnumNode(['linear', 'triangular'], 'linear'),
          spacing: IntNode({ min: 0, max: 4096 }),
          separation: IntNode({ min: 0, max: 4096 })
        })
      },
      {
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
      },
      null,
      'type',
      Obj({
        salt: IntNode({ min: 0 }),
        locate_offset: Opt(ListNode(
          IntNode({ min: -16, max: 16, default: 0 }),
          3
        )),
        frequency_reduction_method: EnumNode(
          [
            'default',
            'legacy_type_1',
            'legacy_type_2',
            'legacy_type_3'
          ],
          'default'
        ),
        frequency: FloatNode({ min: 0, max: 1, default: 1 }),
        exclusion_zone: Opt(Obj({
          other_set: IdentifierNode('worldgen/structure_set'),
          chunk_count: IntNode({ min: 1, max: 16 })
        }))
      })
    )
  }),
  preset: StructureSet1_18_2.preset
};

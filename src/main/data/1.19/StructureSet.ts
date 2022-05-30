import type { Model } from '../../model/Model';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj, ObjectNodeParams } from '../../model/node/ObjectNode';
import { IdentifierNode } from '../../model/node/ResourceNode';
import { StructureSet as StructureSet1_18_2 } from '../1.18.2/StructureSet';

export const StructureSet: Model = {
  node: Obj({
    ...(StructureSet1_18_2.node as ObjectNodeParams).records,
    structures: ListNode(Obj({
      structure: IdentifierNode('worldgen/structure'),
      weight: IntNode({ min: 1 })
    }))
  }),
  preset: StructureSet1_18_2.preset
};

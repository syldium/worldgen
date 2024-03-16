import { Model } from '../../model/Model';
import { EnumNode } from '../../model/node/EnumNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Empty, Obj, ObjectNodeParams } from '../../model/node/ObjectNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { StringNode } from '../../model/node/StringNode';
import { SwitchNode } from '../../model/node/SwitchNode';

const Projection = {
  projection: EnumNode(['rigid', 'terrain_matching'])
};
export const TemplateElement = SwitchNode(
  {
    single_pool_element: Obj({
      ...Projection,
      location: IdentifierNode('structures'),
      processors: ResourceNode('worldgen/processor_list')
    }),
    list_pool_element: Obj({
      ...Projection,
      elements: Empty // changed after
    }),
    feature_pool_element: Obj({
      ...Projection,
      feature: ResourceNode('worldgen/placed_feature')
    }),
    empty_pool_element: Empty,
    legacy_single_pool_element: Obj({
      ...Projection,
      location: IdentifierNode('structures'),
      processors: ResourceNode('worldgen/processor_list')
    })
  },
  {},
  null,
  'element_type'
);
(TemplateElement.values.list_pool_element as ObjectNodeParams).records
  .elements = ListNode(TemplateElement);

export const TemplatePool: Model = {
  node: Obj({
    name: StringNode(),
    fallback: StringNode(),
    elements: ListNode(Obj({
      element: TemplateElement,
      weight: IntNode({ min: 1, max: 150 })
    }))
  }),
  preset: () => ({
    fallback: 'minecraft:empty',
    elements: [
      {
        element: {
          element_type: 'minecraft:single_pool_element',
          projection: 'rigid',
          processors: 'minecraft:empty'
        },
        weight: 1
      }
    ]
  })
};

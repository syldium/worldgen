import { Model } from '../../model/Model';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Empty, Obj } from '../../model/node/ObjectNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { StringNode } from '../../model/node/StringNode';
import { SwitchNode } from '../../model/node/SwitchNode';

export const TemplatePool: Model = {
  node: Obj({
    name: StringNode(),
    fallback: StringNode(),
    elements: ListNode(Obj({
      element: SwitchNode(
        {
          single_pool_element: Obj({
            location: IdentifierNode('structure'),
            processors: ResourceNode('worldgen/processor_list')
          }),
          list_pool_element: Obj({
            elements: ListNode(ResourceNode('worldgen/template_pool'))
          }),
          feature_pool_element: Obj({
            feature: ResourceNode('worldgen/placed_feature')
          }),
          empty_pool_element: Empty,
          legacy_single_pool_element: Obj({
            location: IdentifierNode('structure'),
            processors: ResourceNode('worldgen/processor_list')
          })
        },
        {},
        null,
        'element_type'
      ),
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
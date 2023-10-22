import { Model } from '../../model/Model';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj } from '../../model/node/ObjectNode';
import { StringNode } from '../../model/node/StringNode';
import {
  TemplateElement,
  TemplatePool as TemplatePool1_18
} from '../1.18/TemplatePool';

export const TemplatePool: Model = {
  node: Obj({
    fallback: StringNode(),
    elements: ListNode(Obj({
      element: TemplateElement,
      weight: IntNode({ min: 1, max: 150 })
    }))
  }),
  preset: TemplatePool1_18.preset
};

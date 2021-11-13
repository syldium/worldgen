import { Obj } from '../../util/DomHelper';
import { isValidNamespacedKey } from '../../util/LabelHelper';
import { ModelNode, NodeBase } from './Node';
import { IdentifierNodeParams } from './ResourceNode';

export interface MapNodeParams extends NodeBase<'map'> {
  key: IdentifierNodeParams;
  value: ModelNode;
}

export const MapNode = (
  key: IdentifierNodeParams,
  value: ModelNode
): MapNodeParams => ({
  key,
  value,
  type: 'map',
  isValid: (value: unknown) =>
    value !== null &&
    typeof value === 'object' &&
    Object.keys(value as Obj).every(isValidNamespacedKey)
});

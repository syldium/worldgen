import type { Obj } from '../../util/DomHelper';
import type { EnumNodeParams } from './EnumNode';
import type { ModelNode, NodeBase } from './Node';
import type { IdentifierNodeParams } from './ResourceNode';
import type { StringNodeParams } from './StringNode';

type KeyNode = IdentifierNodeParams | EnumNodeParams | StringNodeParams;
export interface MapNodeParams extends NodeBase<'map'> {
  key: KeyNode;
  value: ModelNode;
}

export const MapNode = (
  key: KeyNode,
  value: ModelNode
): MapNodeParams => ({
  key,
  value,
  type: 'map',
  isValid: (value: unknown) =>
    value !== null &&
    typeof value === 'object' &&
    Object.keys(value as Obj).every(key.isValid)
});

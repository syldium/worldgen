import type { Obj } from '../../util/DomHelper';
import type { EnumNodeParams } from './EnumNode';
import type { ErrorCollector, ModelNode, NodeBase } from './Node';
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
  validate: function (path: string, value: unknown, errors: ErrorCollector) {
    if (value === null || typeof value !== 'object') {
      return errors.add(path, 'Expected an object');
    }
    const map = value as Obj;
    for (const key in map) {
      this.key.validate(path, key, errors);
      this.value.validate(path + '[' + key + ']', map[key], errors);
    }
  }
});

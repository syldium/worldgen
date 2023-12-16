import type { Obj } from '../../util/DomHelper';
import type { RegistryHolder } from '../Registry';
import type { EnumNodeParams } from './EnumNode';
import type { ErrorCollector, ModelNode, NodeBase } from './Node';
import type { IdentifierNodeParams } from './ResourceNode';
import type { StringNodeParams } from './StringNode';

type KeyNode =
  | IdentifierNodeParams<'identifier'>
  | EnumNodeParams
  | StringNodeParams;
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
  validate: function (
    path: string,
    value: unknown,
    errors: ErrorCollector,
    holder?: RegistryHolder
  ) {
    if (value === null || typeof value !== 'object') {
      return errors.add(path, 'Expected an object');
    }
    const map = value as Obj;
    for (const key in map) {
      this.key.validate(path, key, errors, holder);
      this.value.validate(path + '[' + key + ']', map[key], errors, holder);
    }
  }
});

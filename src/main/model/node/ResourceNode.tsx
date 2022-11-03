import { isValidNamespacedKey } from '../../util/LabelHelper';
import type { RegistryHolder } from '../Registry';
import type { RegistryKey, WorldgenRegistryKey } from '../RegistryKey';
import type { NodeBase } from './Node';
import type { ErrorCollector } from './Node';

const MayInline = new Set<RegistryKey>([
  'worldgen/configured_feature',
  'worldgen/placed_feature'
]);

export interface IdentifierNodeParams
  extends NodeBase<'identifier' | 'resource'>
{
  registry: RegistryKey;
}
export const IdentifierNode = (key: RegistryKey): IdentifierNodeParams => {
  return {
    registry: key,
    type: 'identifier',
    validate: function (path: string, value: unknown, errors: ErrorCollector) {
      if (value == null && typeof this.default === 'string') {
        return;
      } else if (typeof value === 'string') {
        if (!isValidNamespacedKey(value)) {
          return errors.add(path, 'Expected a valid identifier');
        }
      } else {
        errors.add(path, 'Expected a resource identifier');
      }
    }
  };
};

export const ResourceNode = (
  key: RegistryKey,
  def?: string | Record<string, unknown>
): IdentifierNodeParams => {
  return {
    default: def,
    registry: key,
    type: 'resource',
    validate: function (
      path: string,
      value: unknown,
      errors: ErrorCollector,
      holder?: RegistryHolder
    ) {
      if (value == null && typeof this.default !== 'undefined') {
        return;
      } else if (typeof value === 'string') {
        if (isValidNamespacedKey(value)) {
          return;
        } else {
          return errors.add(path, 'Expected a valid identifier');
        }
      } else if (value != null) {
        return holder?.worldgen[this.registry as WorldgenRegistryKey]?.model
          .node.validate(path, value, errors, holder);
      }
      errors.add(path, 'Expected a resource');
    }
  };
};

export interface TagNodeParams extends NodeBase<'tag'> {
  registry: IdentifierNodeParams;
}
export const TagNode = (key: RegistryKey): TagNodeParams => ({
  registry: MayInline.has(key) ? ResourceNode(key) : IdentifierNode(key),
  type: 'tag',
  validate: function (
    path: string,
    value: unknown,
    errors: ErrorCollector,
    holder?: RegistryHolder
  ) {
    if (Array.isArray(value)) {
      if (!value.every((val) => typeof val === typeof value[0])) {
        errors.add(path, 'Excepted an array with objects of the same type');
      }
      for (const i in value) {
        this.registry.validate(path + '[' + i + ']', value[i], errors, holder);
      }
    } else if (typeof value === 'string' && value.startsWith('#')) {
      this.registry.validate(path, value.substring(1), errors, holder);
    } else {
      this.registry.validate(path, value, errors, holder);
    }
  }
});

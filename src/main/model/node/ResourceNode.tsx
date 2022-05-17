import { isValidNamespacedKey } from '../../util/LabelHelper';
import type { RegistryKey } from '../RegistryKey';
import type { NodeBase } from './Node';
import type { ErrorCollector } from './Node';

export interface IdentifierNodeParams
  extends NodeBase<'identifier' | 'resource' | 'tag'>
{
  registry: RegistryKey;
}
const isIdentifier = (val: unknown) =>
  typeof val === 'string' && isValidNamespacedKey(val);
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
    validate: function (path: string, value: unknown, errors: ErrorCollector) {
      if (value == null && typeof this.default !== 'undefined') {
        return;
      } else if (typeof value === 'string') {
        if (isValidNamespacedKey(value)) {
          return;
        } else {
          return errors.add(path, 'Expected a valid identifier');
        }
      } else if (typeof value === 'object') {
        return;
      }
      errors.add(path, 'Expected a resource');
    }
  };
};

export const TagNode = (key: RegistryKey): IdentifierNodeParams => ({
  registry: key,
  type: 'tag',
  validate: function (path: string, value: unknown, errors: ErrorCollector) {
    if (Array.isArray(value)) {
      for (const i in value) {
        if (!(typeof value === 'object') && !isIdentifier(value[i])) {
          errors.add(
            path + '[' + i + ']',
            'Excepted a valid identifier for tag'
          );
        }
      }
    } else if (typeof value !== 'string') {
      errors.add(path, 'Excepted a valid tag');
    }
  }
});

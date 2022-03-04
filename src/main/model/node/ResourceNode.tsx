import { isValidNamespacedKey } from '../../util/LabelHelper';
import type { RegistryKey } from '../RegistryKey';
import type { NodeBase } from './Node';

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
    isValid: isIdentifier
  };
};

const isResource = (val: unknown) =>
  (val !== null && typeof val === 'object') || isIdentifier(val);
export const ResourceNode = (
  key: RegistryKey,
  def?: string | Record<string, unknown>
): IdentifierNodeParams => {
  return {
    default: def,
    registry: key,
    type: 'resource',
    isValid: isResource
  };
};

const isTag = (val: unknown) =>
  Array.isArray(val) ?
    val.every(v => typeof v === 'string') :
    typeof val === 'string';
export const TagNode = (key: RegistryKey): IdentifierNodeParams => ({
  registry: key,
  type: 'tag',
  isValid: isTag
});

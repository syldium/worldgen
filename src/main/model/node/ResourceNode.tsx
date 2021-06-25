import { isValidNamespacedKey } from '../../util/LabelHelper';
import { NodeBase } from './Node';
import { RegistryKey } from '../Registry';

export interface IdentifierNodeParams
  extends NodeBase<'identifier' | 'resource'> {
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
export const ResourceNode = (key: RegistryKey): IdentifierNodeParams => {
  return {
    registry: key,
    type: 'resource',
    isValid: isResource
  };
};

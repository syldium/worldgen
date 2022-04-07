import { isRegistryKey } from '../model/RegistryKey';
import type { RegistryKey } from '../model/RegistryKey';
import { isValidNamespace, isValidValue } from './LabelHelper';

/**
 * Determine the file path in a datapack for a resource.
 *
 * @param registryKey The type of the resource
 * @param resourceKey The resource identifier
 * @return A path to a json file from the root of the datapack
 */
export function resourcePath(
  registryKey: RegistryKey,
  resourceKey: string
): string {
  const [namespace, filename] = resourceKey.split(':');
  return `data/${namespace}/${registryKey}/${filename}.json`;
}

/**
 * Extract from a file path the type and name of the resource.
 *
 * @param path The path in the datapack of the file
 * @return A tuple with the namespace, the ressource key and the registry type
 */
export function findNamespacedKeyAndRegistry(
  path: string
): [string, string, RegistryKey] | null {
  // Check that the path has the required pattern
  const filenames = path.split('/');
  if (filenames.length < 4 || filenames[0] !== 'data') {
    return null;
  }
  if (!isValidNamespace(filenames[1])) {
    return null;
  }

  // Try to extract the resource type
  // data/namespace/ *registry* /filename.json
  let registry: RegistryKey | null = null;
  let subRegistry: string | null = null;
  if (isRegistryKey(filenames[2])) {
    registry = filenames[2];
  } else {
    // A type may be split into sub-registries
    subRegistry = filenames[2] + '/' + filenames[3];
    if (isRegistryKey(subRegistry)) {
      registry = subRegistry;
    }
  }

  // If no known registry has been identified
  if (!registry) {
    return null;
  }

  // Extract now the resource name
  // This key can include subdirectories
  let key = filenames.slice(subRegistry ? 4 : 3).join('/');
  if (registry === 'structures' && key.endsWith('.nbt')) {
    return [
      filenames[1],
      key.substring(0, key.length - '.nbt'.length),
      registry
    ];
  }
  if (!key.endsWith('.json')) {
    return null;
  }
  key = key.substring(0, key.length - '.json'.length);
  if (!isValidValue(key)) {
    return null;
  }
  return [filenames[1], key, registry];
}

export function removeTagHash(value: string): string {
  return value.startsWith('#') ? value.substring(1) : value;
}

export function addTagHash(needHash: boolean, value: string): string {
  return needHash ? '#' + value : value;
}

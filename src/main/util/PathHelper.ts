import { isWorldgenRegistryKey } from '../model/RegistryKey';
import type { RegistryKey, WorldgenRegistryKey } from '../model/RegistryKey';
import { isValidNamespace, isValidValue } from './LabelHelper';

export function resourcePath(
  registryKey: RegistryKey,
  resourceKey: string
): string {
  const [namespace, filename] = resourceKey.split(':');
  return `data/${namespace}/${registryKey}/${filename}.json`;
}

export function findNamespacedKeyAndRegistry(
  path: string
): [string, string, WorldgenRegistryKey] | null {
  const filenames = path.split('/');
  if (filenames.length < 4 || filenames[0] !== 'data') {
    return null;
  }
  if (!isValidNamespace(filenames[1])) {
    return null;
  }

  let registry: WorldgenRegistryKey | null = null;
  let subRegistry: string | null = null;
  if (isWorldgenRegistryKey(filenames[2])) {
    registry = filenames[2];
  } else {
    subRegistry = filenames[2] + '/' + filenames[3];
    if (isWorldgenRegistryKey(subRegistry)) {
      registry = subRegistry;
    }
  }
  if (!registry) {
    return null;
  }

  let key = filenames.slice(subRegistry ? 4 : 3).join('/');
  if (!key.endsWith('.json')) {
    return null;
  }
  key = key.substr(0, key.length - '.json'.length);
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

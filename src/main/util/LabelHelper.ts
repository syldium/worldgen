import { Option } from '../component/ui/Select';

/**
 * Create a name from a key.
 *
 * @param namespacedKey The key
 */
export function labelize(namespacedKey: string): string {
  const key = stripDefaultNamespace(namespacedKey);

  let uppercase = true;
  let builder = '';
  for (let i = 0; i < key.length; i++) {
    let char = key[i];
    if (char === '_') {
      builder += ' ';
    } else if (char === ':') {
      builder += ': ';
      uppercase = true;
    } else {
      if (uppercase) {
        char = char.toUpperCase();
        uppercase = false;
      }
      builder += char;
    }
  }
  return builder;
}

export function labelizeOption(namespacedKey: string): Option {
  return {
    label: labelize(namespacedKey),
    value: defaultNamespace(namespacedKey)
  };
}

/**
 * Remove the namespace part if it is the default.
 *
 * @param namespacedKey The key
 * @param namespace The default namespace
 */
export function stripDefaultNamespace(
  namespacedKey: string,
  namespace = 'minecraft'
): string {
  if (namespacedKey.startsWith(`${namespace}:`)) {
    return namespacedKey.substr(namespace.length + 1);
  }
  return namespacedKey;
}

export function defaultNamespace(
  namespacedKey: string,
  namespace = 'minecraft'
): string {
  if (namespacedKey.includes(':')) {
    return namespacedKey;
  }
  return namespace + ':' + namespacedKey;
}

export function isValidNamespacedKey(key: string): boolean {
  const sepIndex = key.indexOf(':');
  if (sepIndex <= 0) {
    return isValidValue(key);
  }
  return (
    isValidNamespace(key.substr(0, sepIndex)) &&
    isValidValue(key.substr(sepIndex + 1))
  );
}

export function isValidNamespace(namespace: string): boolean {
  return /^[a-z0-9_\-.]+$/.test(namespace);
}
export function isValidValue(value: string): boolean {
  return /^[a-z0-9_\-./]+$/.test(value);
}
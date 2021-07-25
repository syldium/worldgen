import { Option } from '../component/ui/Select';
import { isNumericChar } from "./MathHelper";

/**
 * Create a name from a key.
 *
 * @param namespacedKey The key
 */
export function labelize(namespacedKey: string): string {
  const key = stripDefaultNamespace(namespacedKey);

  let uppercase = true; // If the next character should be capitalized
  let separator = false; // If the last character requires the next one to have a separator before it
  let group = false; // If a group of characters has been started
  let builder = '';
  for (let i = 0; i < key.length; i++) {
    let char = key[i];
    if (char === '_') {
      separator = true;
    } else if (char === ':' || char === '/') {
      builder += char;
      separator = true;
      group = char === '/';
      uppercase = true;
    } else if (isNumericChar(key, i)) {
      if (!group) {
        // Start a new group of numbers by adding a space before
        builder += ' ';
        group = true;
      }
      builder += char;
      separator = false;
      uppercase = false;
    } else {
      if (uppercase) {
        char = char.toUpperCase();
        uppercase = false;
      } else if (char === char.toUpperCase()) {
        // May be a camelcase string
        const lowercase = char.toLowerCase();
        if (lowercase !== char) {
          // Definitely a camelcase string, a special character would be the same regardless of case
          char = lowercase;
          separator = true;
        }
      }
      if (separator !== group) {
        builder += ' ';
        separator = false;
        group = false;
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

export function isStringArray(
  array: readonly unknown[] = []
): array is readonly string[] {
  return array.every((el) => typeof el === 'string');
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

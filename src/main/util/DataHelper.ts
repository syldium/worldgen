export function omit<T, K extends keyof T>(
  obj: T,
  ...keys: readonly K[]
): Omit<T, K> {
  const cpy = { ...obj };
  keys.forEach((key) => delete cpy[key]);
  return cpy;
}

import { isValidNamespacedKey, labelize } from '../../../main/util/LabelHelper';

describe('label helper', () => {
  it('should capitalize the first letter', () => {
    expect(labelize('worldgen')).toBe('Worldgen');
  });

  it('should strip the default namespace', () => {
    expect(labelize('minecraft:cobblestone')).toBe('Cobblestone');
  });

  it('should be capitalized and have mod: before', () => {
    expect(labelize('mod:worldgen')).toBe('Mod: Worldgen');
  });

  it('should replace underscores with spaces', () => {
    expect(labelize('a_very_long_name')).toBe('A very long name');
  });

  it('should handle camelcase', () => {
    expect(labelize('worldgenTool')).toBe('Worldgen tool');
  });

  it('should be valid namespaced keys', () => {
    expect(isValidNamespacedKey('namespace:key')).toBeTruthy();
    expect(isValidNamespacedKey('block')).toBeTruthy();
    expect(isValidNamespacedKey('blocks/end')).toBeTruthy();
    expect(isValidNamespacedKey('.cube-19_')).toBeTruthy();
  });

  it('should be invalid namespaced keys', () => {
    expect(isValidNamespacedKey('Namespace:keY')).toBeFalsy();
    expect(isValidNamespacedKey(':block')).toBeFalsy();
    expect(isValidNamespacedKey('dom/sub:clock')).toBeFalsy();
    expect(isValidNamespacedKey('dom:ère')).toBeFalsy();
  });
});

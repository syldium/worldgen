import { findNamespacedKeyAndRegistry } from '../../main/context/ZipAction';

describe('ZipAction', function () {
  it('should find the namespaced key and the registry', () => {
    expect(
      findNamespacedKeyAndRegistry('data/minecraft/dimension/use_tp.json')
    ).toEqual(['minecraft', 'use_tp', 'dimension']);
    expect(
      findNamespacedKeyAndRegistry(
        'data/me/worldgen/configured_feature/my_tree.json'
      )
    ).toEqual(['me', 'my_tree', 'worldgen/configured_feature']);
    expect(
      findNamespacedKeyAndRegistry('data/myself/worldgen/biome/desert/ic.json')
    ).toEqual(['myself', 'desert/ic', 'worldgen/biome']);
  });

  it('should ignore non worldgen files', () => {
    expect(findNamespacedKeyAndRegistry('pack.mcmeta')).toEqual(null);
    expect(
      findNamespacedKeyAndRegistry('data/me/functions/tick.mcfunction')
    ).toEqual(null);
    expect(
      findNamespacedKeyAndRegistry('me/worldgen/biome/forest.json')
    ).toEqual(null);
    expect(
      findNamespacedKeyAndRegistry('data/myself/dimension/wrong.extension')
    ).toEqual(null);
  });
});

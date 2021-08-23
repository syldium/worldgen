import { useContext, useEffect, useMemo, useRef } from 'react';
import type {
  PostLoadCallback,
  Schema,
  WorldgenRegistry
} from '../model/Registry';
import { GameContext } from '../context/GameRegistry';
import { useParams } from 'react-router-dom';
import { get } from 'idb-keyval';
import { resourcePath } from '../util/PathHelper';
import type { WorldgenRegistryKey } from '../model/RegistryKey';

export function useRegistry<S extends Schema>(
  registryKey: WorldgenRegistryKey
): [
  WorldgenRegistry,
  string | undefined,
  S,
  (callback: PostLoadCallback<S>) => void
] {
  const { id } = useParams<{ id: 'resource' }>();

  const { worldgen } = useContext(GameContext);
  const registry = worldgen.worldgen[registryKey];
  const entry = registry.entries[id];

  const initial = useMemo(
    () => entry || registry.model.preset('1.17'),
    [entry, registry.model]
  );

  const postLoad = useRef<PostLoadCallback<S>>();
  const customLoaded = useRef<boolean>(false);
  useEffect(() => {
    if (!entry && id) {
      const callback: PostLoadCallback = (resource: Schema) =>
        postLoad.current && postLoad.current(resource as S);
      if (id.startsWith('minecraft:')) {
        worldgen
          .vanillaResource(registryKey, id)
          .then((schema) => !customLoaded.current && callback(schema));
      }
      get(resourcePath(registryKey, id)).then((schema) => {
        if (schema) {
          callback(schema);
          customLoaded.current = true;
        }
      });
    }
  }, [entry, id, registry, registryKey, worldgen]);

  return [
    registry,
    id,
    initial as S,
    (callback: PostLoadCallback<S>) => (postLoad.current = callback)
  ];
}

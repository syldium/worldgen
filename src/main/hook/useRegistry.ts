import { get } from 'idb-keyval';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { GameContext } from '../context/GameRegistry';
import type {
  PostLoadCallback,
  Schema,
  WorldgenRegistry
} from '../model/Registry';
import type { WorldgenRegistryKey } from '../model/RegistryKey';
import { resourcePath } from '../util/PathHelper';

export function useRegistry<S extends Schema>(
  registryKey: WorldgenRegistryKey
): [
  WorldgenRegistry,
  string | undefined,
  S,
  (callback: PostLoadCallback<S>) => void
] {
  let { id } = useParams<{ id: string }>();
  const path = useLocation().pathname;
  const index = path.indexOf(registryKey) + registryKey.length + 1;
  if (index < path.length) {
    id = path.substr(index);
  }

  const { worldgen } = useContext(GameContext);
  const registry = worldgen.worldgen[registryKey];
  const entry = registry.entries[id];

  const initial = useMemo(
    () => entry || registry.model.preset(worldgen.gameVersion),
    [entry, registry.model, worldgen.gameVersion]
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

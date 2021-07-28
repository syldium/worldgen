import { useContext, useMemo } from 'react';
import type {
  Schema,
  WorldgenRegistry,
  WorldgenRegistryKey
} from '../model/Registry';
import { GameContext } from '../context/GameRegistry';
import { useParams } from 'react-router-dom';

export function useRegistry<S extends Schema>(
  registryKey: WorldgenRegistryKey
): [WorldgenRegistry, string | undefined, S] {
  const { id } = useParams<{ id: 'resource' }>();

  const { worldgen } = useContext(GameContext);
  const registry = worldgen.worldgen[registryKey];
  const entry = registry.entries[id];

  const initial = useMemo(
    () => entry || registry.model.preset('1.17'),
    [entry, registry.model]
  );

  return [registry, id, initial as S];
}

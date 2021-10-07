import type { Schema } from '../model/Registry';
import { FormEvent, useContext } from 'react';
import { GameContext } from '../context/GameRegistry';
import { useHistory } from 'react-router-dom';
import { defaultNamespace } from '../util/LabelHelper';
import { del, set } from 'idb-keyval';
import { resourcePath } from '../util/PathHelper';
import {
  renameDependency,
  updateDependencyGraph
} from '../model/graph/DependencyGraph';
import type { WorldgenRegistryKey } from '../model/RegistryKey';

type ValueSupplier = Schema | (() => Schema);
type SubmitHandler = (event: FormEvent<HTMLFormElement>) => void;

export function useResourceSubmit(
  registryKey: WorldgenRegistryKey,
  previousKey: string | undefined,
  supplySchema: ValueSupplier
): SubmitHandler {
  const { namespace, worldgen } = useContext(GameContext);
  const registry = worldgen.worldgen[registryKey];
  const history = useHistory();

  return function (event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inputValue = (
      document.querySelector('[name=key]') as HTMLInputElement
    ).value;
    const key = defaultNamespace(inputValue, namespace);
    const value =
      typeof supplySchema === 'function' ? supplySchema() : supplySchema;
    const previous = registry.register(key, value);
    updateDependencyGraph(
      worldgen,
      registryKey,
      previousKey || key,
      previous,
      value
    );
    set(resourcePath(registryKey, key), value);
    if (previousKey && key !== previousKey) {
      registry.remove(previousKey);
      renameDependency(worldgen, registryKey, previousKey, key);
      del(resourcePath(registryKey, previousKey));
    }
    history.push('/');
  };
}

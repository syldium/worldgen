import type { Schema } from '../model/Registry';
import { FormEvent, useContext } from 'react';
import { GameContext } from '../context/GameRegistry';
import { navigate } from '../util/UriHelper';
import { defaultNamespace } from '../util/LabelHelper';
import { del, set } from 'idb-keyval';
import { resourcePath } from '../util/PathHelper';
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

  return function (event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inputValue = (
      document.querySelector('[name=key]') as HTMLInputElement
    ).value;
    const key = defaultNamespace(inputValue, namespace);
    const value =
      typeof supplySchema === 'function' ? supplySchema() : supplySchema;
    set(resourcePath(registryKey, key), value);
    if (registry.register(key, value) && previousKey && key !== previousKey) {
      registry.remove(previousKey);
      del(resourcePath(registryKey, previousKey));
    }
    navigate('/');
  };
}

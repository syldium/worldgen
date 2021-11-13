import { del, set } from 'idb-keyval';
import { FormEvent, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GameContext } from '../context/GameRegistry';
import type { Schema } from '../model/Registry';
import type { WorldgenRegistryKey } from '../model/RegistryKey';
import { defaultNamespace } from '../util/LabelHelper';
import { resourcePath } from '../util/PathHelper';

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
    const value = typeof supplySchema === 'function' ?
      supplySchema() :
      supplySchema;
    set(resourcePath(registryKey, key), value);
    if (registry.register(key, value) && previousKey && key !== previousKey) {
      registry.remove(previousKey);
      del(resourcePath(registryKey, previousKey));
    }
    history.push('/');
  };
}

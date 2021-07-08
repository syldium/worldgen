import { Option } from '../component/ui/Select';
import { Registry, RegistryKey } from '../model/Registry';
import { useContext, useMemo } from 'react';
import { GameContext } from '../context/GameRegistry';
import { labelizeOption } from '../util/LabelHelper';

export function useOptions(key: RegistryKey, onlyDefault = false): Option[] {
  const context = useContext(GameContext);
  const registry = context.registries[key];
  return registry ? registry.options : [];
}

export function useOptionsArray(
  values: readonly string[],
  filter?: (value: string) => boolean
): Option[] {
  return useMemo(
    function () {
      const filtered = filter ? values.filter(filter) : values;
      return filtered.map(labelizeOption);
    },
    [values, filter]
  );
}

export function useOptionsRegistry(values: readonly string[]): Registry {
  return useMemo(() => ({ options: values.map(labelizeOption) }), [values]);
}

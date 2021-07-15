import { Option } from '../component/ui/Select';
import { Registry, RegistryKey } from '../model/Registry';
import { useContext, useMemo } from 'react';
import { GameContext } from '../context/GameRegistry';
import { defaultNamespace, labelizeOption } from '../util/LabelHelper';

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

export function useOptionsRegistry(
  values: readonly string[],
  labelize = true
): Registry {
  return useMemo(
    () => ({
      options: values.map((value) =>
        labelize
          ? labelizeOption(value)
          : { label: value, value: defaultNamespace(value) }
      )
    }),
    [labelize, values]
  );
}

import type { Option } from '../component/ui/Select';
import type { Registry, RegistryKey } from '../model/Registry';
import { useContext, useMemo } from 'react';
import { GameContext } from '../context/GameRegistry';
import { defaultNamespace, labelizeOption } from '../util/LabelHelper';

export function useOptions(key: RegistryKey, onlyDefault = false): Option[] {
  const context = useContext(GameContext);
  const registry = context.registries[key];
  return onlyDefault ? registry.vanilla : registry.options;
}

export function useOptionsArray(
  values: readonly string[],
  labelize = true,
  filter?: (value: string) => boolean
): Option[] {
  return useMemo(
    function () {
      const filtered = filter ? values.filter(filter) : values;
      return filtered.map((value) => {
        if (labelize) {
          return labelizeOption(value);
        }
        return { label: value, value };
      });
    },
    [filter, values, labelize]
  );
}

export function useOptionsRegistry(
  values: readonly string[],
  labelize = true
): Registry {
  return useMemo(() => {
    const options = values.map((value) =>
      labelize
        ? labelizeOption(value)
        : { label: value, value: defaultNamespace(value) }
    );
    return {
      options,
      vanilla: options
    } as Registry;
  }, [labelize, values]);
}

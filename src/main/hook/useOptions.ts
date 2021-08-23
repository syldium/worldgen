import { useContext, useMemo } from 'react';
import { GameContext } from '../context/GameRegistry';
import { labelizeOption } from '../util/LabelHelper';
import type { Option } from '../component/ui/Select';
import type { RegistryKey } from '../model/RegistryKey';

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

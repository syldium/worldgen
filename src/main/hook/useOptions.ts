import { useContext, useMemo } from 'react';
import type { Option } from '../component/ui/Select';
import { GameContext } from '../context/GameRegistry';
import type { RegistryKey } from '../model/RegistryKey';
import { labelizeOption } from '../util/LabelHelper';

export function useOptions(
  key: RegistryKey,
  isTag = false,
  onlyDefault = false
): Option[] {
  const registries = useContext(GameContext).registries!;
  const registry = (isTag ? registries.tags : registries.game)[key];
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

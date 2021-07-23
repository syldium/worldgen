import { Option } from '../component/ui/Select';
import { Registry, RegistryKey } from '../model/Registry';
import { useContext, useMemo } from 'react';
import { GameContext } from '../context/GameRegistry';
import { defaultNamespace, labelizeOption } from '../util/LabelHelper';

export function useOptions(key: RegistryKey, onlyDefault = false): Option[] {
  const context = useContext(GameContext);
  const registry = context.registries[key];
  const options = registry ? registry.options : [];
  return onlyDefault
    ? options.filter((o) => !registry.options.includes(o))
    : options;
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
  custom?: readonly Option[],
  labelize = true
): Registry {
  return useMemo(() => {
    const options = values.map((value) =>
      labelize
        ? labelizeOption(value)
        : { label: value, value: defaultNamespace(value) }
    );
    return {
      options: custom ? custom.concat(options) : options
    };
  }, [custom, labelize, values]);
}

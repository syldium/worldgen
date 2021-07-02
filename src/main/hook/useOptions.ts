import { Option } from '../component/ui/Select';
import { RegistryKey } from '../model/Registry';
import { useContext } from 'react';
import { GameContext } from '../context/GameRegistry';

export function useOptions(key: RegistryKey, onlyDefault = false): Option[] {
  const context = useContext(GameContext);
  const registry = context.registries[key];
  return registry ? registry.options : [];
}

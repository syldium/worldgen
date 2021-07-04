import React, { useContext } from 'react';
import { GameContext } from '../context/GameRegistry';
import { RegistryEntries } from '../model/Registry';

export function MainMenu(): JSX.Element {
  const { worldgen } = useContext(GameContext).worldgen;
  const registryEntries: Record<string, RegistryEntries> = {};
  for (const [registryKey, { entries }] of Object.entries(worldgen)) {
    registryEntries[registryKey] = entries;
  }

  return (
    <code>
      <pre>{JSON.stringify(registryEntries, null, 2)}</pre>
    </code>
  );
}

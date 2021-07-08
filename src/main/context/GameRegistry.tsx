import React, { ReactNode, useMemo } from 'react';
import {
  BlockStateRegistry,
  Registry,
  WorldgenRegistryHolder,
  RegistryKey
} from '../model/Registry';
import { createContext, useState } from 'react';
import { labelizeOption } from '../util/LabelHelper';
import { readText, useFetchData } from '../hook/useFetchData';
import { Structures } from '../data/1.17/Structure';
import { useOptionsRegistry } from '../hook/useOptions';

interface GameRegistry {
  blockStates: BlockStateRegistry;
  registries: Record<RegistryKey, Registry>;
  worldgen: WorldgenRegistryHolder;
  namespace: string;
}

export const GameContext = createContext<GameRegistry>({} as GameRegistry);

interface ProviderProps {
  children?: ReactNode;
  entities?: string[];
  sounds?: string[];
  states?: BlockStateRegistry;
}
export function GameRegistryProvider({
  children,
  entities,
  sounds,
  states
}: ProviderProps): JSX.Element {
  const github = 'https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/';
  //const github = '/';
  const blockStates = useFetchData<BlockStateRegistry>(
    `${github}reports/blocks/simplified/data.min.json`,
    {},
    states
  );
  const entityTypes = useFetchData<string[]>(
    `${github}reports/registries/entity_type/data.values.txt`,
    [],
    entities,
    readText
  );
  const soundEvents = useFetchData<string[]>(
    `${github}reports/registries/sound_event/data.values.txt`,
    [],
    sounds,
    readText
  );
  const blockTags = useFetchData<string[]>(
    `${github}data/minecraft/tags/blocks/data.values.txt`,
    [],
    sounds,
    readText
  );
  const [worldgen] = useState<WorldgenRegistryHolder>(
    () => new WorldgenRegistryHolder()
  );
  const [namespace] = useState<string>(Math.random().toString());

  const blockTypes: Registry = useMemo(
    () => ({ options: Object.keys(blockStates).map(labelizeOption) }),
    [blockStates]
  );

  return (
    <GameContext.Provider
      value={{
        blockStates,
        registries: {
          ...worldgen.worldgen,
          block: blockTypes,
          block_placer: { options: [] },
          block_state: blockTypes,
          block_state_provider: { options: [] },
          entity_type: useOptionsRegistry(entityTypes),
          sound_event: useOptionsRegistry(soundEvents),
          structure: { options: Structures },
          'tag/blocks': useOptionsRegistry(blockTags)
        },
        worldgen,
        namespace
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

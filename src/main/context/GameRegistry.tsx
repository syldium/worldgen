import React, { ReactNode, useMemo } from 'react';
import {
  BlockStateRegistry,
  Registry,
  WorldgenRegistryHolder,
  RegistryKey
} from '../model/Registry';
import { createContext, useState } from 'react';
import { labelizeOption } from '../util/LabelHelper';
import { BlockTags } from '../data/1.17/BlockTag';
import { useFetchData } from '../hook/useFetchData';
import { EntityTypes } from '../data/1.17/EntityType';
import { SoundEvents } from '../data/1.17/SoundEvent';
import { Structures } from '../data/1.17/Structure';

interface GameRegistry {
  blockStates: BlockStateRegistry;
  registries: Record<RegistryKey, Registry>;
  worldgen: WorldgenRegistryHolder;
  namespace: string;
}

export const GameContext = createContext<GameRegistry>({} as GameRegistry);

interface ProviderProps {
  children?: ReactNode;
  states?: BlockStateRegistry;
}
export function GameRegistryProvider({
  children,
  states
}: ProviderProps): JSX.Element {
  const url =
    'https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/reports/blocks/simplified/data.min.json';
  //const url = '/blocks/data.json';
  const blockStates = useFetchData<BlockStateRegistry>(url, {}, states);
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
          block_state: blockTypes,
          entity_type: { options: EntityTypes },
          sound_event: { options: SoundEvents },
          structure: { options: Structures },
          'tag/blocks': { options: BlockTags }
        },
        worldgen,
        namespace
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

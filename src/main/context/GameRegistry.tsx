import React, { ReactNode, useEffect } from 'react';
import { BlockStateRegistry } from '../model/Registry';
import { createContext, useState } from 'react';
import { loadBlockStates } from '../data/RegistryFetch';

interface GameRegistry {
  blockStates: BlockStateRegistry;
}

export const GameContext = createContext<GameRegistry>({
  blockStates: {}
});

interface ProviderProps {
  children?: ReactNode;
}
export function GameRegistryProvider({ children }: ProviderProps): JSX.Element {
  const [blockStates, setBlockStates] = useState<BlockStateRegistry>({});

  useEffect(function () {
    loadBlockStates(setBlockStates);
  }, []);

  return (
    <GameContext.Provider
      value={{
        blockStates: blockStates
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

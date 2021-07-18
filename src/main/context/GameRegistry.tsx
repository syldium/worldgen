import React, { ReactNode, useMemo } from 'react';
import {
  BlockStateRegistry,
  Registry,
  WorldgenRegistryHolder,
  RegistryKey
} from '../model/Registry';
import { createContext, useState } from 'react';
import { labelizeOption } from '../util/LabelHelper';
import {
  readJson,
  readText,
  useFetchData,
  useFetchRegistry
} from '../hook/useFetchData';

interface GameRegistry {
  blockStates: BlockStateRegistry;
  registries: Record<RegistryKey, Registry>;
  worldgen: WorldgenRegistryHolder;
  namespace: string;
}

export const GameContext = createContext<GameRegistry>({} as GameRegistry);

//const github = '/';
const github =
  'https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/';
const registryUrl = (registry: string) =>
  `${github}reports/registries/${registry}/data.values.txt`;

interface ProviderProps {
  children?: ReactNode;
  states?: BlockStateRegistry;
}
export function GameRegistryProvider({
  children,
  states
}: ProviderProps): JSX.Element {
  const blockStates = useFetchData<BlockStateRegistry>(
    `${github}reports/blocks/simplified/data.min.json`,
    {},
    states
  );
  const carvers = useFetchRegistry(
    '/values/1.17/configured_carvers.json',
    readJson
  );
  const entityTypes = useFetchRegistry(registryUrl('entity_type'), readText);
  const features = useFetchRegistry(
    '/values/1.17/configured_features.json',
    readJson
  );
  const soundEvents = useFetchRegistry(registryUrl('sound_event'), readText);
  const structuresFeatures = useFetchRegistry(
    registryUrl('structure_feature'),
    readText
  );
  const structures = useFetchRegistry(
    '/values/1.17/structures.json',
    readJson,
    false
  );
  const surfaceBuilders = useFetchRegistry(
    '/values/1.17/configured_surface_builders.json',
    readJson
  );
  const blockTags = useFetchRegistry(
    `${github}data/minecraft/tags/blocks/data.values.txt`,
    readText
  );
  const [worldgen] = useState<WorldgenRegistryHolder>(
    () => new WorldgenRegistryHolder('1.17')
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
          block_state_provider: { options: [] },
          entity_type: entityTypes,
          sound_event: soundEvents,
          structure: structures,
          'tag/blocks': blockTags,
          'worldgen/configured_carver': carvers,
          'worldgen/configured_feature': features,
          'worldgen/configured_structure_feature': structuresFeatures,
          'worldgen/configured_surface_builder': surfaceBuilders
        },
        worldgen,
        namespace
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

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
  useFetchRegistry,
  useWorldgenFetchRegistry
} from '../hook/useFetchData';
import useLocalStorageState from 'use-local-storage-state';

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
  const [holder, setHolder] = useState<WorldgenRegistryHolder>(
    () => new WorldgenRegistryHolder('1.17')
  );
  const blockStates = useFetchData<BlockStateRegistry>(
    `${github}reports/blocks/simplified/data.min.json`,
    {},
    states
  );
  useWorldgenFetchRegistry(
    '/values/1.17/configured_carvers.json',
    'worldgen/configured_carver',
    holder,
    readJson
  );
  const entityTypes = useFetchRegistry(registryUrl('entity_type'), readText);
  useWorldgenFetchRegistry(
    '/values/1.17/configured_features.json',
    'worldgen/configured_feature',
    holder,
    readJson
  );
  const soundEvents = useFetchRegistry(registryUrl('sound_event'), readText);
  useWorldgenFetchRegistry(
    registryUrl('structure_feature'),
    'worldgen/configured_structure_feature',
    holder,
    readText
  );
  const structures = useFetchRegistry(
    '/values/1.17/structures.json',
    readJson,
    false
  );
  useWorldgenFetchRegistry(
    '/values/1.17/configured_surface_builders.json',
    'worldgen/configured_surface_builder',
    holder,
    readJson
  );
  const blockTags = useFetchRegistry(
    `${github}data/minecraft/tags/blocks/data.values.txt`,
    readText
  );
  const [defNamespace, setDefNamespace] = useLocalStorageState<string>('demo');

  const blockTypes: Registry = useMemo(() => {
    const options = Object.keys(blockStates).map(labelizeOption);
    return { options, vanilla: options };
  }, [blockStates]);

  return (
    <GameContext.Provider
      value={{
        blockStates,
        registries: {
          ...holder.worldgen,
          block: blockTypes,
          block_state: blockTypes,
          block_state_provider: { options: [], vanilla: [] },
          entity_type: entityTypes,
          sound_event: soundEvents,
          structure: structures,
          'tags/blocks': blockTags
        },
        get worldgen(): WorldgenRegistryHolder {
          return holder;
        },
        set worldgen(holder: WorldgenRegistryHolder) {
          setHolder(holder);
        },
        get namespace(): string {
          return defNamespace || 'unset';
        },
        set namespace(namespace: string) {
          setDefNamespace(namespace);
        }
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

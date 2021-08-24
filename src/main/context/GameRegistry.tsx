import React, { ReactNode, useEffect, useMemo } from 'react';
import {
  BlockStateRegistry,
  Registry,
  WorldgenRegistryHolder,
  Schema
} from '../model/Registry';
import { createContext, useState } from 'react';
import { labelizeOption } from '../util/LabelHelper';
import {
  readJson,
  readText,
  RegistryData,
  useFetchData,
  useRegistryFetch
} from '../hook/useFetchData';
import useLocalStorageState from 'use-local-storage-state';
import { clear, entries, setMany } from 'idb-keyval';
import { findNamespacedKeyAndRegistry, resourcePath } from '../util/PathHelper';
import type { RegistryKey } from '../model/RegistryKey';

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
const valuesUrl = (registry: string) => `/values/1.17/${registry}.json`;

interface ProviderProps {
  children?: ReactNode;
  states?: BlockStateRegistry;
}

const res = (
  url: string,
  reader: (response: Response) => Promise<string[]>,
  label = true
): RegistryData => ({ url, reader, label });
const json = (url: string, label?: boolean): RegistryData =>
  res(url, readJson, label);
const text = (url: string, label?: boolean): RegistryData =>
  res(url, readText, label);

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
  const registries = useRegistryFetch(
    {
      entity_type: text(registryUrl('entity_type')),
      sound_event: text(registryUrl('sound_event')),
      structure: json('/values/1.17/structures.json', false),
      'tags/blocks': text(
        `${github}data/minecraft/tags/blocks/data.values.txt`
      ),
      'worldgen/configured_carver': json(valuesUrl('configured_carvers')),
      'worldgen/configured_feature': json(valuesUrl('configured_features')),
      'worldgen/configured_structure_feature': text(
        registryUrl('worldgen/structure_feature')
      ),
      'worldgen/configured_surface_builder': json(
        valuesUrl('configured_surface_builders')
      ),
      'worldgen/processor_list': json(valuesUrl('processor_list'))
    },
    holder
  );
  const [defNamespace, setDefNamespace] = useLocalStorageState<string>('demo');

  const blockTypes: Registry = useMemo(() => {
    const options = Object.keys(blockStates).map(labelizeOption);
    return { options, vanilla: options };
  }, [blockStates]);

  useEffect(() => {
    if (!window.indexedDB) {
      return;
    }
    entries<string, Schema>().then((entries) => {
      console.time('indexeddb');
      entries.forEach(([path, schema]) => {
        const match = findNamespacedKeyAndRegistry(path);
        if (match) {
          holder.register(match[2], match[0] + ':' + match[1], schema);
        }
      });
      console.timeEnd('indexeddb');
    });
  }, [holder]);

  return (
    <GameContext.Provider
      value={{
        blockStates,
        registries: {
          ...registries,
          ...holder.worldgen,
          block: blockTypes,
          block_state: blockTypes,
          block_state_provider: { options: [], vanilla: [] }
        },
        get worldgen(): WorldgenRegistryHolder {
          return holder;
        },
        set worldgen(holder: WorldgenRegistryHolder) {
          clear().then(() => {
            setHolder((current) => holder.withVanilla(current));
            const entries: [string, Schema][] = [];
            for (const [registryKey, registry] of holder.entries) {
              entries.push(
                // @ts-ignore
                ...Object.entries(registry.entries).map(([key, schema]) => [
                  resourcePath(registryKey, key),
                  schema
                ])
              );
            }
            setMany(entries);
          });
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

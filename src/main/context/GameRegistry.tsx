import { clear, entries, setMany } from 'idb-keyval';
import { ReactNode, useEffect, useMemo } from 'react';
import { createContext, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import {
  readJson,
  readText,
  RegistryData,
  useFetchData,
  useRegistryFetch
} from '../hook/useFetchData';
import { useForceUpdate } from '../hook/useForceUpdate';
import {
  BlockStateRegistry,
  Registry,
  Schema,
  WorldgenRegistryHolder
} from '../model/Registry';
import type { RegistryKey, WorldgenRegistryKey } from '../model/RegistryKey';
import { dataUrl } from '../util/FetchHelper';
import { labelizeOption } from '../util/LabelHelper';
import { findNamespacedKeyAndRegistry, resourcePath } from '../util/PathHelper';
import { GameVersion } from './GameVersion';

interface GameRegistry {
  blockStates: BlockStateRegistry;
  registries: Record<RegistryKey, Registry>;
  worldgen?: WorldgenRegistryHolder;
  namespace: string;
  version: GameVersion;
}

export const GameContext = createContext<GameRegistry>({} as GameRegistry);

const valuesUrl = (version: GameVersion, registry: string) =>
  `/values/${version}/${registry}.json`;

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
const defaultVersion: GameVersion = '1.17';

export function GameRegistryProvider({
  children,
  states
}: ProviderProps): JSX.Element {
  const forceUpdate = useForceUpdate();
  const [version, setVersion] = useLocalStorageState<GameVersion>(
    'game-version',
    { defaultValue: defaultVersion }
  );
  const github = dataUrl(version);
  const registryUrl = (registry: string) =>
    `${github}reports/registries/${registry}/data.values.txt`;
  const [holder, setHolder] = useState<WorldgenRegistryHolder | undefined>(
    version === defaultVersion ? () => WorldgenRegistryHolder.def() : undefined
  );
  useEffect(() => {
    if (version !== defaultVersion) {
      WorldgenRegistryHolder.create(version).then(setHolder);
    }
  }, [version]);
  const blockStates = useFetchData<BlockStateRegistry>(
    `${github}reports/blocks/simplified/data.min.json`,
    {},
    states
  );
  const emptyRegistry: Registry = { options: [], vanilla: [] };
  const [registries, fetched] = useRegistryFetch(
    {
      entity_type: text(registryUrl('entity_type')),
      particle_type: text(registryUrl('particle_type')),
      sound_event: text(registryUrl('sound_event'), false),
      structure: json('/values/1.17/structures.json', false),
      'tags/blocks': text(
        `${github}data/minecraft/tags/blocks/data.values.txt`
      ),
      'worldgen/biome': json(valuesUrl(version, 'biomes')),
      'worldgen/configured_carver': json(
        valuesUrl(version, 'configured_carvers')
      ),
      'worldgen/configured_feature': json(
        valuesUrl(version, 'configured_features')
      ),
      'worldgen/placed_feature': json(valuesUrl('1.18', 'placed_features')),
      'worldgen/configured_structure_feature': text(
        registryUrl('worldgen/structure_feature')
      ),
      'worldgen/configured_surface_builder': json(
        valuesUrl('1.17', 'configured_surface_builders')
      ),
      'worldgen/processor_list': json(valuesUrl('1.17', 'processor_list'))
    },
    version,
    holder
  );
  const [defNamespace, setDefNamespace] = useLocalStorageState<string>('demo');

  const blockTypes: Registry = useMemo(() => {
    const options = Object.keys(blockStates).map(labelizeOption);
    return { options, vanilla: options };
  }, [blockStates]);
  const worldgen = holder ? holder.worldgen : {};

  useEffect(() => {
    if (!window.indexedDB || !holder) {
      return;
    }
    entries<string, Schema>().then((entries) => {
      console.time('indexeddb');
      const edited = new Set<WorldgenRegistryKey>();
      entries.forEach(([path, schema]) => {
        const match = findNamespacedKeyAndRegistry(path);
        if (match) {
          edited.add(match[2]);
          holder.register(match[2], match[0] + ':' + match[1], schema);
        }
      });
      console.timeEnd('indexeddb');
      holder.copyOptions(edited);
      if (edited.size && fetched.current) {
        forceUpdate();
      }
    });
  }, [fetched, forceUpdate, holder]);

  return (
    <GameContext.Provider
      value={{
        blockStates,
        // @ts-ignore
        registries: {
          ...registries,
          ...worldgen,
          biome_particle: emptyRegistry,
          block: blockTypes,
          block_state: blockTypes,
          block_state_provider: emptyRegistry
        },
        get worldgen(): WorldgenRegistryHolder {
          return holder!;
        },
        set worldgen(holder: WorldgenRegistryHolder) {
          clear()
            .then(() => {
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
              setMany(entries).then(() =>
                setHolder((current) => holder.withVanilla(current!))
              );
            })
            .catch((e) => {
              setHolder((current) => holder.withVanilla(current!));
              console.error(e);
            });
        },
        get namespace(): string {
          return defNamespace || 'unset';
        },
        set namespace(namespace: string) {
          setDefNamespace(namespace);
        },
        get version(): GameVersion {
          return version;
        },
        set version(version: GameVersion) {
          WorldgenRegistryHolder.create(version).then((h) => {
            setHolder((current) => {
              current && h.merge(current);
              return h;
            });
            setVersion(version);
          });
        }
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

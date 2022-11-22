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
  RegistryHolder,
  Schema
} from '../model/Registry';
import type { WorldgenRegistryKey } from '../model/RegistryKey';
import { dataUrl } from '../util/FetchHelper';
import { labelizeOption } from '../util/LabelHelper';
import { findNamespacedKeyAndRegistry, resourcePath } from '../util/PathHelper';
import { GameVersion } from './GameVersion';

interface GameRegistry {
  blockStates: BlockStateRegistry;
  registries?: RegistryHolder;
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
const baseVersion = (version: GameVersion) =>
  version === '1.18.2' ? '1.18' : version;
const baseTagVersion = (version: GameVersion) =>
  version === '1.18.2' ? '1.18.2' : '1.19';
const defaultVersion: GameVersion = '1.19';

export function GameRegistryProvider({
  children,
  states
}: ProviderProps): JSX.Element {
  const forceUpdate = useForceUpdate();
  /* eslint-disable react-hooks/rules-of-hooks */
  const [version, setVersion] = import.meta.env.SSR ?
    useState(defaultVersion) :
    useLocalStorageState<GameVersion>(
      'game-version',
      { defaultValue: defaultVersion }
    );
  /* eslint-enable react-hooks/rules-of-hooks */
  const github = dataUrl(version);
  const registryUrl = (registry: string) =>
    `${github}reports/registries/${registry}/data.values.txt`;
  const [holder, setHolder] = useState<RegistryHolder | undefined>(
    version === defaultVersion ? () => RegistryHolder.def() : undefined
  );
  useEffect(() => {
    if (version !== defaultVersion) {
      RegistryHolder.create(version).then(setHolder);
    }
  }, [version]);
  const blockStates = useFetchData<BlockStateRegistry>(
    `${github}reports/blocks/simplified/data.min.json`,
    {},
    states
  );
  const [vanilla, fetched] = useRegistryFetch(
    {
      entity_type: text(registryUrl('entity_type')),
      particle_type: text(registryUrl('particle_type')),
      sound_event: text(registryUrl('sound_event'), false),
      structures: json('/values/1.17/structures.json', false),
      'worldgen/biome': json(valuesUrl(baseVersion(version), 'biomes')),
      'worldgen/configured_carver': json(
        valuesUrl(baseVersion(version), 'configured_carvers')
      ),
      'worldgen/configured_feature': json(
        valuesUrl(baseVersion(version), 'configured_features')
      ),
      'worldgen/placed_feature': json(
        valuesUrl(version === '1.19' ? '1.19' : '1.18', 'placed_features')
      ),
      'worldgen/configured_structure_feature': text(
        `${github}reports/worldgen/minecraft/worldgen/configured_structure_feature/data.values.txt`
      ),
      'worldgen/configured_surface_builder': json(
        valuesUrl('1.17', 'configured_surface_builders')
      ),
      'worldgen/density_function': json(
        valuesUrl(baseTagVersion(version), 'density_functions'),
        false
      ),
      'worldgen/processor_list': json(valuesUrl('1.17', 'processor_list')),
      'worldgen/structure': json(valuesUrl('1.19', 'structures')),
      'worldgen/structure_set': json(
        valuesUrl('1.18.2', 'structure_sets'),
        false
      ),
      'worldgen/template_pool': json(
        valuesUrl(version === '1.19' ? '1.19' : '1.18', 'template_pools'),
        false
      )
    },
    {
      block: text(
        `${github}data/minecraft/tags/blocks/data.values.txt`
      ),
      fluid: json(valuesUrl('1.18.2', 'tag_fluids'), false),
      'worldgen/biome': json(
        valuesUrl(baseTagVersion(version), 'tag_biomes'),
        false
      )
    },
    version
  );
  /* eslint-disable react-hooks/rules-of-hooks */
  const [defNamespace, setDefNamespace] = import.meta.env.SSR ?
    useState('unset') :
    useLocalStorageState<string>(
      'namespace',
      { defaultValue: 'unset' }
    );
  /* eslint-enable react-hooks/rules-of-hooks */

  const blockTypes: Registry = useMemo(
    () => new Registry(Object.keys(blockStates).map(labelizeOption)),
    [blockStates]
  );
  if (holder && (version === fetched.current || import.meta.env.SSR)) {
    holder.withVanilla(vanilla);
    holder.game.block = blockTypes;
    holder.game.block_state = blockTypes;
  }

  useEffect(() => {
    if (!window.indexedDB || !holder) {
      return;
    }
    entries<string, Schema>().then((entries) => {
      console.time('indexeddb');
      const edited = new Set<WorldgenRegistryKey>();
      entries.forEach(([path, schema]) => {
        const match = findNamespacedKeyAndRegistry(path);
        if (match && holder.isWorldgen(match[2])) {
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
        get registries(): RegistryHolder {
          return holder!;
        },
        set registries(holder: RegistryHolder) {
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
                setHolder(holder.withVanilla(vanilla))
              );
            })
            .catch((e) => {
              setHolder(holder.withVanilla(vanilla));
              console.error(e);
            });
        },
        get namespace(): string {
          return defNamespace;
        },
        set namespace(namespace: string) {
          setDefNamespace(namespace);
        },
        get version(): GameVersion {
          return version;
        },
        set version(version: GameVersion) {
          RegistryHolder.create(version).then((h) => {
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

import { clear, entries, setMany } from 'idb-keyval';
import { ReactNode, useEffect, useMemo } from 'react';
import { createContext, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { useFetchData, useRegistryFetch } from '../hook/useFetchData';
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
import { Values } from './RegistriesValues';

interface GameRegistry {
  blockStates: BlockStateRegistry;
  registries?: RegistryHolder;
  namespace: string;
  version: GameVersion;
}

export const GameContext = createContext<GameRegistry>({} as GameRegistry);

interface ProviderProps {
  children?: ReactNode;
  states?: BlockStateRegistry;
}
const defaultVersion: GameVersion = '1.20';

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
  const [vanilla, fetched] = useRegistryFetch(Values, version);

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

import { clear, entries, setMany } from 'idb-keyval';
import { ReactElement, ReactNode, useEffect } from 'react';
import { createContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import useLocalStorageState from 'use-local-storage-state';
import { useFetchData, useRegistryFetch } from '../hook/useFetchData';
import { useForceUpdate } from '../hook/useForceUpdate';
import {
  BlockStateRegistry,
  DEFAULT_BLOCK_STATE,
  Registry,
  RegistryHolder,
  Schema
} from '../model/Registry';
import type { WorldgenRegistryKey } from '../model/RegistryKey';
import { blockDataUrl } from '../util/FetchHelper';
import { defaultNamespace, labelizeOption } from '../util/LabelHelper';
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
const defaultVersion: GameVersion = '1.20.4';
const allowedVersions: Set<GameVersion> = new Set([
  '1.19',
  '1.19.4',
  '1.20.4'
]);

export function GameRegistryProvider({
  children,
  states
}: ProviderProps): ReactElement {
  const forceUpdate = useForceUpdate();
  /* eslint-disable react-hooks/rules-of-hooks */
  const [version, setVersion] = import.meta.env.SSR ?
    useState(defaultVersion) :
    useLocalStorageState<GameVersion>(
      'game-version',
      { defaultValue: defaultVersion }
    );
  if (!import.meta.env.SSR) {
    setVersion(version => {
      if (!allowedVersions.has(version)) {
        toast.error(`Unsupported version: ${version}`);
        return defaultVersion;
      }
      return version;
    });
  }
  /* eslint-enable react-hooks/rules-of-hooks */
  const [holder, setHolder] = useState<RegistryHolder | undefined>(
    version === defaultVersion ? () => RegistryHolder.def() : undefined
  );
  useEffect(() => {
    if (version !== defaultVersion) {
      RegistryHolder.create(version).then(setHolder).catch(console.error);
    }
  }, [version]);
  const blockStates = useFetchData<BlockStateRegistry>(
    blockDataUrl(version),
    {},
    states,
    async (res) => {
      const blocks = await res.json() as Record<string, [
        Record<string, string[]>,
        Record<string, string>
      ]>;
      const states = Object.fromEntries(
        Object.entries(blocks).map((
          [blockType, [properties, defaultState]]
        ) => [
          defaultNamespace(blockType),
          {
            properties,
            default: defaultState
          }
        ])
      );

      const keys: string[] = await fetch(
        `${import.meta.env.BASE_URL}registries/1.20.4/blocks.json`
      ).then((res) => res.json());
      const registry = new Registry(keys.map(labelizeOption));
      holder!.game.block = registry;
      holder!.game.block_state = registry;
      keys.forEach((block) => {
        block = defaultNamespace(block);
        if (!states[block]) {
          states[block] = DEFAULT_BLOCK_STATE;
        }
      });
      return states;
    }
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
  if (holder && (version === fetched.current || import.meta.env.SSR)) {
    holder.withVanilla(vanilla);
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
    }).catch(console.error);
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

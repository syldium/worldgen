import { useEffect, useState } from 'react';
import { useOptionsRegistry } from './useOptions';
import type {
  Registry,
  WorldgenRegistryHolder,
  WorldgenRegistryKey
} from '../model/Registry';
import { labelizeOption } from '../util/LabelHelper';
import { useToggle } from './useToggle';

export const readJson = <S>(response: Response): Promise<S> => response.json();
export const readText = (response: Response): Promise<string[]> =>
  response.ok
    ? response.text().then((string) => string.split('\n'))
    : Promise.resolve([]);
export function useFetchData<S>(
  url: RequestInfo,
  initial: S | (() => S),
  props?: S,
  reader: (response: Response) => Promise<S> = readJson
): S {
  const [data, setData] = useState<S>(props || initial);
  useEffect(
    function () {
      if (!props && 'fetch' in window) {
        fetch(url).then(reader).then(setData);
      }
    },
    [props, reader, url]
  );
  return data;
}

export function useFetchRegistry(
  url: RequestInfo,
  reader: (response: Response) => Promise<string[]> = readJson,
  labelize?: boolean
): Registry {
  return useOptionsRegistry(useFetchData(url, [], undefined, reader), labelize);
}
export function useWorldgenFetchRegistry<R extends WorldgenRegistryKey>(
  url: RequestInfo,
  custom: R,
  holder: WorldgenRegistryHolder,
  reader: (response: Response) => Promise<string[]>
): void {
  const [done, setDone] = useToggle();
  const registry = holder.worldgen[custom];
  useEffect(
    function () {
      if (!done && 'fetch' in window) {
        fetch(url)
          .then(reader)
          .then((entries) => {
            if (!entries.length) {
              return;
            }
            registry.vanilla = entries.map(labelizeOption);
            registry.options = [...registry.options, ...registry.vanilla];
            setDone(true);
          });
      }
    },
    [custom, done, reader, registry, setDone, url]
  );
}

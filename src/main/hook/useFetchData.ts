import { RefObject, useEffect, useRef, useState } from 'react';
import type { Option } from '../component/ui/Select';
import type { Registry, WorldgenRegistryHolder } from '../model/Registry';
import type { RegistryKey } from '../model/RegistryKey';
import { defaultNamespace, labelizeOption } from '../util/LabelHelper';

export const readJson = <S>(response: Response): Promise<S> => response.json();
export const readText = (response: Response): Promise<string[]> =>
  response.ok ?
    response.text().then((string) => string.split('\n')) :
    Promise.resolve([]);
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

export function useRegistryFetch<
  T extends { [key in RegistryKey]?: RegistryData }
>(
  registries: T,
  holder: WorldgenRegistryHolder
): [Record<keyof T, Registry>, RefObject<boolean>] {
  const [values, setValues] = useState<Record<keyof T, Registry>>(() => {
    const empty: Registry = { options: [], vanilla: [] };
    const initial = {} as Record<keyof T, Registry>;
    for (const registryKey of Object.keys(registries)) {
      initial[registryKey as keyof T] = empty;
    }
    return initial;
  });
  const done = useRef<boolean>(false);

  useEffect(
    function () {
      if (done.current || !window.fetch) {
        return;
      }

      const registryKeys: RegistryKey[] = [];
      const promises: Promise<Option[]>[] = [];
      for (const [registryKey, data] of Object.entries(registries)) {
        registryKeys.push(registryKey as RegistryKey);
        promises.push(
          fetch(data.url)
            .then(data.reader)
            .then((values) => {
              const options = data.label ?
                values.map(labelizeOption) :
                values.map((val) => ({
                  label: val,
                  value: defaultNamespace(val)
                }));
              if (holder.isRegistered(registryKey)) {
                holder.worldgen[registryKey].withVanilla(options);
              }
              return options;
            })
        );
      }

      Promise.allSettled(promises)
        .then((results) =>
          results.reduce((values, result, index) => {
            const key = registryKeys[index];
            const options = result.status === 'fulfilled' ? result.value : [];
            values[key] = { vanilla: options, options };
            if (options.length && holder.isRegistered(key)) {
              holder.worldgen[key].withVanilla(options);
            }
            return values;
          }, {} as Record<keyof T, Registry>)
        )
        .then((d) => {
          setValues(d);
          done.current = true;
        });
    },
    [holder, registries]
  );

  return [values, done];
}

export interface RegistryData {
  url: string;
  reader: (response: Response) => Promise<string[]>;
  label: boolean;
}

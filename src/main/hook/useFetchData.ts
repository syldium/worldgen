import { RefObject, useEffect, useRef, useState } from 'react';
import type { Option } from '../component/ui/Select';
import type { GameVersion } from '../context/GameVersion';
import type { RegistryValueProvider, ValueProvider } from '../model/Registry';
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

type FetchInstructions = { [key in RegistryKey]?: RegistryData };
export function useRegistryFetch(
  registries: FetchInstructions,
  tags: FetchInstructions,
  version: GameVersion
): [RegistryValueProvider, RefObject<GameVersion | undefined>] {
  const [values, setValues] = useState<RegistryValueProvider>(() => {
    const keys = new Set<RegistryKey>(
      Object.keys(registries).concat(Object.keys(tags)) as RegistryKey[]
    );
    const empty: ValueProvider = [];
    const initial = {} as RegistryValueProvider;
    for (const registryKey of keys) {
      initial[registryKey] = { registry: empty, tag: empty };
    }
    return initial;
  });
  const done = useRef<GameVersion | undefined>(undefined);

  useEffect(
    function () {
      if (done.current === version || !window.fetch) {
        return;
      }

      const registryKeys: [RegistryKey, boolean][] = [];
      const promises: Promise<Option[]>[] = [];
      function request(instructions: FetchInstructions, tag: boolean) {
        for (const [registryKey, data] of Object.entries(instructions)) {
          registryKeys.push([registryKey as RegistryKey, tag]);
          promises.push(
            fetch(data.url)
              .then(data.reader)
              .then((values) =>
                data.label ?
                  values.map(labelizeOption) :
                  values.map((val) => ({
                    label: val,
                    value: defaultNamespace(val)
                  }))
              )
          );
        }
      }
      request(registries, false);
      request(tags, true);

      Promise.allSettled(promises)
        .then((results) =>
          setValues((values) => {
            values = { ...values };
            for (let i = 0; i < results.length; i++) {
              const [key, isTag] = registryKeys[i];
              const result = results[i];
              const options = result.status === 'fulfilled' ? result.value : [];
              if (isTag) {
                values[key]!.tag = options;
              } else {
                values[key]!.registry = options;
              }
            }
            done.current = version;
            return values;
          })
        );
    },
    [registries, tags, version]
  );

  return [values, done];
}

export interface RegistryData {
  url: string;
  reader: (response: Response) => Promise<string[]>;
  label: boolean;
}

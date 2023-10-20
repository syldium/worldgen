import { RefObject, useEffect, useRef, useState } from 'react';
import type { Option } from '../component/ui/Select';
import type { GameVersion } from '../context/GameVersion';
import type { ValuesByVersion } from '../context/RegistriesValues';
import { Labelled, Values } from '../context/RegistriesValues';
import type { RegistryValueProvider } from '../model/Registry';
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

export function useRegistryFetch(
  instructions: ValuesByVersion,
  version: GameVersion
): [RegistryValueProvider, RefObject<GameVersion | undefined>] {
  const [values, setValues] = useState<RegistryValueProvider>({});
  const done = useRef<GameVersion | undefined>(undefined);

  useEffect(
    function () {
      if (done.current === version || !window.fetch) {
        return;
      }

      const registryKeys: [RegistryKey, boolean][] = [];
      const promises: Promise<Option[]>[] = [];
      function request(
        instructions: { [key in RegistryKey]?: string },
        tag: boolean
      ) {
        for (const [registryKey, url] of Object.entries(instructions)) {
          registryKeys.push([registryKey as RegistryKey, tag]);
          promises.push(
            fetch(`registries/${url}`)
              .then((res) => res.json() as Promise<string[]>)
              .then((values) =>
                !tag && Labelled.has(registryKey as RegistryKey) ?
                  values.map(labelizeOption) :
                  values.map((val) => ({
                    label: val,
                    value: defaultNamespace(val)
                  }))
              )
          );
        }
      }
      const val: Values = instructions[version as keyof typeof Values];
      request(val.registries, false);
      if (val.tags) {
        request(val.tags, true);
      }

      done.current = version;
      Promise.allSettled(promises)
        .then((results) =>
          setValues((values) => {
            values = { ...values };
            for (let i = 0; i < results.length; i++) {
              const [key, isTag] = registryKeys[i];
              const result = results[i];
              const options = result.status === 'fulfilled' ? result.value : [];
              if (!values[key]) {
                values[key] = { tag: [], registry: [] };
              }
              if (isTag) {
                values[key]!.tag = options;
              } else {
                values[key]!.registry = options;
              }
            }
            return values;
          })
        );
    },
    [instructions, version]
  );

  return [values, done];
}

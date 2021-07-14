import { useEffect, useState } from 'react';
import { useOptionsRegistry } from './useOptions';
import { Registry } from '../model/Registry';

export const readJson = <S>(response: Response): Promise<S> => response.json();
export const readText = (response: Response): Promise<string[]> =>
  response.text().then((string) => string.split('\n'));
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
  reader: (response: Response) => Promise<string[]> = readJson
): Registry {
  return useOptionsRegistry(useFetchData(url, [], undefined, reader));
}

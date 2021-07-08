import { useEffect, useState } from 'react';

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
      if (!props) {
        fetch(url).then(reader).then(setData);
      }
    },
    [props, reader, url]
  );
  return data;
}

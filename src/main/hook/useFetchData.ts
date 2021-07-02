import { useEffect, useState } from 'react';

const readJson = (response: Response) => response.json();
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

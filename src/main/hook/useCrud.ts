import { MouseEvent, useCallback } from 'react';
import { Obj, ReactKeyed, addReactKey } from '../util/DomHelper';

interface CrudProps<T> {
  elements: ReadonlyArray<T extends Obj ? T & ReactKeyed : T>;
  create: (event?: MouseEvent<HTMLElement>) => void;
  update: (state: T, index: number) => void;
}

export type DataType =
  | Record<string | number, unknown>
  | number
  | string
  | boolean;

export function useCrudProps<T extends DataType>(
  onChange: (values: readonly T[]) => void,
  data: readonly T[] = [],
  initial: T | ((values: readonly T[]) => T) = {} as T
): CrudProps<T> {
  const create = useCallback(
    function (event?: MouseEvent<HTMLElement>) {
      if (event) {
        event.preventDefault();
      }
      const t: T = typeof initial === 'function' ? initial(data) : initial;
      onChange([...data, t]);
    },
    [data, initial, onChange]
  );
  const update = useCallback(
    function (state: T, index: number) {
      onChange(data.map((element, i) => (i === index ? state : element)));
    },
    [data, onChange]
  );

  data.forEach((el) => {
    if (el && typeof el === 'object') {
      addReactKey(el);
    }
  });
  return {
    elements: data as ReadonlyArray<T extends Obj ? T & ReactKeyed : T>,
    create,
    update
  };
}

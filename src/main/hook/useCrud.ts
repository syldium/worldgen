import { MouseEvent, useCallback, useState } from 'react';
import { addReactKey, Obj, ReactKeyed } from '../util/DomHelper';

interface CrudProps<T> {
  elements: ReadonlyArray<T extends Obj ? T & ReactKeyed : T>;
  create: (event?: MouseEvent<HTMLElement>) => void;
  update: (state: T, index: number) => void;
  remove: (index: number, event?: MouseEvent<HTMLElement>) => void;
  replace: (values: T[]) => void;
}

export type DataType =
  | Record<string | number, unknown>
  | ReadonlyArray<DataType>
  | number
  | string
  | boolean;

export function useCrud<T extends DataType>(
  data: readonly T[] = [],
  initial: T | ((values: readonly T[]) => T) = {} as T
): CrudProps<T> {
  const [state, setState] = useState(data);
  return useCrudProps(setState, state, initial);
}

export function useCrudProps<T extends DataType>(
  onChange: (values: readonly T[]) => void,
  data: readonly T[] = [],
  initial: T | ((values: readonly T[]) => T) = {} as T
): CrudProps<T> {
  data = Array.isArray(data) ? data : [];
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
  const remove = useCallback(
    function (index: number, event?: MouseEvent<HTMLElement>) {
      if (event) {
        event.preventDefault();
      }
      onChange(data.filter((element, i) => i !== index));
    },
    [data, onChange]
  );

  data.forEach((el) => {
    if (el && !Array.isArray(el) && typeof el === 'object') {
      addReactKey(el as Obj);
    }
  });
  return {
    elements: data as ReadonlyArray<T extends Obj ? T & ReactKeyed : T>,
    create,
    update,
    remove,
    replace: onChange
  };
}

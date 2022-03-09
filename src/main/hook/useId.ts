import { nanoid } from 'nanoid';
import { useMemo } from 'react';

export const useId = (name: string | number): string =>
  useMemo(() => name + '-' + nanoid(4), [name]);

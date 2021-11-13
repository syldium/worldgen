import { nanoid } from 'nanoid';
import { useMemo } from 'react';

export const useId = (name: string): string =>
  useMemo(() => name + '-' + nanoid(4), [name]);

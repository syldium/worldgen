import { useMemo } from 'react';
import { nanoid } from 'nanoid';

export const useId = (name: string): string =>
  useMemo(() => name + '-' + nanoid(4), [name]);

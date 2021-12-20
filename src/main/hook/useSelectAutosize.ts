import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { Option } from '../component/ui/Select';

export const useSelectAutosize = (options: readonly Option[]): CSSProperties =>
  useMemo<CSSProperties>(() => {
    const width = 8 * Math.max(...options.map((o) => o.label.length)) + 60;
    if (!isFinite(width)) {
      return { width: '250px' };
    }
    return { width };
  }, [options]);

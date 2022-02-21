import { useCallback, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

interface DarkMode {
  readonly value: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
}

const preferDarkQuery = '(prefers-color-scheme: dark)';
const classNameDark = 'dark-mode';
const classNameLight = 'light-mode';

export function useDarkMode(): DarkMode {
  const mediaQueryValue = !import.meta.env.SSR &&
    window.matchMedia(preferDarkQuery)?.matches;
  const [state, setState] = useLocalStorageState<boolean>(
    'darkMode',
    { defaultValue: mediaQueryValue }
  );

  useEffect(() => {
    const classList = window.document.body.classList;
    classList.add(state ? classNameDark : classNameLight);
    classList.remove(state ? classNameLight : classNameDark);
  }, [state]);

  return {
    value: state,
    enable: useCallback(() => setState(true), [setState]),
    disable: useCallback(() => setState(false), [setState]),
    toggle: useCallback(() => setState((current) => !current), [setState])
  };
}

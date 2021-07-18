import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';

type ToggleParam =
  | void
  | ChangeEvent<HTMLInputElement>
  | MouseEvent<HTMLElement>
  | boolean;

export function useToggle(
  initial = false
): [boolean, (param?: ToggleParam) => void] {
  const [state, setState] = useState<boolean>(initial);
  const toggle = useCallback(function (e?: ToggleParam) {
    if (typeof e === 'boolean' || e != null) {
      let value: boolean | null = null;
      if (typeof e === 'boolean') {
        value = e;
      } else if (
        e.target instanceof HTMLInputElement &&
        e.target?.type === 'checkbox'
      ) {
        value = e.target.checked;
      } else {
        e.preventDefault();
      }

      if (value !== null) {
        setState(value);
        return;
      }
    }
    setState((current) => !current);
  }, []);
  return [state, toggle];
}

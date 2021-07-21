import { ChangeEvent, useCallback } from 'react';

export function useLowercaseInput(): (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => void {
  return useCallback(
    (event) => (event.target.value = event.target.value.toLowerCase()),
    []
  );
}

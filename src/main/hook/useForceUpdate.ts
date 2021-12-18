import { useReducer } from 'react';

export const useForceUpdate = () => useReducer((x) => x + 1, 0)[1];

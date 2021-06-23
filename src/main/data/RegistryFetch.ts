import { BlockStateRegistry } from '../model/Registry';

export const loadBlockStates = function (
  callback: (states: BlockStateRegistry) => void
): void {
  const url = 'https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/reports/blocks/simplified/data.min.json';
  //const url = '/blocks/data.json';
  fetch(url)
    .then((response) => response.json())
    .then(callback);
};

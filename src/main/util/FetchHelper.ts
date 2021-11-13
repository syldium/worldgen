import type { Unzipped } from 'fflate';
import type { GameVersion } from '../context/GameVersion';

export const loadVanillaZip = async function (
  version: GameVersion
): Promise<Unzipped> {
  let ref = 'master';
  if (version === '1.17') {
    ref = '7c54f55409f395a0aa517729669b20d570969f30';
  } else if (version === '1.16') {
    ref = '80fb4b8418ff3ff5724f4a0438bb422f58960bd9';
  }
  const url =
    `https://raw.githubusercontent.com/slicedlime/examples/${ref}/vanilla_worldgen.zip`;
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) =>
      import('../context/ZipAction').then(({ ZipAction }) =>
        ZipAction.unzip(buffer)
      )
    );
};

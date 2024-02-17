import type { Unzipped } from 'fflate';
import type { GameVersion } from '../context/GameVersion';

export const getVanillaZipUrl = (version: GameVersion): string => {
  let ref = 'master';
  if (version === '1.18.2') {
    ref = 'd766a7028865fc210bef3ddcffb54886cdaf4860';
  } else if (version === '1.18') {
    ref = '033bedfa67f63a89755258e1846407d7ef185b90';
  } else if (version === '1.17') {
    ref = '7c54f55409f395a0aa517729669b20d570969f30';
  } else if (version === '1.16') {
    ref = '80fb4b8418ff3ff5724f4a0438bb422f58960bd9';
  }
  return `https://raw.githubusercontent.com/slicedlime/examples/${ref}/vanilla_worldgen.zip`;
};

export const loadVanillaZip = async function (
  version: GameVersion
): Promise<Unzipped> {
  return fetch(getVanillaZipUrl(version))
    .then((response) => response.arrayBuffer())
    .then((buffer) =>
      import('../context/ZipAction').then(({ ZipAction }) =>
        ZipAction.unzip(buffer)
      )
    );
};

export const dataUrl = function (version: GameVersion) {
  let ref = '87d27e74f45fa333fefd4f0675ba94f6478908db';
  if (version === '1.19.4') {
    ref = '38dd2592cf3ad33192d4c8ec02c6e3e231d263c8';
  } else if (version === '1.19') {
    ref = 'ea2a2c1e828a50f552ebd29d4207a13caaabc38f';
  }
  return `https://raw.githubusercontent.com/misode/mcmeta/${ref}`;
};

export const blockDataUrl = function (version: GameVersion) {
  let ref = '4e9bec3ad44be22dd7c9f3d095b1240b2629a6ab';
  if (version === '1.19.4') {
    ref = 'ffd2eb6f5bcb59fb5fb54227d3b10901cd8ede71';
  } else if (version === '1.19') {
    ref = 'bec4783e8095f0523c60b8b722d8d86990b7a057';
  }
  return `https://raw.githubusercontent.com/misode/mcmeta/${ref}/blocks/data.min.json`;
};

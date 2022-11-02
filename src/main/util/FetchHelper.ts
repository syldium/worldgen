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
  let ref = 'master';
  if (version === '1.18.2') {
    ref = '3a1dd3ae1be74e15bac62d940d89efb70a045877';
  } else if (version === '1.18') {
    ref = 'c303c6ccfe0c34b13ce39dcb18647e6093b40259';
  } else if (version === '1.17') {
    ref = '9c9aa93ca1e44a61cc60954b5580546490d936f6';
  } else if (version === '1.16') {
    ref = '2aa35bd15742950a3d63a2f62e091074d946cbe2';
  }
  return `https://raw.githubusercontent.com/Arcensoth/mcdata/${ref}/processed/`;
};

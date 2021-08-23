import type { Unzipped } from 'fflate';

export const loadVanillaZip = async function (): Promise<Unzipped> {
  const url =
    'https://raw.githubusercontent.com/slicedlime/examples/master/vanilla_worldgen.zip';
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) =>
      import('../context/ZipAction').then(({ ZipAction }) =>
        ZipAction.unzip(buffer)
      )
    );
};

import JSZip from 'jszip';

export const loadVanillaZip = async function (): Promise<JSZip> {
  const url = 'https://raw.githubusercontent.com/slicedlime/examples/master/vanilla_worldgen.zip';
  return fetch(url)
    .then((response) => response.blob())
    .then(JSZip.loadAsync);
};

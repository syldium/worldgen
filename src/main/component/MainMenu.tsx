import React, { useCallback, useContext } from 'react';
import { GameContext } from '../context/GameRegistry';
import { RegistryEntries } from '../model/Registry';
import { ZipAction } from '../context/ZipAction';
import { saveAs } from 'file-saver';

export function MainMenu(): JSX.Element {
  const { worldgen } = useContext(GameContext);
  const registryEntries: Record<string, RegistryEntries> = {};
  for (const [registryKey, { entries }] of Object.entries(worldgen.worldgen)) {
    registryEntries[registryKey] = entries;
  }

  const handleGenerateClick = useCallback(
    function () {
      new ZipAction(worldgen)
        .generate()
        .then((blob) => saveAs(blob, 'generated_datapack.zip'));
    },
    [worldgen]
  );

  return (
    <>
      <button onClick={handleGenerateClick}>Generate</button>
      <code>
        <pre>{JSON.stringify(registryEntries, null, 2)}</pre>
      </code>
    </>
  );
}

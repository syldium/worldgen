import React, { useCallback, useContext } from 'react';
import { GameContext } from '../context/GameRegistry';
import { RegistryEntries, WorldgenRegistryKey } from '../model/Registry';
import { ZipAction } from '../context/ZipAction';
import { saveAs } from 'file-saver';
import { PlusCircle } from 'react-feather';
import { useToggle } from '../hook/useToggle';
import { Modal } from './ui/Modal';
import { CreateForm } from './form/CreateForm';
import { useHistory } from 'react-router-dom';
import { Button } from './ui/Button';
import { catchToast } from '../util/ErrorHelper';
import { toast } from 'react-hot-toast';

export function MainMenu(): JSX.Element {
  const context = useContext(GameContext);
  const { worldgen } = context;
  const [open, toggleAction] = useToggle(false);
  const registryEntries: Record<string, RegistryEntries> = {};
  for (const [registryKey, { entries }] of Object.entries(worldgen.worldgen)) {
    registryEntries[registryKey] = entries;
  }

  const history = useHistory();
  const handleGenerateClick = useCallback(
    function () {
      const id = toast.loading('Generating datapack');
      ZipAction.create(worldgen)
        .generate()
        .catch(catchToast(id))
        .then((blob) => saveAs(blob, 'generated_datapack.zip'))
        .catch(catchToast(id))
        .then(() => toast.success('Download ready!', { id }));
    },
    [worldgen]
  );
  const handleNewResource = useCallback(
    function (key: WorldgenRegistryKey) {
      history.push(`/${key}`);
      toggleAction(false);
    },
    [history, toggleAction]
  );
  const handleNewDatapack = useCallback(
    function (namespace: string) {
      context.namespace = namespace;
      toggleAction(false);
    },
    [context, toggleAction]
  );
  const handleLoad = useCallback(
    function (zip: ZipAction) {
      context.worldgen = zip.registry;
      context.namespace = zip.registry.findNamespace() || 'unset';
      toggleAction(false);
    },
    [context, toggleAction]
  );

  return (
    <>
      <Button onClick={handleGenerateClick}>Generate</Button>
      <button onClick={toggleAction}>
        <PlusCircle />
      </button>
      {open && (
        <Modal isOpen={open} onClose={toggleAction}>
          <CreateForm
            onCancel={toggleAction}
            onCreate={handleNewDatapack}
            onLoad={handleLoad}
            onResourceCreate={handleNewResource}
          />
        </Modal>
      )}
      <code>
        <pre>{JSON.stringify(registryEntries, null, 2)}</pre>
      </code>
    </>
  );
}

import React, { useCallback, useContext } from 'react';
import { GameContext } from '../context/GameRegistry';
import { WorldgenNames, WorldgenRegistryHolder } from '../model/Registry';
import { ZipAction } from '../context/ZipAction';
import { saveAs } from 'file-saver';
import { Download, PlusCircle } from 'react-feather';
import { useToggle } from '../hook/useToggle';
import { Modal } from './ui/Modal';
import { CreateForm } from './form/CreateForm';
import { navigate } from '../util/UriHelper';
import { Button } from './ui/Button';
import { catchToast } from '../util/ErrorHelper';
import { toast } from 'react-hot-toast';
import { ResourceList } from './resource/ResourceList';
import type { WorldgenRegistryKey } from '../model/RegistryKey';

export function MainMenu(): JSX.Element {
  const context = useContext(GameContext);
  const { worldgen } = context;
  const [open, toggleAction] = useToggle(false);

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
      navigate(`/${key}`);
      toggleAction(false);
    },
    [toggleAction]
  );
  const handleNewDatapack = useCallback(
    function (namespace: string) {
      context.namespace = namespace;
      context.worldgen = new WorldgenRegistryHolder('1.17');
      ZipAction.clearWorker();
      toggleAction(false);
    },
    [context, toggleAction]
  );
  const handleLoad = useCallback(
    function (zip: ZipAction) {
      context.worldgen = zip.registries;
      context.namespace = zip.registries.findNamespace() || 'unset';
      toggleAction(false);
    },
    [context, toggleAction]
  );

  return (
    <div className="stats">
      <div className="header full-width">
        <h2>
          Datapack <code>{context.namespace}</code>
        </h2>
        <div className="datapack-actions">
          <Button onClick={handleGenerateClick}>
            Generate <Download />
          </Button>
          <Button cat="secondary" onClick={toggleAction}>
            Create
            <PlusCircle />
          </Button>
        </div>
      </div>
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
      {!import.meta.env.SSR &&
        (Object.keys(WorldgenNames) as WorldgenRegistryKey[]).map((key) => (
          <ResourceList registryKey={key} key={key} />
        ))}
    </div>
  );
}

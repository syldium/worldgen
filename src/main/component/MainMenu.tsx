import { saveAs } from 'file-saver';
import { useCallback, useContext } from 'react';
import { Download, PlusCircle } from 'react-feather';
import { toast } from 'react-hot-toast';
import { GameContext } from '../context/GameRegistry';
import { RemovableModelsByVersion } from '../context/GameVersion';
import { ZipAction } from '../context/ZipAction';
import { useToggle } from '../hook/useToggle';
import { EmptyModel } from '../model/Model';
import { WorldgenRegistryHolder } from '../model/Registry';
import type { WorldgenRegistryKey } from '../model/RegistryKey';
import { catchToast } from '../util/ErrorHelper';
import { navigate } from '../util/UriHelper';
import { CreateForm } from './form/CreateForm';
import { ResourceList } from './resource/ResourceList';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

export function MainMenu(): JSX.Element {
  const context = useContext(GameContext);
  const worldgen = context.worldgen!;
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
        (Object.keys(worldgen.worldgen) as WorldgenRegistryKey[])
          .filter(
            (key) =>
              !RemovableModelsByVersion[context.version].has(key) &&
              context.worldgen!.worldgen[key].model != EmptyModel
          )
          .map((key) => <ResourceList registryKey={key} key={key} />)}
    </div>
  );
}

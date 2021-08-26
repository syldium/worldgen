import React, {
  DragEvent,
  FormEvent,
  useState,
  ChangeEvent,
  useContext
} from 'react';
import { useLowercaseInput } from '../../hook/useLowercaseInput';
import { WorldgenNames } from '../../model/Registry';
import { Button } from '../ui/Button';
import { ZipAction } from '../../context/ZipAction';
import { useToggle } from '../../hook/useToggle';
import { GameContext } from '../../context/GameRegistry';
import { MergeForm } from './MergeForm';
import { toast } from 'react-hot-toast';
import type { WorldgenRegistryKey } from '../../model/RegistryKey';

interface CreateFormProps {
  onCancel: () => void;
  onCreate: (namespace: string) => void;
  onLoad: (zip: ZipAction) => void;
  onResourceCreate: (registryKey: WorldgenRegistryKey) => void;
}

export function CreateForm({
  onCancel,
  onCreate,
  onLoad,
  onResourceCreate
}: CreateFormProps): JSX.Element {
  const [isMerge, toggleMerge] = useToggle();
  return (
    <div id="create-form" className={isMerge ? 'is-merge' : 'is-create'}>
      {!isMerge && <NewResource onClick={onResourceCreate} />}
      <CreateDatapackForm
        onCancel={onCancel}
        onCreate={onCreate}
        onLoad={onLoad}
        toggleMerge={toggleMerge}
      />
    </div>
  );
}

interface CreateDatapackFormProps {
  onCancel: () => void;
  onCreate: (namespace: string) => void;
  onLoad: (zip: ZipAction) => void;
  toggleMerge: (merge: boolean) => void;
}
function CreateDatapackForm({
  onCancel,
  onCreate,
  onLoad,
  toggleMerge
}: CreateDatapackFormProps): JSX.Element {
  const { worldgen } = useContext(GameContext);
  const [zip, setZip] = useState<ZipAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = function (
    event: DragEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>
  ) {
    event.preventDefault();
    event.stopPropagation();
    const file = ((event as DragEvent).dataTransfer || event.target)
      .files[0] as File;
    const id = toast.loading('Loading datapack');
    ZipAction.read(file)
      .then((action) => {
        const length = action.errors;
        if (length) {
          toast.error(
            `Failed to read ${length} file${length > 1 ? 's' : ''}!`,
            { id }
          );
        } else {
          toast.success('Datapack imported', { id });
        }
        if (worldgen.hasValues()) {
          setZip(action);
          toggleMerge(true);
        } else {
          onLoad(action);
        }
      })
      .catch((error) => {
        toast.error('Invalid datapack!', { id });
        console.error(error);
        setError(error instanceof Error ? error.message : error);
      });
  };
  if (zip !== null) {
    return <MergeForm onCancel={onCancel} onLoad={onLoad} zip={zip} />;
  }
  return (
    <DefNamespaceForm onDefine={onCreate} error={error}>
      <input
        type="file"
        name="load-existing-zip"
        id="load-existing-zip"
        accept=".zip"
        onChange={handleFile}
      />
      <label htmlFor="load-existing-zip" className="btn--info">
        Use existing datapack
      </label>
    </DefNamespaceForm>
  );
}

interface DefNamespaceFormProps {
  children?: React.ReactNode;
  error?: string | null;
  namespace?: string;
  onDefine: (namespace: string) => void;
}
function DefNamespaceForm({
  children,
  error,
  namespace,
  onDefine
}: DefNamespaceFormProps): JSX.Element {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onDefine(
      new FormData(event.target as HTMLFormElement).get('namespace') as string
    );
  };

  return (
    <div id="new-datapack">
      <h3>Create a new datapack</h3>
      <form onSubmit={handleSubmit} className="form-control">
        <label htmlFor="namespace">Default namespace</label>
        <br />
        <input
          type="text"
          name="namespace"
          id="namespace"
          defaultValue={namespace}
          required
          pattern="^[a-z0-9_\-.]+$"
          autoCapitalize="none"
          spellCheck="false"
          autoComplete="off"
          aria-describedby="namespaceHelp"
          onChange={useLowercaseInput()}
        />
        <p>
          <small id="namespaceHelp" className="form-text text-muted">
            This differentiates the datapack from the vanilla functions.
            Namespaces and identifiers may only contain lowercase letters,
            numbers and <code>._-</code> characters. This namespace is not
            final, you can edit the vanilla dimensions in the following menus.
          </small>
        </p>
        <div className="actions">
          <Button>Create</Button>
          {children}
        </div>
        {error !== null && <div className="alert--danger">{error}</div>}
      </form>
    </div>
  );
}

interface NewResourceProps {
  onClick: (registryKey: WorldgenRegistryKey) => void;
}

const NewResource = ({ onClick }: NewResourceProps): JSX.Element => (
  <div>
    <h3>Create a new resource</h3>
    <ul className="models-list">
      {(Object.keys(WorldgenNames) as WorldgenRegistryKey[])
        .filter(
          (key) =>
            key !== 'worldgen/configured_decorator' &&
            key !== 'worldgen/configured_structure_feature'
        )
        .map((key) => (
          <li key={key} className="model-type">
            <a
              href={`/${key}`}
              onClick={function (event) {
                event.preventDefault();
                onClick(key);
              }}
            >
              {WorldgenNames[key]}
            </a>
          </li>
        ))}
    </ul>
  </div>
);

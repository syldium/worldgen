import React, { FormEvent, useCallback } from 'react';
import { useLowercaseInput } from '../../hook/useLowercaseInput';
import { WorldgenNames, WorldgenRegistryKey } from '../../model/Registry';
import { Button } from '../ui/Button';

interface CreateFormProps {
  onCreate: (namespace: string) => void;
  onResourceCreate: (registryKey: WorldgenRegistryKey) => void;
}

export const CreateForm = ({
  onCreate,
  onResourceCreate
}: CreateFormProps): JSX.Element => (
  <div id="create-form">
    <NewResource onClick={onResourceCreate} />
    <DefNamespaceForm onDefine={onCreate} />
  </div>
);

interface DefNamespaceFormProps {
  children?: React.ReactNode;
  namespace?: string;
  onDefine: (namespace: string) => void;
}
function DefNamespaceForm({
  children = 'Create',
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
        <Button>{children}</Button>
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
        .filter((key) => key !== 'worldgen/configured_decorator')
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

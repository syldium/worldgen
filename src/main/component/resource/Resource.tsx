import React, {
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react';
import { ModelView } from '../NodeElement';
import { GameContext } from '../../context/GameRegistry';
import { Schema, WorldgenRegistryKey } from '../../model/Registry';
import { useHistory, useParams } from 'react-router-dom';
import { NamespacedKey } from '../NamespacedKey';
import { Obj } from '../../util/DomHelper';

interface ResourceFormProps {
  registryKey: WorldgenRegistryKey;
  children?: ReactNode;
}
export function Resource({
  registryKey,
  children
}: ResourceFormProps): JSX.Element {
  const history = useHistory();
  const { id } = useParams<{ id: 'resource' }>();
  const registry = useContext(GameContext).worldgen.worldgen[registryKey];
  const [value, setValue] = useState<Schema>(
    registry.entries[id] || registry.model.preset('1.17')
  );

  const handleChange = useCallback(function (value: Obj) {
    setValue((val) => ({ ...val, ...value }));
  }, []);

  const handleSubmit = useCallback(
    function (e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const key = (document.querySelector('[name=key]') as HTMLInputElement)
        .value;
      registry.register(key, value as Obj & Schema);
      history.push('/');
    },
    [history, registry, value]
  );

  return (
    <form onSubmit={handleSubmit}>
      <NamespacedKey registry={registryKey}>{children}</NamespacedKey>
      <ModelView
        model={registry.model.node}
        name={'model'}
        value={value as Obj}
        onChange={handleChange}
      />
      <button>Save</button>
      <code>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </code>
    </form>
  );
}

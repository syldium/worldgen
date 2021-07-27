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
import { JsonViewer } from '../ui/JsonViewer';
import { Button } from '../ui/Button';
import { defaultNamespace } from '../../util/LabelHelper';

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
  const context = useContext(GameContext);
  const registry = context.worldgen.worldgen[registryKey];
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
      registry.register(
        defaultNamespace(key, context.namespace),
        value as Obj & Schema
      );
      history.push('/');
    },
    [context.namespace, history, registry, value]
  );

  return (
    <form onSubmit={handleSubmit}>
      <NamespacedKey registry={registryKey} onSelectLoad={setValue}>
        {children}
        <JsonViewer data={value} />
      </NamespacedKey>
      <ModelView
        model={registry.model.node}
        name={'model'}
        value={value as Obj}
        onChange={handleChange}
      />
      <Button>Save</Button>
    </form>
  );
}

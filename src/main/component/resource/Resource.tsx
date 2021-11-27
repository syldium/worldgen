import { ReactNode, useCallback, useState } from 'react';
import { ResourceView } from '../NodeElement';
import { NamespacedKey } from '../NamespacedKey';
import { Obj } from '../../util/DomHelper';
import { JsonViewer } from '../ui/JsonViewer';
import { Button } from '../ui/Button';
import { useRegistry } from '../../hook/useRegistry';
import { useResourceSubmit } from '../../hook/useResourceSubmit';
import type { Schema } from '../../model/Registry';
import type { WorldgenRegistryKey } from '../../model/RegistryKey';

interface ResourceFormProps {
  registryKey: WorldgenRegistryKey;
  children?: ReactNode;
}
export function Resource({
  registryKey,
  children
}: ResourceFormProps): JSX.Element {
  const [registry, previousKey, initial, postLoad] = useRegistry(registryKey);

  const [value, setValue] = useState<Schema>(initial);
  const handleChange = useCallback(
    (value: Obj) => setValue((val) => ({ ...val, ...value })),
    []
  );
  const handleSubmit = useResourceSubmit(registryKey, previousKey, value);
  postLoad(setValue);

  return (
    <form onSubmit={handleSubmit}>
      <NamespacedKey
        registry={registryKey}
        value={previousKey}
        onSelectLoad={setValue}
      >
        {children}
        <JsonViewer data={value} />
      </NamespacedKey>
      <ResourceView
        model={registry.model.node}
        name={registryKey}
        value={value as Obj}
        onChange={handleChange}
      />
      <Button>Save</Button>
    </form>
  );
}

import { ReactNode, useState } from 'react';
import { useRegistry } from '../../hook/useRegistry';
import { useResourceSubmit } from '../../hook/useResourceSubmit';
import type { Schema } from '../../model/Registry';
import type { WorldgenRegistryKey } from '../../model/RegistryKey';
import { Obj } from '../../util/DomHelper';
import { NamespacedKey } from '../NamespacedKey';
import { ResourceView } from '../NodeElement';
import { Button } from '../ui/Button';
import { JsonViewer } from '../ui/JsonViewer';

interface ResourceFormProps {
  registryKey: WorldgenRegistryKey;
  id: string | undefined;
  children?: ReactNode;
}
export function Resource({
  registryKey,
  id,
  children
}: ResourceFormProps): JSX.Element {
  const [registry, previousKey, initial, postLoad] = useRegistry(
    registryKey,
    id
  );

  const [value, setValue] = useState<Schema>(initial);
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
        onChange={setValue}
      />
      <Button>Save</Button>
    </form>
  );
}

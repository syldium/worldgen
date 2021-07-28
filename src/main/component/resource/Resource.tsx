import React, { ReactNode, useCallback, useState } from 'react';
import { ModelView } from '../NodeElement';
import { Schema, WorldgenRegistryKey } from '../../model/Registry';
import { NamespacedKey } from '../NamespacedKey';
import { Obj } from '../../util/DomHelper';
import { JsonViewer } from '../ui/JsonViewer';
import { Button } from '../ui/Button';
import { useRegistry } from '../../hook/useRegistry';
import { useResourceSubmit } from '../../hook/useResourceSubmit';

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

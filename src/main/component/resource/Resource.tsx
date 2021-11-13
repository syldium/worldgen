import React, { ReactNode, useCallback, useState } from 'react';
import { useRegistry } from '../../hook/useRegistry';
import { useResourceSubmit } from '../../hook/useResourceSubmit';
import type { Schema } from '../../model/Registry';
import type { WorldgenRegistryKey } from '../../model/RegistryKey';
import { Obj } from '../../util/DomHelper';
import { NamespacedKey } from '../NamespacedKey';
import { ModelView } from '../NodeElement';
import { Button } from '../ui/Button';
import { JsonViewer } from '../ui/JsonViewer';

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

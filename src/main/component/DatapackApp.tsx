import React, { useState } from 'react';
import { NavBar } from './ui/NavBar';
import { ModelView } from './NodeElement';
import { Dimension } from '../data/1.17/Dimension';

export function DatapackApp(): JSX.Element {
  const [resource, setResource] = useState<Record<string, unknown>>(
    Dimension.preset('1.17')
  );

  return (
    <div>
      <NavBar />
      <h1>Dimension datapack generator</h1>
      <ModelView
        name="model"
        model={Dimension.node}
        value={resource}
        onChange={setResource}
      />
      <code>
        <pre>{JSON.stringify(resource, null, 2)}</pre>
      </code>
    </div>
  );
}

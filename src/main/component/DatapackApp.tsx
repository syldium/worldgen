import React, { useState } from 'react';
import { NavBar } from './ui/NavBar';
import { NodeElement } from './NodeElement';
import { DimensionType } from '../data/1.17/DimensionType';

export function DatapackApp(): JSX.Element {
  const [resource, setResource] = useState<Record<string, unknown>>({
    dimension_type: DimensionType.preset('1.17')
  });

  return (
    <div>
      <NavBar />
      <h1>Dimension datapack generator</h1>
      <NodeElement
        name="dimension_type"
        node={DimensionType.node}
        value={resource}
        onChange={setResource}
      />
      <code>
        <pre>{JSON.stringify(resource, null, 2)}</pre>
      </code>
    </div>
  );
}

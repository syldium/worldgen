import React, { useState } from 'react';
import { NavBar } from './ui/NavBar';
import { BlockState, BlockStateValue } from './resource/BlockState';

export function DatapackApp(): JSX.Element {
  const [blockState, setBlockState] = useState<Record<string, BlockStateValue>>(
    { block: { Name: 'air' } }
  );

  return (
    <div>
      <NavBar />
      <h1>Dimension datapack generator</h1>
      <BlockState
        name="block"
        value={blockState.block}
        onChange={setBlockState}
      />
      <code>
        <pre>{JSON.stringify(blockState, null, 2)}</pre>
      </code>
    </div>
  );
}

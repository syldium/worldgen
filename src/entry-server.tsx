import React from 'react';
import { renderToString } from 'react-dom/server';
import { DatapackApp } from './main/component/DatapackApp';
import { GameRegistryProvider } from './main/context/GameRegistry';

export function render(url: string): string {
  return renderToString(
    <GameRegistryProvider>
      <DatapackApp location={import.meta.env.BASE_URL + url} />
    </GameRegistryProvider>
  );
}

export { WorldgenNames } from './main/model/Registry';

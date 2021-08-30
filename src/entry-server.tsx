import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { DatapackApp } from './main/component/DatapackApp';
import { GameRegistryProvider } from './main/context/GameRegistry';

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={import.meta.env.BASE_URL + url}>
      <GameRegistryProvider>
        <DatapackApp />
      </GameRegistryProvider>
    </StaticRouter>
  );
}

export { WorldgenNames } from './main/model/Registry';

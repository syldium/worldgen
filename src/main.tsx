import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { DatapackApp } from './main/component/DatapackApp';
import { GameRegistryProvider } from './main/context/GameRegistry';
import './style/index.css';
import './style/spacers.scss';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <GameRegistryProvider>
      <DatapackApp location={window.location.pathname} />
    </GameRegistryProvider>
    <Toaster />
  </StrictMode>
);

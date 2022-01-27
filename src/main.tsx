import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { DatapackApp } from './main/component/DatapackApp';
import { GameRegistryProvider } from './main/context/GameRegistry';
import './style/index.css';
import './style/spacers.scss';

ReactDOM.render(
  <StrictMode>
    <GameRegistryProvider>
      <DatapackApp location={window.location.pathname} />
    </GameRegistryProvider>
    <Toaster />
  </StrictMode>,
  document.getElementById('root')
);

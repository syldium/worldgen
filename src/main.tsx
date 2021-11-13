import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import './style/spacers.scss';
import { DatapackApp } from './main/component/DatapackApp';
import { GameRegistryProvider } from './main/context/GameRegistry';
import { Toaster } from 'react-hot-toast';

ReactDOM.render(
  <React.StrictMode>
    <GameRegistryProvider>
      <DatapackApp location={window.location.pathname} />
    </GameRegistryProvider>
    <Toaster />
  </React.StrictMode>,
  document.getElementById('root')
);

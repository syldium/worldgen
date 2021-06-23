import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import { DatapackApp } from './main/component/DatapackApp';
import { GameRegistryProvider } from './main/context/GameRegistry';

ReactDOM.render(
  <React.StrictMode>
    <GameRegistryProvider>
      <DatapackApp />
    </GameRegistryProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

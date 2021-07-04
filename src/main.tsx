import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import { DatapackApp } from './main/component/DatapackApp';
import { GameRegistryProvider } from './main/context/GameRegistry';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GameRegistryProvider>
        <DatapackApp />
      </GameRegistryProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

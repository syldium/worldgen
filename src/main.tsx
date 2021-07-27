import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import './style/spacers.scss';
import { DatapackApp } from './main/component/DatapackApp';
import { GameRegistryProvider } from './main/context/GameRegistry';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <GameRegistryProvider>
        <DatapackApp />
      </GameRegistryProvider>
    </BrowserRouter>
    <Toaster />
  </React.StrictMode>,
  document.getElementById('root')
);

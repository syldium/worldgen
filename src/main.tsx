import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { DatapackApp } from './main/component/DatapackApp';
import { GameRegistryProvider } from './main/context/GameRegistry';
import './style/index.css';
import './style/spacers.scss';

ReactDOM.render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <GameRegistryProvider>
        <DatapackApp />
      </GameRegistryProvider>
    </BrowserRouter>
    <Toaster />
  </StrictMode>,
  document.getElementById('root')
);

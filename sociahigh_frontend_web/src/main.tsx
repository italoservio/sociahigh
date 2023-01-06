import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Routes} from './routes';
import './main.css';
import AppContextProvider from './contexts/app-context/app-context';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <BrowserRouter>
    <AppContextProvider>
      <Routes />
    </AppContextProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'normalize.css';

import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { ClientPreloadedDataProvider } from './Data';

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <React.StrictMode>
    <BrowserRouter>
      <ClientPreloadedDataProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ClientPreloadedDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

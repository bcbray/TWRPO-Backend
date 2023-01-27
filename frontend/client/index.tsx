import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'normalize.css';

import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { ClientPreloadedDataProvider } from './Data';
import { ClientEnvironmentProvider } from './Environment';

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <React.StrictMode>
    <BrowserRouter>
      <ClientEnvironmentProvider>
        <ClientPreloadedDataProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </ClientPreloadedDataProvider>
      </ClientEnvironmentProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import CharactersContainer from './CharactersContainer';
import MultistreamContainer from './MultistreamContainer';
import NotFound from './NotFound';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/characters" element={<CharactersContainer />}>
            <Route path=":factionKey" element={<CharactersContainer />} />
          </Route>
          <Route path="/multistream" element={<MultistreamContainer />} />
          <Route path="/multistream/faction" element={<Navigate to="/multistream" />} />
          <Route path="/multistream/faction/:factionKey" element={<MultistreamContainer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css';

import { publicRoutes, privateRoutes, redirects } from './routes';
import Structure from './Structure';
import TrackerProvider from './TrackerProvider';
import { FactionStyleContextProvider } from './FactionStyleProvider';
import NotFound from './NotFound';

interface Props {

}

const App: React.FC<Props> = () => {
  return (
    <TrackerProvider>
      <FactionStyleContextProvider>
        <Structure>
          <RouterRoutes>
            {publicRoutes}
            {privateRoutes}
            {redirects}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Structure>
      </FactionStyleContextProvider>
    </TrackerProvider>
  );
};

export default App;

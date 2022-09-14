import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css';

import { publicRoutes, privateRoutes, privateStandaloneRoutes, redirects } from './routes';
import Structure from './Structure';
import TrackerProvider from './TrackerProvider';
import { FactionStyleContextProvider } from './FactionStyleProvider';
import NotFound from './NotFound';
import { UserProvider } from './auth';

interface Props {

}

const App: React.FC<Props> = () => {
  return (
    <UserProvider>
      <TrackerProvider>
        <FactionStyleContextProvider>
          <RouterRoutes>
            {privateStandaloneRoutes}
            <Route element={<Structure />}>
              {publicRoutes}
              {privateRoutes}
              {redirects}
              <Route path="*" element={<NotFound />} />
            </Route>
          </RouterRoutes>
        </FactionStyleContextProvider>
      </TrackerProvider>
    </UserProvider>
  );
};

export default App;

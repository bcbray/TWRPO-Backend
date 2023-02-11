import React from 'react';
import { Routes as RouterRoutes, Route, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.min.css';
import { Server } from '@twrpo/types';

import { publicRoutes, privateRoutes, privateStandaloneRoutes, redirects } from './routes';
import Structure from './Structure';
import TrackerProvider from './TrackerProvider';
import { FactionStyleContextProvider } from './FactionStyleProvider';
import NotFound from './NotFound';
import { UserProvider } from './auth';
import { CurrentServerProvider } from './CurrentServer';

interface Props {

}

interface RootStructureProps {
  setServer: (server: Server | null) => void;
}

const RootStructure: React.FC<RootStructureProps> = ({ setServer }) =>
  <Structure setServer={setServer}>
    <Outlet />
  </Structure>;

const App: React.FC<Props> = () => {
  const [server, setServer] = React.useState<Server | null>(null);

  return (<>
    <Helmet>
      <title>Twitch WildRP Only</title>
    </Helmet>
    <UserProvider>
      <TrackerProvider>
        <FactionStyleContextProvider>
          <CurrentServerProvider identifier={server?.id ?? 'wrp'}>
            <RouterRoutes>
              {privateStandaloneRoutes}
              <Route element={<RootStructure setServer={setServer} />}>
                {publicRoutes}
                {privateRoutes}
                {redirects}
                <Route path="*" element={<NotFound />} />
              </Route>
            </RouterRoutes>
          </CurrentServerProvider>
        </FactionStyleContextProvider>
      </TrackerProvider>
    </UserProvider>
  </>);
};

export default App;

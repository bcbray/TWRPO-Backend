import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import CharactersContainer from './CharactersContainer';
import MultistreamContainer from './MultistreamContainer';
import LiveContainer from './LiveContainer';
import ColorHelperContainer from  './ColorHelperContainer';
import TrackerProvider from './TrackerProvider';
import PageviewTracker from './PageviewTracker';
import NotFound from './NotFound';

interface Props {

}

const App: React.FC<Props> = () => {
  return (
    <TrackerProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/characters" element={<CharactersContainer />}>
              <Route path=":factionKey" element={<CharactersContainer />} />
            </Route>
            <Route path="/multistream" element={<MultistreamContainer />} />
            <Route path="/multistream/faction" element={<Navigate to="/multistream" />} />
            <Route path="/multistream/faction/:factionKey" element={<MultistreamContainer />} />
            <Route path="/streams" element={<LiveContainer />} />
            <Route path="/streams/faction" element={<Navigate to="/streams" />} />
            <Route path="/streams/faction/:factionKey" element={<LiveContainer />} />
            <Route path="/utils/colors" element={<ColorHelperContainer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <PageviewTracker />
        </BrowserRouter>
      </HelmetProvider>
    </TrackerProvider>
  );
};

export default App;

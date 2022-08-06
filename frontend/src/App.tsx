import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.min.css';

import Structure from './Structure';
import CharactersContainer from './CharactersContainer';
import MultistreamContainer from './MultistreamContainer';
import LiveContainer from './LiveContainer';
import ColorHelperContainer from  './ColorHelperContainer';
import TrackerProvider from './TrackerProvider';
import NotFound from './NotFound';

interface Props {

}

const App: React.FC<Props> = () => {
  return (
    <TrackerProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Structure>
            <Routes>
              <Route path="/" element={<LiveContainer />} />
              <Route path="/streams" element={<Navigate to="/" />} />
              <Route path="/streams/faction" element={<Navigate to="/" />} />
              <Route path="/streams/faction/:factionKey" element={<LiveContainer />} />
              <Route path="/characters" element={<CharactersContainer />} />
              <Route path="/characters/faction" element={<Navigate to="/characters" />} />
              <Route path="/characters/faction/:factionKey" element={<CharactersContainer />} />
              <Route path="/multistream" element={<MultistreamContainer />} />
              <Route path="/multistream/faction" element={<Navigate to="/multistream" />} />
              <Route path="/multistream/faction/:factionKey" element={<MultistreamContainer />} />
              <Route path="/utils/colors" element={<ColorHelperContainer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Structure>
        </BrowserRouter>
      </HelmetProvider>
    </TrackerProvider>
  );
};

export default App;

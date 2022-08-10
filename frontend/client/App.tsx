import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css';

import Structure from './Structure';
import CharactersContainer from './CharactersContainer';
import MultistreamContainer from './MultistreamContainer';
import LiveContainer from './LiveContainer';
import ColorHelperContainer from  './ColorHelperContainer';
import TrackerProvider from './TrackerProvider';
import NotFound from './NotFound';
import Redirect from './Redirect'

interface Props {

}

const App: React.FC<Props> = () => {
  return (
    <TrackerProvider>
      <Structure>
        <Routes>
          <Route path="/" element={<LiveContainer />} />
          <Route path="/streams" element={<Redirect to="/" />} />
          <Route path="/streams/faction" element={<Redirect to="/" />} />
          <Route path="/streams/faction/:factionKey" element={<LiveContainer />} />
          <Route path="/characters" element={<CharactersContainer />} />
          <Route path="/characters/faction" element={<Redirect to="/characters" />} />
          <Route path="/characters/faction/:factionKey" element={<CharactersContainer />} />
          <Route path="/multistream" element={<MultistreamContainer />} />
          <Route path="/multistream/faction" element={<Redirect to="/multistream" />} />
          <Route path="/multistream/faction/:factionKey" element={<MultistreamContainer />} />
          <Route path="/utils/colors" element={<ColorHelperContainer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Structure>
    </TrackerProvider>
  );
};

export default App;

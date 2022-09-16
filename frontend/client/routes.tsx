import { Route } from 'react-router-dom';

import CharactersContainer from './CharactersContainer';
import MultistreamContainer from './MultistreamContainer';
import LiveContainer from './LiveContainer';
import StreamerContainer from './StreamerContainer';
import ColorHelperContainer from  './ColorHelperContainer';
import CrossfadeHelper from  './CrossfadeHelper';
import UnknownContainer from  './UnknownContainer';
import Redirect from './Redirect';
import { AuthComplete } from './auth';
import Login from './Login';
import Streams from './Streams';

export const publicRoutes = <>
  <Route path="/" element={<LiveContainer />} />
  <Route path="/streams/faction/:factionKey" element={<LiveContainer />} />
  <Route path="/characters" element={<CharactersContainer />} />
  <Route path="/characters/faction/:factionKey" element={<CharactersContainer />} />
  <Route path="/streamer/:streamerName" element={<StreamerContainer />} />
  <Route path="/multistream" element={<MultistreamContainer />} />
  <Route path="/multistream/faction/:factionKey" element={<MultistreamContainer />} />
</>;

export const privateRoutes = <>
  <Route path="/login" element={<Login />} />
  <Route path="/utils/colors" element={<ColorHelperContainer />} />
  <Route path="/utils/crossfade" element={<CrossfadeHelper />} />
  <Route path="/utils/unknown" element={<UnknownContainer />} />
  <Route path="/utils/streams" element={<Streams />} />
</>;

export const privateStandaloneRoutes = <>
  <Route path="/auth/success" element={<AuthComplete success />} />
  <Route path="/auth/failure" element={<AuthComplete success={false} />} />
</>;

export const redirects = <>
  <Route path="/streams" element={<Redirect to="/" />} />
  <Route path="/streams/faction" element={<Redirect to="/" />} />
  <Route path="/streamer" element={<Redirect to="/" />} />
  <Route path="/characters/faction" element={<Redirect to="/characters" />} />
  <Route path="/multistream/faction" element={<Redirect to="/multistream" />} />
</>

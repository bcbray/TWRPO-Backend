import React from 'react';
import { Stream, FactionInfo, CharacterInfo } from '@twrpo/types';
import { Button } from '@restart/ui';

import styles from './CrossfadeHelper.module.css'

import { useFactionCss } from './FactionStyleProvider';
import { classes } from './utils';
import Crossfade from './Crossfade';
import StreamCard from './StreamCard';
import OfflineCharacterCard from './OfflineCharacterCard';

interface CrossfadeHelperProps {

}

const CrossfadeHelper: React.FC<CrossfadeHelperProps> = () => {
  useFactionCss();

  const [offline, setOffline] = React.useState(false);

  const startDate = React.useMemo(() => (new Date(new Date().getTime() - 5241000)).toISOString() ,[]);
  const endDate = React.useMemo(() => (new Date(new Date().getTime() - 1000 * 60)).toISOString() ,[]);
  const fakeFaction: FactionInfo = {
    key: 'samsclub',
    name: 'Sam\'s Club',
    colorLight: 'red',
    colorDark: 'orange',
  };
  const fakeCharacterInfo: CharacterInfo = {
    id: 0,
    channelName: 'Ssaab',
    name: 'Sam Baas',
    displayInfo: {
      realNames: ['Sam', 'Baas'],
      nicknames: [],
      titles: [],
      displayName: 'Sam',
    },
    factions: [fakeFaction],
    channelInfo: {
      id: '1234',
      login: 'ssaab',
      displayName: 'Ssaab',
      profilePictureUrl: '/images/example-live-pfp.png',
    },
    lastSeenLive: endDate,
  }
  const fakeStream: Stream = {
    channelName: 'Ssaab',
    title: 'Sam Baas | WildRP',
    viewers: 1432,
    profileUrl: '/images/example-live-pfp.png',
    id: 0,
    rpServer: 'WRP',
    characterName: 'Sam Baas',
    characterId: 1,
    nicknameLookup: null,
    faction: fakeFaction.key,
    factions: [fakeFaction.key],
    factionsMap: {fake: true},
    tagText: 'Sam',
    tagFaction: fakeFaction.key,
    thumbnailUrl: '/images/example-live-thumbnail.jpeg',
    startDate
  };

  return (
    <div className={classes('content', styles.container)}>
      <div className={styles.buttons}>
        <Button
          className='button primary'
          onClick={() => setOffline(o => !o)}
        >
          {offline ? 'Go online' : 'Go offline'}
        </Button>
      </div>
      <Crossfade
        fadeKey={offline ? 'offline' : 'online'}
      >
        {offline ? (
          <OfflineCharacterCard
            className={styles.offline}
            character={fakeCharacterInfo}
          />
        ) : (
          <StreamCard
            className={styles.online}
            stream={fakeStream}
          />
        )}
      </Crossfade>
    </div>
  );
};

export default CrossfadeHelper;

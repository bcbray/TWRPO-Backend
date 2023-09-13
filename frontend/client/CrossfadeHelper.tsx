import React from 'react';
import { Stream, FactionInfo, CharacterInfo } from '@twrpo/types';
import { Button } from '@restart/ui';

import styles from './CrossfadeHelper.module.css'

import { useFactionCss } from './FactionStyleProvider';
import { classes } from './utils';
import Crossfade from './Crossfade';
import StreamCard from './StreamCard';
import OfflineCharacterCard from './OfflineCharacterCard';
import { useCurrentServer } from './CurrentServer';

interface CrossfadeHelperProps {

}

const CrossfadeHelper: React.FC<CrossfadeHelperProps> = () => {
  const { server } = useCurrentServer();
  useFactionCss(server);

  const [offline, setOffline] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  const [secondImage, setSecondImage] = React.useState(false);

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
    formerFactions: [],
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
    channelTwitchId: '1234',
    title: 'Sam Baas | WildRP',
    viewers: 1432,
    profileUrl: '/images/example-live-pfp.png',
    id: 0,
    streamId: '0',
    rpServer: 'WRP',
    serverId: 1,
    characterName: 'Sam Baas',
    characterDisplayName: 'Sam Baas',
    characterUncertain: false,
    characterId: 1,
    characterContact: null,
    nicknameLookup: null,
    faction: fakeFaction.key,
    factions: [fakeFaction.key],
    factionsMap: {fake: true},
    tagText: 'Sam',
    tagFaction: fakeFaction.key,
    thumbnailUrl: secondImage
      ? '/images/example-live-thumbnail-2.jpeg'
      : '/images/example-live-thumbnail.jpeg',
    startDate,
    isHidden: false,
    segmentId: 0,
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
        <Button
          className='button primary'
          onClick={() => setSecondImage(s => !s)}
        >
          Swap image
        </Button>
        <Button
          className='button primary'
          onClick={() => setTick(t => t + 1)}
        >
          Tick
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
            loadTick={tick}
            handleRefresh={() => {}}
            factionsByKey={{}}
          />
        )}
      </Crossfade>
    </div>
  );
};

export default CrossfadeHelper;

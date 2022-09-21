import React from 'react';
import { Helmet } from "react-helmet-async";
import {
  StreamerResponse,
  Streamer as StreamerInfo,
} from '@twrpo/types';
import { Twitch } from 'react-bootstrap-icons';
import { Button } from '@restart/ui';

import styles from './Streamer.module.css';

import { classes } from './utils';
import ProfilePhoto from './ProfilePhoto';
import OutboundLink from './OutboundLink';
import CharactersTable from './CharactersTable';
import StreamList from './StreamList'
import FeedbackModal from './FeedbackModal';
import { useStreams } from './Data';
import { usePaginatedStreams } from './Streams';
import { LoadTrigger } from './hooks';

interface StreamerProps {
  data: StreamerResponse;
}

interface StreamerLinkProps {
  streamer: StreamerInfo;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const StreamerLink: React.FC<StreamerLinkProps> = ({ streamer, className, style, children }) => (
  <OutboundLink
    logName={streamer.displayName}
    logContext={{
      subtype: 'streamer',
      isLive: true,
      channel: streamer.displayName,
    }}
    target='_blank'
    rel='noreferrer'
    href={`https://twitch.tv/${streamer.twitchLogin}`}
    className={className}
    style={style}
  >
    {children}
  </OutboundLink>
);

const Streamer: React.FC<StreamerProps> = ({
  data: {
    streamer,
    characters,
  },
}) => {
  const [showingFeedbackModal, setShowingFeedbackModal] = React.useState<boolean>(false);
  const handleShowFeedback = React.useCallback(<T,>(e: React.MouseEvent<T>) => {
    setShowingFeedbackModal(true);
    e.preventDefault();
  }, []);
  const handleCloseFeedback = React.useCallback(() => (
    setShowingFeedbackModal(false)
  ), []);

  const {
    streams,
    hasMore,
    loadMore,
    loadTick,
    loadKey,
    reload,
  } = usePaginatedStreams(useStreams, {
    channelTwitchId: streamer.twitchId,
    distinctCharacters: false,
  });

  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - {streamer.displayName} WildRP Streams & Characters</title>
        <meta
          name='description'
          content={`${streamer.displayName} WildRP streams and character information.`}
        />
      </Helmet>
      <div className={classes('inset', styles.content, characters.length === 0 && styles.noCharacters)}>
        <div className={styles.streamer}>
          <h2>
          <StreamerLink
            className={styles.channelLink}
            streamer={streamer}
          >
            <ProfilePhoto
              channelInfo={streamer}
              size='lg'
              style={{
                display: 'inline-block'
              }}
            />
            <span>
              {streamer.displayName}
              {' '}
              <Twitch className={styles.twitchLogo} />
            </span>
          </StreamerLink>
          </h2>
        </div>
        <div className={styles.characters}>
          <h3>
            Characters
          </h3>
          {characters.length > 0 ? (
            <CharactersTable
              characters={characters}
              factionDestination='streams'
              hideStreamer
              noInset
              noStreamerLink
              noHover
            />
          ) : (
            <p>
              {`We don’t know about characters for ${streamer.displayName}. `}
              If you do, please <Button as='span' className='linkish' onClick={handleShowFeedback}>suggest one</Button>.
            </p>
          )}
        </div>
        <div className={styles.recentStreams}>
          <h3>Recent Streams</h3>
          {streams.length > 0 || hasMore ? (
            <StreamList
              streams={[]}
              segments={streams}
              paginationKey={streamer.twitchId}
              loadTick={loadTick}
              isLoadingMore={hasMore}
              loadMoreTrigger={
                streams.length > 0 && hasMore
                  ? <LoadTrigger key={loadKey} loadMore={loadMore} />
                  : undefined
              }
              hideStreamer
              noInset
              wrapTitle
              showLiveBadge
              handleRefresh={reload}
            />
          ) : (
            <p>{`We don’t have any past streams tracked for ${streamer.displayName}.`}</p>
          )}
        </div>
      </div>
      <FeedbackModal show={showingFeedbackModal} onHide={handleCloseFeedback} />
    </>
  );
};

export default Streamer;

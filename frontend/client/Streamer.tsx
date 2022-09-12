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

interface StreamerProps {
  data: StreamerResponse;
  loadTick: number;
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

const Streamer: React.FC<StreamerProps> = ({ data, loadTick }) => {
  const [showingFeedbackModal, setShowingFeedbackModal] = React.useState<boolean>(false);
  const handleShowFeedback = React.useCallback(<T,>(e: React.MouseEvent<T>) => {
    setShowingFeedbackModal(true);
    e.preventDefault();
  }, []);
  const handleCloseFeedback = React.useCallback(() => (
    setShowingFeedbackModal(false)
  ), []);

  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - {data.streamer.displayName} WildRP Streams & Characters</title>
        <meta
          name='description'
          content={`${data.streamer.displayName} WildRP streams and character information.`}
        />
      </Helmet>
      <div className={classes('inset', styles.content, data.characters.length === 0 && styles.noCharacters)}>
        <div className={styles.streamer}>
          <h2>
          <StreamerLink
            className={styles.channelLink}
            streamer={data.streamer}
          >
            <ProfilePhoto
              channelInfo={{
                id: data.streamer.twitchId,
                login: data.streamer.twitchLogin,
                displayName: data.streamer.displayName,
                profilePictureUrl: data.streamer.profilePhotoUrl,
              }}
              size='lg'
              style={{
                display: 'inline-block'
              }}
            />
            <span>
              {data.streamer.displayName}
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
          {data.characters.length > 0 ? (
            <CharactersTable
              characters={data.characters}
              hideStreamer
              noInset
              noStreamerLink
              noHover
            />
          ) : (
            <p>
              {`We don’t know about characters for ${data.streamer.displayName}. `}
              If you do, please <Button as='span' className='linkish' onClick={handleShowFeedback}>suggest one</Button>.
            </p>
          )}
        </div>
        <div className={styles.recentStreams}>
          <h3>Recent Streams</h3>
          {data.streamer.liveInfo !== undefined || data.recentSegments.length > 0 ? (
            <StreamList
              streams={data.streamer.liveInfo ? [data.streamer.liveInfo] : []}
              pastStreams={data.recentSegments.filter(s => !s.liveInfo).map(s => [data.streamer, s])}
              paginationKey={data.streamer.twitchId}
              loadTick={loadTick}
              hideStreamer
              noInset
              wrapTitle
              showLiveBadge
            />
          ) : (
            <p>{`We don’t have any past streams tracked for ${data.streamer.displayName}.`}</p>
          )}
        </div>
      </div>
      <FeedbackModal show={showingFeedbackModal} onHide={handleCloseFeedback} />
    </>
  );
};

export default Streamer;

import React from 'react';
import { Helmet } from "react-helmet-async";
import {
  StreamerResponse,
  Streamer as StreamerInfo,
} from '@twrpo/types';
import { Twitch, Calendar2RangeFill, Grid3x3GapFill } from 'react-bootstrap-icons';
import { useLocalStorage } from 'react-use';
import { useDatadogRum } from 'react-datadog';
import { Button } from '@restart/ui';
import { toast } from 'react-toastify';

import styles from './Streamer.module.css';

import { classes } from './utils';
import ProfilePhoto from './ProfilePhoto';
import OutboundLink from './OutboundLink';
import CharactersTable from './CharactersTable';
import StreamList from './StreamList'
import FeedbackModal from './FeedbackModal';
import { useStreams } from './Data';
import { usePaginatedStreams } from './Streams';
import { LoadTrigger, useIsMobile } from './hooks';
import StreamerTimeline from './StreamerTimeline';
import { useCurrentServer } from './CurrentServer';
import { useAuthorization } from './auth'
import Timeseries from './Timeseries';
import OverrideMultipleSegmentsModal from './OverrideMultipleSegmentsModal';

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

const MultiEditButton: React.FC<{
  className?: string,
  streamerTwitchLogin: string,
  handleRefresh: () => void,
}> = ({
  className,
  streamerTwitchLogin,
  handleRefresh,
}) => {
  const [showingModal, setShowingModal] = React.useState(false);
  const showSavedToast = React.useCallback(() => (
    toast.info('Streams updated!')
  ), []);

  return <>
    <Button
      className={classes(
        className,
      )}
      as='a'
      onClick={() => setShowingModal(true)}
    >
      Edit multiple
    </Button>
    <OverrideMultipleSegmentsModal
      streamerTwitchLogin={streamerTwitchLogin}
      show={showingModal}
      onHide={(saved) => {
        if (saved) {
          showSavedToast();
          handleRefresh();
        }
        setShowingModal(false);
      }}
    />
  </>;
};

const Streamer: React.FC<StreamerProps> = ({
  data: {
    streamer,
    requestedRemoval,
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
  const isMobile = useIsMobile();
  const [streamsView, setStreamsView] = useLocalStorage<'cards' | 'timeline'>(
    'streamer-streams-view-style',
    isMobile ? 'cards' : 'timeline'
  );
  const rum = useDatadogRum();

  const viewTimeliine = React.useCallback(() => {
    setStreamsView('timeline');
    rum.addAction(`Change streamer view to timeline`, {
      type: 'streamer-stream-view-change',
      view: 'timeline',
      streamer: streamer.displayName,
    });
  }, [setStreamsView, rum, streamer]);

  const viewCards = React.useCallback(() => {
    setStreamsView('cards');
    rum.addAction(`Change streamer view to cards`, {
      type: 'streamer-stream-view-change',
      view: 'cards',
      streamer: streamer.displayName,
    });
  }, [setStreamsView, rum, streamer]);
  const canViewAllSegments = useAuthorization('view-all-segments');
  const canViewTimeseries = useAuthorization('view-streamer-timeseries');
  const [viewTimeseries, setViewTimeseries] = React.useState(false);
  const canEdit = useAuthorization({
    type: 'overide-segment',
    twitchId: streamer.twitchLogin,
  });
  const { server } = useCurrentServer();
  const [viewAllSegments, setViewAllSegments] = React.useState(false);

  const factionsByKey = React.useMemo(() => (
    Object.fromEntries(characters.flatMap(c => c.factions.map(f => [f.key, f])))
  ), [characters]);

  const {
    streams,
    hasMore,
    loadMore,
    loadTick,
    loadKey,
    reload,
    lastRefresh,
  } = usePaginatedStreams(useStreams, {
    channelTwitchId: streamer.twitchId,
    distinctCharacters: false,
    serverId: viewAllSegments && canViewAllSegments ? undefined : server.id,
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
          {requestedRemoval ? (
            <p>
              <em>{`Character information has been removed at the request of ${streamer.displayName}.`}</em>
            </p>
          ) : characters.length > 0 ? (
            <CharactersTable
              characters={characters}
              columns={['title', 'name', 'nickname', 'faction', 'formerFaction', 'contact', 'lastSeen', 'duration']}
              collapsibleColumns={['title', 'nickname', 'formerFaction']}
              defaultSort={['duration', 'desc']}
              factionDestination='streams'
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
        {canViewTimeseries && viewTimeseries &&
          <div className={styles.timeseries}>
            <Timeseries
              constrainToServer={!viewAllSegments}
              channelTwitchId={streamer.twitchId}
              availableMetrics={['viewers']}
            />
          </div>
        }
        <div className={styles.recentStreams}>
          <div className={styles.streamsHeader}>
            <div className={styles.title}>
              <h3>Recent Streams</h3>
              {canViewAllSegments &&
                <Button
                  as='a'
                  onClick={() => setViewAllSegments(v => !v)}
                >
                  {viewAllSegments ? 'View WildRP only' : 'View all streams'}
                </Button>
              }
              {canViewTimeseries &&
                <Button
                  as='a'
                  onClick={() => setViewTimeseries(v => !v)}
                >
                  {viewTimeseries ? 'Hide chart' : 'View chart'}
                </Button>
              }
              {canEdit &&
                <MultiEditButton
                  streamerTwitchLogin={streamer.twitchLogin}
                  handleRefresh={reload}
                />
              }
            </div>
            <div className={styles.streamsStyleControl}>
              <Button
                className={classes(
                  styles.streamsStyleButton,
                  streamsView === 'timeline' && styles.active
                )}
                onClick={viewTimeliine}
              >
                <Calendar2RangeFill size={18} />
              </Button>
              <Button
                className={classes(
                  styles.streamsStyleButton,
                  streamsView === 'cards' && styles.active
                )}
                onClick={viewCards}
              >
                <Grid3x3GapFill size={18} />
              </Button>
            </div>
          </div>
          {streams.length > 0 || hasMore ? (
            streamsView === 'timeline' ? (
              <StreamerTimeline
                streamer={streamer}
                segments={streams.map(({ segment }) => segment)}
                lastLoadTime={lastRefresh}
                loadTick={loadTick}
                isLoadingMore={hasMore}
                loadMoreTrigger={
                  streams.length > 0 && hasMore
                    ? <LoadTrigger key={loadKey} loadMore={loadMore} />
                    : undefined
                }
              />
            ) : (
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
                factionsByKey={factionsByKey}
              />
            )
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

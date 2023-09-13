import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDatadogRum } from 'react-datadog';
import { Button } from '@restart/ui';
import { useLocalStorage } from 'react-use';
import { CharacterInfo, FactionInfo } from '@twrpo/types';

import styles from './CharactersTable.module.css';
import LiveBadge from './LiveBadge';
import ProfilePhoto from './ProfilePhoto';
import { classes, formatDuration } from './utils';
import { useFactionCss } from './FactionStyleProvider';
import { useRelativeDateMaybe } from './hooks';
import { useCurrentServer } from './CurrentServer';
import MetaAlert, { MetaAlertDecision } from './MetaAlert';
import { useAuthorization } from './auth';

type Column = 'streamer' | 'title' | 'name' | 'nickname' | 'faction' | 'formerFaction' | 'contact' | 'lastSeen' | 'duration';
type Order = 'asc' | 'desc';

interface Props {
  characters: CharacterInfo[];
  columns?: Column[];
  noInset?: boolean;
  noStreamerLink?: boolean;
  noHover?: boolean;
  factionDestination?: 'characters' | 'streams';
  defaultSort?: [Column, Order];
  truncationLimit?: number;
};

interface RowProps {
  character: CharacterInfo;
  columns: Column[];
  noStreamerLink: boolean;
  factionDestination: 'characters' | 'streams';
  canShowContacts: boolean;
  requestContactVisibility: (onApprove: () => void) => void;
}

const visibleFactions = (factions: FactionInfo[]) =>
  factions.length === 1 && factions[0].key === 'independent'
    ? []
    : factions;

const CharacterRow: React.FC<RowProps> = ({
  character,
  columns,
  noStreamerLink,
  factionDestination,
  canShowContacts,
  requestContactVisibility,
}) => {
  const { server } = useCurrentServer();
  const location = useLocation();
  const rum = useDatadogRum();
  const { factionStyles } = useFactionCss(server);
  const factionsToShow = React.useMemo(() => visibleFactions(character.factions), [character.factions]);
  const lastSeenLiveDate = React.useMemo(() => {
    if (!character.lastSeenLive) return undefined;
    const date = new Date(character.lastSeenLive);
    if (isNaN(date.getTime())) return undefined;
    return date;
  }, [character.lastSeenLive]);

  const firstSeenLiveDate = React.useMemo(() => {
    if (!character.firstSeenLive) return undefined;
    const date = new Date(character.firstSeenLive);
    if (isNaN(date.getTime())) return undefined;
    return date;
  }, [character.firstSeenLive]);

  const lastSeenLive = useRelativeDateMaybe(lastSeenLiveDate);
  const firstSeenLive = useRelativeDateMaybe(firstSeenLiveDate);

  const totalDuration = React.useMemo(() => {
    if (!character.totalSeenDuration) {
      return undefined;
    }
    return formatDuration(character.totalSeenDuration);
  }, [character.totalSeenDuration]);

  const [contactObscured, setContactObscured] = React.useState(true);

  const handleShowContact = React.useCallback(() => {
    rum.addAction(`Contact info show`, {
      type: 'show-contact-info',
      streamer: character.channelName,
      character: character.displayInfo.realNames.join(' '),
    });

    if (canShowContacts) {
      setContactObscured(false);
    } else {
      requestContactVisibility(() => setContactObscured(false));
    }
  }, [canShowContacts, requestContactVisibility, rum, character]);

  return React.useMemo(() => (
    <tr className={styles.characterRow}>
      {columns.includes('streamer') &&
        <td className={styles.channelName}>
          {noStreamerLink ? (
            <>
              <ProfilePhoto
                className={styles.pfp}
                channelInfo={character.channelInfo}
                size={24}
                style={{
                  height: '1.5rem',
                  width: '1.5rem',
                  borderRadius: '0.75rem',
                }}
              />
              {character.channelName}
              {character.liveInfo && <LiveBadge className={styles.liveTag} stream={character.liveInfo} />}
            </>
          ) : (
            <Link to={`/streamer/${character.channelName.toLowerCase()}`}>
              <ProfilePhoto
                className={styles.pfp}
                channelInfo={character.channelInfo}
                size={24}
                style={{
                  height: '1.5rem',
                  width: '1.5rem',
                  borderRadius: '0.75rem',
                }}
              />
              {character.channelName}
              {character.liveInfo && <LiveBadge className={styles.liveTag} stream={character.liveInfo} />}
            </Link>
          )}
        </td>
      }
      {columns.includes('title') &&
        <td className={styles.titles}>{character.displayInfo.titles.join(', ')}</td>
      }
      {columns.includes('name') &&
        <td className={styles.name}>
          {noStreamerLink ? (
            character.displayInfo.realNames.join(' ')
          ) : (
            <Link to={`/streamer/${character.channelName.toLowerCase()}`}>
              {character.displayInfo.realNames.join(' ')}
            </Link>
          )}
          {character.isDeceased && <> <span className={styles.deceased}>(deceased)</span></>}
          {!columns.includes('streamer') && character.liveInfo && <LiveBadge className={styles.liveTag} stream={character.liveInfo} />}
        </td>
      }
      {columns.includes('nickname') &&
        <td className={styles.nicknames}>{character.displayInfo.nicknames.join(', ')}</td>
      }
      {columns.includes('faction') &&
        <td className={styles.factions}>
        {
          factionsToShow.map((faction) =>
          <Link
            key={faction.key}
            className={styles.factionPill}
            to={
              factionDestination === 'characters'
                ? `/characters/faction/${faction.key}${location.search}`
                : `/streams/faction/${faction.key}`
            }
            style={factionStyles(faction)}
          >
            <span>
              {faction.name}
            </span>
          </Link>
          )
        }
        </td>
      }
      {columns.includes('formerFaction') &&
        <td className={styles.factions}>
        {
          character.formerFactions.map((faction) =>
          <Link
            key={faction.key}
            className={styles.factionPill}
            to={
              factionDestination === 'characters'
                ? `/characters/faction/${faction.key}${location.search}`
                : `/streams/faction/${faction.key}`
            }
            style={factionStyles(faction)}
          >
            <span>
              {faction.name}
            </span>
          </Link>
          )
        }
        </td>
      }
      {columns.includes('contact') &&
        <td className={styles.contact}>
          {contactObscured && character.contact !== undefined ? (
            <span className={styles.obscured}>
              <span className={styles.value}>{character.contact}</span>
              <Button
                as='span'
                className={classes(styles.showButton)}
                onClick={handleShowContact}
                title='Show telegram number'
              >
                Show
              </Button>
            </span>
          ) : character.contact}
        </td>
      }
      {columns.includes('lastSeen') &&
        <td className={styles.lastSeen}>
          {character.liveInfo ? (
            'live now'
          ) : (
            lastSeenLive?.full && lastSeenLive?.relative &&
              <span title={lastSeenLive.full}>{lastSeenLive.relative}</span>
          )}
        </td>
      }
      {columns.includes('duration') &&
        <td className={styles.totalSeen}>
          {totalDuration && firstSeenLive?.relative &&
            <span title={`This character has been streamed for ${totalDuration} since we first saw them ${firstSeenLive.relative}`}>{totalDuration}</span>
          }
        </td>
      }
    </tr>
  ), [
    character,
    columns,
    factionDestination,
    factionStyles,
    factionsToShow,
    firstSeenLive?.relative,
    lastSeenLive?.full,
    lastSeenLive?.relative,
    location.search,
    noStreamerLink,
    totalDuration,
    contactObscured,
    handleShowContact,
  ]);
}

type Comparator<T> = (lhs: T, rhs: T) => number;

type OrderedComparator<T> = (order: Order) => Comparator<T>;

const orderMultiplier = (order: Order) => order === 'asc' ? 1 : -1;

const characterStreamerComparator: OrderedComparator<CharacterInfo> = (order: Order) => (lhs: CharacterInfo, rhs: CharacterInfo) =>
  lhs.channelName.localeCompare(rhs.channelName) * orderMultiplier(order);

const characterTitleComparator: OrderedComparator<CharacterInfo> = (order: Order) => (lhs: CharacterInfo, rhs: CharacterInfo) => {
  if (lhs.displayInfo.titles.length > 0 && rhs.displayInfo.titles.length > 0) {
    return lhs.displayInfo.titles.join(',').localeCompare(rhs.displayInfo.titles.join(',')) * orderMultiplier(order);
  } else if (lhs.displayInfo.titles.length > 0) {
    return -1;
  } else if (rhs.displayInfo.titles.length > 0) {
    return 1;
  }
  return 0;
}

const characterNameComparator: OrderedComparator<CharacterInfo> = (order: Order) => (lhs: CharacterInfo, rhs: CharacterInfo) =>
  lhs.displayInfo.realNames.join(' ').localeCompare(rhs.displayInfo.realNames.join(' ')) * orderMultiplier(order)

const characterNicknameComparator: OrderedComparator<CharacterInfo> = (order: Order) => (lhs: CharacterInfo, rhs: CharacterInfo) => {
  if (lhs.displayInfo.nicknames.length > 0 && rhs.displayInfo.nicknames.length > 0) {
    return lhs.displayInfo.nicknames.join(',').localeCompare(rhs.displayInfo.nicknames.join(',')) * orderMultiplier(order);
  } else if (lhs.displayInfo.nicknames.length > 0) {
    return -1;
  } else if (rhs.displayInfo.nicknames.length > 0) {
    return 1;
  }
  return 0;
}

const factionComparator: OrderedComparator<FactionInfo[]> = (order: Order) => (lhs: FactionInfo[], rhs: FactionInfo[]) => {
  if (lhs.length > 0 && rhs.length > 0) {
    return lhs.map(f => f.name).join(',').localeCompare(rhs.map(f => f.name).join(',')) * orderMultiplier(order)
  } else if (lhs.length > 0) {
    return -1;
  } else if (rhs.length > 0) {
    return 1;
  }
  return 0;
}

const characterFactionComparator: OrderedComparator<CharacterInfo> = (order: Order) => (lhs: CharacterInfo, rhs: CharacterInfo) =>
  factionComparator(order)(visibleFactions(lhs.factions), visibleFactions(rhs.factions));

const characterFormerFactionComparator: OrderedComparator<CharacterInfo> = (order: Order) => (lhs: CharacterInfo, rhs: CharacterInfo) =>
  factionComparator(order)(lhs.formerFactions, rhs.formerFactions);

const characterContactComparator: OrderedComparator<CharacterInfo> = (order: Order) => (lhs: CharacterInfo, rhs: CharacterInfo) => {
  if (lhs.contact && rhs.contact) {
    return lhs.contact.localeCompare(rhs.contact) * orderMultiplier(order);
  } else if (lhs.contact) {
    return -1;
  } else if (rhs.contact) {
    return 1;
  }
  return 0;
}

const characterLastSeenComparator: OrderedComparator<CharacterInfo> = (order: Order) => (lhs: CharacterInfo, rhs: CharacterInfo) => {
  if (lhs.lastSeenLive !== undefined && rhs.lastSeenLive !== undefined) {
    return lhs.lastSeenLive.localeCompare(rhs.lastSeenLive) * -1 * orderMultiplier(order)
  } else if (lhs.lastSeenLive !== undefined) {
    return -1;
  } else if (rhs.lastSeenLive !== undefined) {
    return 1;
  }
  return 0;
}

const characterDurationComparator: OrderedComparator<CharacterInfo> = (order: Order) => (lhs: CharacterInfo, rhs: CharacterInfo) => {
  if (lhs.totalSeenDuration !== undefined && rhs.totalSeenDuration !== undefined) {
    return (lhs.totalSeenDuration - rhs.totalSeenDuration) * orderMultiplier(order);
  } else if (lhs.totalSeenDuration !== undefined) {
    return -1;
  } else if (rhs.totalSeenDuration !== undefined) {
    return 1;
  }
  return 0;
}

const combinedComparator = (comparators: Comparator<CharacterInfo>[]): Comparator<CharacterInfo> =>
  comparators.reduce((combined, comparator) => (lhs: CharacterInfo, rhs: CharacterInfo) =>
    combined(lhs, rhs) || comparator(lhs, rhs)
  )

const characterComparator = (sort: Column, order: Order): Comparator<CharacterInfo> => {
  if (sort === 'streamer') {
    return combinedComparator([
      characterStreamerComparator(order),
      characterNameComparator(order),
    ]);
  }
  if (sort === 'title') {
    return combinedComparator([
      characterTitleComparator(order),
      characterNameComparator(order),
      characterStreamerComparator(order),
    ]);
  }
  if (sort === 'name') {
    return combinedComparator([
      characterNameComparator(order),
      characterStreamerComparator(order),
    ]);
  }
  if (sort === 'nickname') {
    return combinedComparator([
      characterNicknameComparator(order),
      characterNameComparator(order),
      characterStreamerComparator(order),
    ]);
  }
  if (sort === 'faction') {
    return combinedComparator([
      characterFactionComparator(order),
      characterNameComparator(order),
      characterStreamerComparator(order),
    ]);
  }
  if (sort === 'formerFaction') {
    return combinedComparator([
      characterFormerFactionComparator(order),
      characterNameComparator(order),
      characterStreamerComparator(order),
    ]);
  }
  if (sort === 'contact') {
    return combinedComparator([
      characterContactComparator(order),
      characterNameComparator(order),
      characterStreamerComparator(order),
    ]);
  }
  if (sort === 'lastSeen') {
    return combinedComparator([
      characterLastSeenComparator(order),
      characterStreamerComparator(order),
      characterNameComparator(order),
    ]);
  }
  if (sort === 'duration') {
    return combinedComparator([
      characterDurationComparator(order),
      characterStreamerComparator(swapOrder(order)),
      characterNameComparator(swapOrder(order)),
    ]);
  }

  // Not reachable, but just for a valid function…
  return characterStreamerComparator(order);
}

const sortFromState = (state: any): Column | undefined => {
  if (
    state
    && typeof state === 'object'
    && 'sort' in state
    && typeof state.sort === 'string'
    && (
      state.sort === 'streamer'
      || state.sort === 'title'
      || state.sort === 'name'
      || state.sort === 'nickname'
      || state.sort === 'faction'
      || state.sort === 'formerFaction'
      || state.sort === 'contact'
      || state.sort === 'lastSeen'
      || state.sort === 'duration'
    )
  ) {
    return state.sort;
  }
  return undefined;
};

const orderFromState = (state: any): Order | undefined => {
  if (
    state
    && typeof state === 'object'
    && 'order' in state
    && typeof state.order === 'string'
    && (
      state.order === 'asc'
      || state.order === 'desc'
    )
  ) {
    return state.order;
  }
  return undefined;
};

const defaultOrderForSort = (sort: Column) => sort === 'duration' ? 'desc' : 'asc';
const swapOrder = (order: Order) => order === 'asc' ? 'desc' : 'asc';

const CharactersTable: React.FunctionComponent<Props> = ({
  characters,
  columns = ['streamer', 'title', 'name', 'nickname', 'faction', 'contact', 'lastSeen', 'duration'],
  noInset = false,
  noStreamerLink = false,
  noHover = false,
  factionDestination = 'characters',
  defaultSort: [defaultSort, defaultOrder] = ['streamer', 'asc'],
  truncationLimit,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const sort = React.useMemo(() => (
    sortFromState(location.state) ?? defaultSort
  ), [location.state, defaultSort]);
  const order = React.useMemo(() => (
    orderFromState(location.state) ?? defaultOrder
  ), [location.state, defaultOrder]);
  const rum = useDatadogRum();

  const sortedCharacters = React.useMemo(() => (
    [...characters]
      .sort(characterComparator(sort, order))
  ), [characters, sort, order]);

  const visibleCharacters = React.useMemo(() => (
    sortedCharacters.slice(0, truncationLimit)
  ), [truncationLimit, sortedCharacters]);

  const handleSort = React.useCallback((newSort: Column) => () => {
    const newOrder = sort === newSort
      ? order === 'desc' ? 'asc' : 'desc'
      : defaultOrderForSort(newSort);
    navigate(location, {
      replace: true,
      state: {
        order: newOrder,
        sort: newSort
      }});
    rum.addAction(`Change character table sort to ${newSort} ${newOrder}`, {
      type: 'character-sort-change',
      order: newOrder,
      sort: newSort,
    });
  }, [sort, order, rum, navigate, location]);

  const SortableHeader: React.FC<{ sort: Column, children: React.ReactNode }> = React.useCallback(({ sort: thisSort, children }) => (
    sortedCharacters.length > 1
      ? (
        <span
          onClick={handleSort(thisSort)}
          className={classes(
            styles.sortableHeader,
            sort === thisSort && styles.current,
            ((sort === thisSort && order === 'desc')
              || (sort !== thisSort && defaultOrderForSort(thisSort) === 'desc'))
                && styles.desc,
            ((sort === thisSort && order === 'asc')
                || (sort !== thisSort && defaultOrderForSort(thisSort) === 'asc'))
                  && styles.asc,
          )}
        >
          {children}
        </span>
      )
      : <>{children}</>
  ), [sort, order, handleSort, sortedCharacters]);

  const showContactsColumn = useAuthorization('view-all-contacts');

  const [canShowContacts, setCanShowContacts] = React.useState(false);
  const [showingMetaAlert, setShowingMetaAlert] = React.useState(false);
  const [onMetaAlertApproval, setOnMetaAlertApproval] = React.useState<(() => void) | null>(null);
  const [suppressContactMetaAlert, setSuppressContactMetaAlert] = useLocalStorage('suppress-contact-meta-alert', false);

  const showMetaAlert = React.useCallback((onApprove: () => void) => {
    // Set using the updater function style to prevent `onApprove` from being called _as_ the updater function
    setOnMetaAlertApproval(() => onApprove);
    setShowingMetaAlert(true);
    rum.addAction(`Meta alert show`, {
      type: 'meta-alert-show',
      subtype: 'contact',
    });
  }, [rum]);

  const handleMetaDialogDismiss = React.useCallback((decision: MetaAlertDecision) => {
    if (decision === 'agree' || decision === 'agree-and-dont-show-again') {
      setCanShowContacts(true);
      onMetaAlertApproval?.();
      if (decision === 'agree-and-dont-show-again') {
        setSuppressContactMetaAlert(true);
      }
      rum.addAction(`Meta alert agree`, {
        type: 'meta-alert-agree',
        subtype: 'contact',
        remember: decision === 'agree-and-dont-show-again',
      });
    } else {
      rum.addAction(`Meta alert cancel`, {
        type: 'meta-alert-cancel',
        subtype: 'contact',
      });
    }
    setShowingMetaAlert(false);
  }, [onMetaAlertApproval, setSuppressContactMetaAlert, rum]);

  const finalColumns = React.useMemo(() => {
    return columns
      .filter((column) => {
        if (column === 'contact' && !showContactsColumn) {
          return false;
        }
        return true;
      });
  }, [columns, showContactsColumn]);

  return <>
    <div
      className={classes(
        styles.tableContainer,
        !noInset && 'inset'
      )}
    >
      <table className={classes(styles.table, noHover && styles.noHover)}>
        <thead>
          <tr>
          {finalColumns.includes('streamer') &&
            <th style={{ width: '20%' }}>
              <SortableHeader sort='streamer'>
                Streamer
              </SortableHeader>
            </th>
          }
          {finalColumns.includes('title') &&
            <th style={{ width: '10%' }}>
              <SortableHeader sort='title'>
                Titles
              </SortableHeader>
            </th>
          }
          {finalColumns.includes('name') &&
            <th style={{ width: '20%' }}>
              <SortableHeader sort='name'>
                Name
              </SortableHeader>
            </th>
          }
          {finalColumns.includes('nickname') &&
            <th style={{ width: '20%' }}>
              <SortableHeader sort='nickname'>
                <span
                  style={{
                    textDecoration: 'underline dotted',
                  }}
                  title="Nicknames are not only names that characters go by, but also names used in stream titles to identify which character is being played."
                >
                  Nicknames
                </span>
              </SortableHeader>
            </th>
          }
          {finalColumns.includes('faction') &&
            <th style={{ width: '10%' }}>
              <SortableHeader sort='faction'>
                Factions
              </SortableHeader>
            </th>
          }
          {finalColumns.includes('formerFaction') &&
            <th style={{ width: '10%' }}>
              <SortableHeader sort='formerFaction'>
                Former factions
              </SortableHeader>
            </th>
          }
          {finalColumns.includes('contact') &&
            <th style={{ width: '10%' }}>
              <SortableHeader sort='contact'>
                Telegram
              </SortableHeader>
            </th>
          }
          {finalColumns.includes('lastSeen') &&
            <th style={{ width: '10%' }}>
              <SortableHeader sort='lastSeen'>
                Last Seen
              </SortableHeader>
            </th>
          }
          {finalColumns.includes('duration') &&
            <th style={{ width: '10%' }}>
              <SortableHeader sort='duration'>
                <span
                  style={{
                    textDecoration: 'underline dotted',
                  }}
                  title="The total amount of time we’ve seen this character streamed. Hover over a duration to see when we started tracking this character."
                >
                  Time streamed
                </span>
              </SortableHeader>
            </th>
          }
          </tr>
        </thead>
        <tbody>
          {visibleCharacters && visibleCharacters.map(character =>
            <CharacterRow
              key={`${character.id}`}
              character={character}
              columns={finalColumns}
              noStreamerLink={noStreamerLink}
              factionDestination={factionDestination}
              canShowContacts={canShowContacts || (suppressContactMetaAlert ?? false)}
              requestContactVisibility={showMetaAlert}
            />
          )}
        </tbody>
      </table>
    </div>
    <MetaAlert show={showingMetaAlert} onHide={handleMetaDialogDismiss} />
  </>;
};

export default CharactersTable;

import { randomUUID } from 'crypto';
import { ApiClient, HelixPaginatedResult, HelixStream, HelixStreamType } from '@twurple/api';
import { DataSource, Not, In } from 'typeorm';
import { LiveResponse, Stream, CharacterInfo, UserResponse } from '@twrpo/types';

import {
    cloneDeepJson, mapObj,
    parseLookup, videoUrlOffset,
} from '../../utils';

import { getKnownTwitchUsers } from '../../pfps';

import { getCharacterInfo } from '../../characterUtils';
import { getFactionInfos } from '../../factionUtils';
import settingsParsed from '../../data/settingsParsed';
import factionsParsed from '../../data/factionsParsed';
import { wrpFactions } from '../../data/meta';
import { wrpCharacters as wrpCharactersOld } from '../../data/characters';
import {
    isFactionColor,
    lesserFactions,
    greaterFactions,
    wrpFactionsRegex,
    wrpFactionsSubRegex,
    filterFactionsBase,
} from '../../data/factions';
import { wrpPodcasts } from '../../data/podcasts';
import { fetchVideosForUser, fetchMissingThumbnailsForVideoIds } from '../../fetchVideos';
import { isGlobalEditor } from '../../userUtils';
import { parseServer, matchServer } from '../../matcher/server';
import { syncTracked, track } from '../../tracker';

import type { FactionMini, FactionFull, FactionRealMini, FactionRealFull } from '../../data/meta';
import type { Character as CharacterOld, WrpCharacters as WrpCharactersOld, AssumeOther } from '../../data/characters';
import type { WrpFactionsRegexMini, FactionColorsMini, FactionColorsRealMini } from '../../data/factions';
import type { Podcast } from '../../data/podcasts';
import type { TwitchUser } from '../../pfps';
import type { ParsedServer } from '../../matcher/server';
import type { Logger } from '../../logger';

import { StreamChunk } from '../../db/entity/StreamChunk';
import { Video } from '../../db/entity/Video';
import { TwitchChannel } from '../../db/entity/TwitchChannel';
import { Server } from '../../db/entity/Server';
import { StreamChunkStat } from '../../db/entity/StreamChunkStat';

const includedData = Object.assign(
    {},
    ...['minViewers', 'stopOnMin', 'intervalSeconds']
        .map(key => ({ [key]: (settingsParsed as any)[key] })),
    ...['useColorsDark', 'useColorsLight']
        .map(key => ({ [key]: (factionsParsed as any)[key] })),
    { wrpFactions }
);

interface Character extends Omit<CharacterOld, 'factions' | 'displayName' | 'assumeServer' | 'wlBias'> {
    factions: FactionRealMini[];
    factionsObj: { [key in FactionRealMini]?: true };
    factionUse: FactionColorsRealMini;
    displayName: string;
    displayFullName: string;
    nameReg: RegExp;
}

// A new type with some properties of T and some properties of T made optional
type Some<T, K extends keyof T, O extends keyof T> = Pick<T, K> & Partial<Pick<T, O>>;

type WrpCharacter = Character[] & { assumeChar?: Character; assumeOther: number; };

type WrpCharacters = { [key: string]: WrpCharacter };

const wrpCharacters = cloneDeepJson<WrpCharactersOld, WrpCharacters>(wrpCharactersOld);
const wrpRawCharacters = cloneDeepJson<WrpCharactersOld, WrpCharactersOld>(wrpCharactersOld);

const fullFactionMap: { [key in FactionMini]?: FactionFull } = {}; // Factions with corresponding characters

const displayNameDefault: { [key in FactionMini]?: number } = {
    law: 2,
} as const;

const FSTATES = {
    nopixel: 1,
    other: 2,
} as const;

const ASTATES = {
    assumeNpNoOther: -1,
    assumeNp: 0,
    assumeOther: 1,
    someOther: 1.5,
    neverNp: 2,
} as const;

const game = '493959' as const;
const languages: string[] = ['en', 'hi', 'no', 'pt']; // https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
const streamType: HelixStreamType = 'live';
const bigLimit = 100 as const;
const searchNumDefault = 2000;

const toFactionMini = (faction: string) => faction.toLowerCase().replaceAll(' ', '');

// Key: streamId + title;
const loggedServerMatcherMismatches: Set<string> = new Set();

/*

*****************************************************************************
***************************** PARSE CHARACTERS ******************************
*****************************************************************************

*/

for (const [streamer, characters] of Object.entries(wrpCharacters)) {
    const streamerLower = streamer.toLowerCase();
    const foundOthers: { [key in AssumeOther]?: boolean } = {};

    characters.forEach((char) => {
        const charOld = char as unknown as CharacterOld;
        const names = charOld.name.split(/\s+/);
        const nameRegAll = [];
        const parsedNames = [];
        const titles = [];
        const realNames = [];
        let knownName;
        let currentName = null;
        let displayNameNum = charOld.displayName;

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            let pushName;
            if (currentName != null) {
                currentName.push(name);
                if (name.includes(']') || name.includes('"')) {
                    pushName = currentName.join(' ');
                    const type1 = pushName.includes('[');
                    pushName = pushName.replace(/[\[\]"]/g, '');
                    if (type1) {
                        titles.push(pushName);
                    } else {
                        // had square
                        knownName = pushName; // had quotes
                    }
                    currentName = null;
                }
            } else if (name.includes('[') || name.includes('"')) {
                const type1 = name.includes('[');
                if ((type1 && name.includes(']')) || (!type1 && name.indexOf('"') !== name.lastIndexOf('"'))) {
                    pushName = name.replace(/[\[\]"]/g, '');
                    if (type1) {
                        titles.push(pushName);
                    } else {
                        knownName = pushName;
                    }
                } else {
                    currentName = [name];
                }
            } else {
                pushName = name.replace(/"/g, '');
                if (pushName !== name) knownName = pushName; // had quotes
                // realNames.push(pushName.replace(/([A-Z])\.\s*/g, '\1'));
                realNames.push(pushName.replace(/\./g, ''));
            }
            if (pushName) parsedNames.push(RegExp.escape(pushName.toLowerCase()));
            // Match both "J’Baas" (curly quote) and "J'Baas" (straight quote)
            if (pushName && /’/.test(pushName)) {
                parsedNames.push(RegExp.escape(pushName.replaceAll(/’/g, '\'').toLowerCase()));
            }
        }

        // Create displayFullName before augmenting `realNames` with nicknames
        char.displayFullName = realNames.join(' ');

        if (charOld.nicknames) {
            if (realNames.length === 1) realNames.push(realNames[0]);
            if (displayNameNum !== 0) realNames.push(...charOld.nicknames.filter(nck => typeof nck === 'string'));
            charOld.nicknames.forEach((nck) => {
                if (nck[0] === '/' && nck[nck.length - 1] === '/') {
                    nameRegAll.push(nck.substring(1, nck.length - 1));
                } else {
                    const nicknameKeywords = [...nck.matchAll(/"([^"]+)"/g)].map(result => result[1]);
                    const allNicknames: string[] = [];
                    if (nicknameKeywords.length > 0) {
                        allNicknames.push(...nicknameKeywords);
                    } else {
                        allNicknames.push(nck);
                    }
                    for (const nickname of allNicknames) {
                        parsedNames.push(RegExp.escape(nickname.toLowerCase()));
                        // Match both "J’Baas" (curly quote) and "J'Baas" (straight quote)
                        if (/’/.test(nickname)) {
                            parsedNames.push(RegExp.escape(nickname.replaceAll(/’/g, '\'').toLowerCase()));
                        }
                    }
                }
            });
        }

        const fullFactions: FactionRealFull[] = charOld.factions?.length ? charOld.factions : ['Independent'];
        char.factionsObj = {};
        char.factions = fullFactions.map((fullFaction) => {
            const miniFaction = toFactionMini(fullFaction) as FactionRealMini;
            if (!fullFactionMap[miniFaction]) fullFactionMap[miniFaction] = fullFaction;
            char.factionsObj[miniFaction] = true;
            return miniFaction;
        });
        const primaryFaction = char.factions[0];
        if (displayNameNum === undefined) displayNameNum = displayNameDefault[primaryFaction] ?? 1;

        const displayNameTitle = titles.length ? `《${titles.join(' ')}》` : '';
        let displayNameChar = '';
        if (knownName !== undefined) {
            displayNameChar = knownName;
            parsedNames.push(RegExp.escape(`${displayNameChar.toLowerCase()}s`));
        } else if (displayNameNum === 0) {
            displayNameChar = realNames.join(' ');
            parsedNames.push(RegExp.escape(`${realNames[0].toLowerCase()}s`));
        } else {
            displayNameChar = realNames[displayNameNum - 1] || realNames[0];
            parsedNames.push(RegExp.escape(`${displayNameChar.toLowerCase()}s`));
        }
        char.displayName = `${char.leader ? `♛${displayNameTitle ? '' : ' '}` : ''}${displayNameTitle}${displayNameChar}`.trim();

        nameRegAll.push(`\\b(?:${parsedNames.join('|')})\\b`);
        if (char.factions.includes('development') && streamerLower !== 'dwjft') { // Include regex for dev faction
            nameRegAll.push(wrpFactionsRegex.development.source);
        }
        char.nameReg = new RegExp(nameRegAll.join('|'), nameRegAll.length > 1 ? 'ig' : 'g');

        if (primaryFaction != null) {
            char.factionUse = isFactionColor(primaryFaction) ? primaryFaction : 'otherfaction';
        } else {
            char.factionUse = 'independent';
        }

        if (charOld.assume !== undefined) foundOthers[charOld.assume] = true;

        if (char.assumeChar && !characters.assumeChar) characters.assumeChar = char;
    });

    if (foundOthers.assumeNp && foundOthers.assumeOther) {
        characters.assumeOther = ASTATES.someOther;
    } else if (foundOthers.assumeOther) {
        characters.assumeOther = ASTATES.assumeOther;
    } else if (foundOthers.assumeNpNoOther) {
        characters.assumeOther = ASTATES.assumeNpNoOther;
    } else if (foundOthers.assumeNp) {
        characters.assumeOther = ASTATES.assumeNp;
    } else if (foundOthers.neverNp) {
        characters.assumeOther = ASTATES.neverNp;
    } else {
        characters.assumeOther = ASTATES.assumeNp;
    }

    if (streamer !== streamerLower) {
        wrpCharacters[streamerLower] = characters;
        delete wrpCharacters[streamer];
    }
}

for (const [streamer, characters] of Object.entries(wrpRawCharacters)) {
    const streamerLower = streamer.toLowerCase();
    if (streamer !== streamerLower) {
        wrpRawCharacters[streamerLower] = characters;
        delete wrpRawCharacters[streamer];
    }
}

const wrpFactionsRegexEntries = Object.entries(wrpFactionsRegex) as [WrpFactionsRegexMini, RegExp][];

const knownPfps: { [key: string]: string } = {};
const knownTwitchUsers: { [key: string]: TwitchUser } = {};
const unknownTwitchUsers: { [key: string]: TwitchUser } = {};

const getStreams = async (apiClient: ApiClient, dataSource: DataSource, logger: Logger): Promise<HelixStream[] | null> => {
    const knownUsers = await getKnownTwitchUsers(apiClient, dataSource, logger);
    knownUsers.forEach((user) => {
        knownPfps[user.id] = user.profilePictureUrl.replace('-300x300.', '-50x50.');
        knownTwitchUsers[user.id] = user;
    });

    let searchNum = searchNumDefault;

    const gtaStreamsObj: { [key: string]: HelixStream } = {};
    const gtaStreams: HelixStream[] = [];
    let after;
    try {
        while (searchNum > 0) {
            const limitNow = Math.min(searchNum, bigLimit);
            searchNum -= limitNow;
            const gtaStreamsNow: HelixPaginatedResult<HelixStream> = await apiClient.streams.getStreams({
                game,
                language: languages,
                limit: limitNow,
                type: streamType,
                after,
            });

            if (gtaStreamsNow.data.length === 0) {
                logger.info(`Search ended (limit: ${limitNow})`, gtaStreamsNow);
                break;
            }

            const lookupStreams = [];
            for (const helixStream of gtaStreamsNow.data) {
                const {
                    userId,
                    gameId,
                    gameName,
                    userDisplayName,
                    title,
                } = helixStream;
                if (gameId !== game) {
                    logger.notice(`Got stream for incorrect game for  ${userDisplayName}`, {
                        event: 'twitch-stream-fetch-wrong-game',
                        channel: userDisplayName,
                        streamTitle: title,
                        gameName,
                        gameId,
                        userId,
                    });
                    continue;
                }
                if (gtaStreamsObj[userId]) continue;
                gtaStreamsObj[userId] = helixStream;
                gtaStreams.push(helixStream);
                if (knownPfps[userId] === undefined) {
                    lookupStreams.push(userId);
                }
            }

            if (lookupStreams.length > 0) {
                logger.info(`Looking up pfp for ${lookupStreams.length} users after...`);
                const foundUsers = await apiClient.users.getUsersByIds(lookupStreams);
                for (const helixUser of foundUsers) {
                    knownPfps[helixUser.id] = helixUser.profilePictureUrl.replace('-300x300.', '-50x50.');
                    unknownTwitchUsers[helixUser.id] = {
                        id: helixUser.id,
                        login: helixUser.name,
                        displayName: helixUser.displayName,
                        profilePictureUrl: helixUser.profilePictureUrl,
                        createdAt: helixUser.creationDate,
                    };
                }
            }

            after = gtaStreamsNow.cursor;
        }
    } catch (error) {
        logger.warning('Failed to fetch streams', {
            event: 'twitch-stream-fetch-failed',
            error,
        });
        return null;
    }

    return gtaStreams;
};

type BaseStream = Pick<Stream, 'channelName' | 'channelTwitchId' | 'title' | 'viewers' | 'profileUrl' | 'streamId'>;

type FactionCount = { [key in FactionMini]: number };

interface InternalLiveResponse extends LiveResponse {
    fetchDate: Date;
}

let cachedResults: InternalLiveResponse | undefined;

let wrpStreamsPromise: Promise<InternalLiveResponse> | undefined;

const wrpPodcastReg: { podcast: Podcast, reg: RegExp }[] = wrpPodcasts.map((podcast) => {
    const nameAll = [podcast.name];
    const regAll: string[] = [];

    podcast.nicknames?.forEach((nck) => {
        if (nck[0] === '/' && nck[nck.length - 1] === '/') {
            regAll.push(nck.substr(1, nck.length - 1));
        } else {
            nameAll.push(RegExp.escape(nck.toLowerCase()));
        }
    });

    regAll.push(`\\b(?:${nameAll.join('|')})\\b`);

    const reg = new RegExp(regAll.join('|'), 'ig');

    return { podcast, reg };
});

const getWrpLive = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    logger: Logger,
    override = false
): Promise<InternalLiveResponse> => {
    if (!override && cachedResults !== undefined) {
        logger.info('Returning cached results.');
        return cachedResults;
    }

    const fetchID = randomUUID();
    const fetchStart = process.hrtime.bigint();
    logger.info('Started fetching live', { traceID: fetchID, event: 'start' });

    if (wrpStreamsPromise === undefined || override) {
        wrpStreamsPromise = new Promise<InternalLiveResponse>(async (resolve, reject) => {
            try {
                logger.info('Fetching streams data...');

                const now = new Date();
                const nowTime = +now;

                let gtaStreams: HelixStream[] | null = await getStreams(apiClient, dataSource, logger);
                if (gtaStreams === null) {
                    if (cachedResults) {
                        logger.warning('Failed to fetch streams, using previously-cached results');
                        resolve(cachedResults);
                        return;
                    }
                    logger.warning('Failed to fetch streams and had no cached results');
                    gtaStreams = [];
                }

                const fetchEnd = process.hrtime.bigint();
                logger.info(`Fetched ${gtaStreams.length} streams! Now processing data...`, {
                    traceID: fetchID,
                    event: 'fetched',
                    fetchTime: Number((fetchEnd - fetchStart) / BigInt(1e+6)),
                });

                let nextId = 0;
                const wrpStreams: Stream[] = [];
                const factionCount: FactionCount = mapObj(wrpFactions, () => 0);

                const newChunks: StreamChunk[] = [];
                const updatedChunks: StreamChunk[] = [];
                const newChannels: Omit<TwitchChannel, 'id' | 'createdAt' | 'lastVideoCheck' | 'isTracked' | 'isHidden'>[] = [];

                const wrpServer = parseServer(logger)(await dataSource.getRepository(Server).findOneOrFail({
                    where: {
                        key: 'wrp',
                        game: { twitchId: game },
                    },
                    relations: { regexes: true },
                }));

                const otherServers = (await dataSource
                    .getRepository(Server)
                    .createQueryBuilder('server')
                    .select()
                    .innerJoin('server.game', 'game')
                    .leftJoinAndSelect('server.regexes', 'regex')
                    .where('server.key IS NULL OR server.key != :key', { key: 'wrp' })
                    .andWhere('game.twitchId = :game', { game })
                    .orderBy('server.sortOrder', 'ASC')
                    .addOrderBy('server.name', 'ASC')
                    .getMany()).map(parseServer(logger));

                interface CharacterDuration {
                    streamerId: string,
                    serverId: number;
                    characterId: number;
                    duration: number;
                }

                const longestCharactersQueryBuilder = dataSource
                    .getRepository(StreamChunk)
                    .createQueryBuilder('stream_chunk')
                    .select('stream_chunk.streamerId', 'streamerId')
                    .addSelect('stream_chunk.serverId', 'serverId')
                    .addSelect('stream_chunk.characterId', 'characterId')
                    .addSelect('EXTRACT(\'epoch\' FROM SUM(stream_chunk.lastSeenDate - stream_chunk.firstSeenDate))::int', 'duration')
                    .where('stream_chunk.characterId IS NOT NULL')
                    .andWhere('stream_chunk.characterUncertain = false')
                    .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
                    .andWhere('stream_chunk.isHidden = false')
                    .groupBy('stream_chunk.serverId')
                    .addGroupBy('stream_chunk.characterId')
                    .addGroupBy('stream_chunk.streamerId')
                    .orderBy('duration', 'DESC');

                if (gtaStreams.length > 0) {
                    longestCharactersQueryBuilder
                        .andWhere('stream_chunk.streamerId IN (:...channelTwitchIds)', { channelTwitchIds: gtaStreams.map(s => s.userId) });
                }

                const rawLongestCharacters: CharacterDuration[] = await longestCharactersQueryBuilder.execute();

                // ServerID -> TwitchUserID -> CharacterDuration[] (ordered by duration, desc)
                const longestCharactersLookup: Record<number, Record<string, CharacterDuration[]>> = {};
                for (const duration of rawLongestCharacters) {
                    const { serverId, streamerId } = duration;
                    if (longestCharactersLookup[serverId] === undefined) {
                        longestCharactersLookup[serverId] = {};
                    }
                    if (longestCharactersLookup[serverId][streamerId] === undefined) {
                        longestCharactersLookup[serverId][streamerId] = [];
                    }
                    longestCharactersLookup[serverId][streamerId].push(duration);
                }

                for (const helixStream of gtaStreams) {
                    const { userDisplayName: channelName, title, viewers } = helixStream;

                    let mostRecentStreamSegment = await dataSource
                        .getRepository(StreamChunk)
                        .findOne({
                            where: {
                                streamerId: helixStream.userId,
                                streamId: helixStream.id,
                            },
                            order: {
                                lastSeenDate: 'desc',
                            },
                        });

                    // This is done here not as a WHERE clause so that we always
                    // compare against the most-recent segment, not just the
                    // most-recent segment with a matching title
                    if (mostRecentStreamSegment && (mostRecentStreamSegment.title !== title || mostRecentStreamSegment.gameTwitchId !== helixStream.gameId)) {
                        mostRecentStreamSegment = null;
                    }

                    const isOverridden = mostRecentStreamSegment !== null && mostRecentStreamSegment.isOverridden;

                    const baseStream: BaseStream = {
                        channelName,
                        channelTwitchId: helixStream.userId,
                        title,
                        viewers,
                        profileUrl: knownPfps[helixStream.userId],
                        streamId: helixStream.id,
                    };

                    const titleParsed = title.toLowerCase().replace(/\./g, ' ');
                    const channelNameLower = channelName.toLowerCase();

                    let onOther = false;
                    let onOtherIncluded = false;
                    let onOtherGeneric = false;
                    let serverName = '';
                    let matchedServer: ParsedServer | null = null;

                    let onNp = false;

                    if (mostRecentStreamSegment && isOverridden) {
                        if (mostRecentStreamSegment.serverId === wrpServer.id) {
                            matchedServer = wrpServer;
                            onNp = true;
                        } else {
                            const overriddenServer = otherServers.find(server => server.id === mostRecentStreamSegment!.serverId);
                            if (overriddenServer || mostRecentStreamSegment.serverId === null) {
                                onOther = true;
                                serverName = overriddenServer?.name ?? '';
                                matchedServer = overriddenServer ?? null;
                                if (overriddenServer !== undefined && overriddenServer.isVisible) {
                                    onOtherIncluded = true;
                                } else if (overriddenServer !== undefined && overriddenServer.isRoleplay) {
                                    onOtherGeneric = true;
                                }
                            } else {
                                logger.error('Found overriden server but unable to find matching server in databse', {
                                    segment: mostRecentStreamSegment,
                                    wrpServer,
                                    otherServers,
                                });
                                continue;
                            }
                        }
                    } else {
                        let onOtherPos = -1;

                        servers: // eslint-disable-line no-labels
                        for (const otherServer of otherServers) {
                            for (const otherRegex of otherServer.regexes) {
                                try {
                                    onOtherPos = title.indexOfRegex(otherRegex);
                                    if (onOtherPos > -1) {
                                        onOther = true;
                                        serverName = otherServer.name;
                                        matchedServer = otherServer;
                                        if (otherServer.isVisible) {
                                            onOtherIncluded = true;
                                        } else if (otherServer.isRoleplay) {
                                            onOtherGeneric = true;
                                        }
                                        break servers; // eslint-disable-line no-labels
                                    }
                                } catch (error) {
                                    if (error instanceof SyntaxError) {
                                        logger.error('Failed construct regex for server match', {
                                            server: otherServer,
                                            regex: otherRegex,
                                            error,
                                        });
                                    } else {
                                        throw error;
                                    }
                                }
                            }
                        }

                        for (const wrpRegex of wrpServer.regexes) {
                            try {
                                const onNpPos = title.indexOfRegex(wrpRegex);
                                if (onNpPos > -1 && (onOther === false || onNpPos < onOtherPos)) {
                                    onNp = true;
                                    onOther = false;
                                    onOtherIncluded = false;
                                    matchedServer = wrpServer;
                                    break;
                                }
                            } catch (error) {
                                if (error instanceof SyntaxError) {
                                    logger.error('Failed construct regex for server match', {
                                        server: wrpServer,
                                        regex: wrpRegex,
                                        error,
                                    });
                                } else {
                                    throw error;
                                }
                            }
                        }

                        // Perform a match with the new server matcher and compare
                        // results. If they differ, log a warning.
                        (() => {
                            const testMatchedServer = matchServer(title, [wrpServer, ...otherServers]);
                            const testOnOther = testMatchedServer !== null && testMatchedServer.id !== wrpServer.id;
                            const testOnOtherIncluded = testOnOther && testMatchedServer.isVisible;
                            const testOnOtherGeneric = testOnOther && !testOnOtherIncluded && testMatchedServer.isRoleplay;
                            const testServerName = testOnOther ? testMatchedServer.name : '';
                            const testOnNp = testMatchedServer !== null && testMatchedServer.id === wrpServer.id;

                            if (
                                testMatchedServer?.id !== matchedServer?.id
                                || testOnOther !== onOther
                                || testOnOtherIncluded !== onOtherIncluded
                                || testOnOtherGeneric !== onOtherGeneric
                                || testServerName !== serverName
                                || testOnNp !== onNp
                            ) {
                                const logKey = helixStream.id + title;
                                if (!loggedServerMatcherMismatches.has(logKey)) {
                                    logger.warning('Mismatch in new server matcher', {
                                        event: 'matcher-mismatch',
                                        subevent: 'server-matcher-mismatch',
                                        channelName,
                                        streamTitle: title,

                                        testMatchedServer,
                                        matchedServer,

                                        testOnOther,
                                        onOther,

                                        testOnOtherIncluded,
                                        onOtherIncluded,

                                        testOnOtherGeneric,
                                        onOtherGeneric,

                                        testServerName,
                                        serverName,

                                        testOnNp,
                                        onNp,
                                    });
                                    loggedServerMatcherMismatches.add(logKey);
                                }
                            }
                        })();
                    }

                    const characters = wrpCharacters[channelNameLower] as WrpCharacter | undefined;

                    if (characters && characters.assumeOther === ASTATES.neverNp) {
                        logger.info(`Excluded ${channelName} because of "neverNp"`);
                        continue;
                    }

                    let serverUncertain = false;
                    const mainsOther = characters && characters.assumeOther == ASTATES.assumeOther;
                    const keepNp = characters && characters.assumeOther == ASTATES.assumeNpNoOther;
                    const onMainOther = !onNp && mainsOther;
                    const npStreamer = onNp || characters;

                    let streamState; // remove, mark-np, mark-other
                    if ((npStreamer && !mainsOther && !keepNp && onOther)) {
                        // If is-including-others and streamer on another server, or it's an NP streamer playing another server
                        streamState = FSTATES.other;
                    } else if ((onOtherIncluded || onMainOther || (npStreamer && onOther))) {
                        streamState = FSTATES.other;
                    } else if (onOtherGeneric) {
                        // Other server, but not a named server
                        streamState = FSTATES.other;
                        serverName = '';
                    } else if (npStreamer && !onMainOther && !onOther) {
                        // If NoPixel streamer that isn't on another server
                        streamState = FSTATES.nopixel;
                        serverName = 'WRP';
                        serverUncertain = (matchedServer?.id !== wrpServer.id);
                        matchedServer = wrpServer;
                    } else {
                        continue;
                    }

                    const hasCharacters = characters && characters.length;

                    let stream: Omit<Stream, 'segmentId'>;
                    let characterId: number | null;
                    let characterUncertain: boolean;

                    if (streamState === FSTATES.other) {
                        // Other included RP servers
                        stream = {
                            id: nextId,
                            ...baseStream,
                            rpServer: serverName.length ? serverName : null,
                            serverId: matchedServer?.id ?? null,
                            characterName: null,
                            characterDisplayName: null,
                            characterUncertain: null,
                            characterId: null,
                            characterContact: null,
                            nicknameLookup: null,
                            faction: 'other',
                            factions: ['other'],
                            factionsMap: { other: true },
                            tagText: serverName.length > 0 ? `::${serverName}::` : '::Other Server::',
                            tagFaction: 'other',
                            thumbnailUrl: helixStream.thumbnailUrl,
                            startDate: helixStream.startDate.toISOString(),
                            isHidden: false,
                        };
                        characterId = null;
                        characterUncertain = false;

                        factionCount.other++;
                    } else {
                        let nowCharacter: Character | undefined;

                        if (hasCharacters) {
                            if (isOverridden) {
                                if (mostRecentStreamSegment?.characterId) {
                                    nowCharacter = characters.find(c => c.id === mostRecentStreamSegment?.characterId);
                                }
                                logger.info(`Found override for ${channelName} to character ${nowCharacter ? `"${nowCharacter.name}"` : '(NULL)'}`, {
                                    event: 'stream-override',
                                    channel: channelName,
                                    streamTitle: title,
                                    character: nowCharacter?.name ?? null,
                                });
                            } else {
                                let lowestPos = Infinity;
                                let maxResults = -1;
                                let maxSize = -1;
                                for (const char of characters) {
                                    const matchPositions = [...titleParsed.matchAll(char.nameReg)];
                                    const numResults = matchPositions.length;
                                    const resSize = numResults > 0 ? matchPositions[0][0].length : -1; // Could use all matches, but more expensive
                                    const devFactionWeight = char.factions[0] === 'development' ? 2e4 : 0;
                                    const lowIndex = numResults ? matchPositions[0].index! + devFactionWeight : -1;
                                    if (lowIndex > -1 && (
                                        lowIndex < lowestPos
                                        || (lowIndex === lowestPos && numResults > maxResults)
                                        || (lowIndex === lowestPos && numResults === maxResults && resSize > maxSize)
                                    )) {
                                        lowestPos = lowIndex;
                                        maxResults = numResults;
                                        maxSize = resSize;
                                        nowCharacter = char;
                                    }
                                }
                            }
                        }

                        const takeoverFactions: FactionMini[] = ['podcast', 'watchparty'];
                        let hasTitleTakeoverFaction = false;

                        let factionNames: FactionRealMini[] = [];
                        const factionsInTitle: FactionRealMini[] = [];
                        let newCharFactionSpotted = false;

                        interface FactionObj {
                            rank1: number;
                            rank2: number;
                            rank3: number;
                            index: number;
                            factions: FactionRealMini[];
                            character?: Character;
                        }
                        const factionObjects: FactionObj[] = [];

                        for (const [faction, regex] of wrpFactionsRegexEntries) {
                            const matchPos = title.indexOfRegex(regex);
                            if (matchPos > -1) {
                                const isTakeoverFaction = takeoverFactions.includes(faction);
                                if (isTakeoverFaction && !isOverridden) {
                                    hasTitleTakeoverFaction = true;
                                }
                                if (nowCharacter && !isTakeoverFaction) {
                                    factionsInTitle.push(faction);
                                } else {
                                    const factionCharacter = characters && characters.find(char => char.factionsObj[faction]);
                                    const factionObj: FactionObj = {
                                        rank1: greaterFactions[faction] ? 0 : 1,
                                        rank2: factionCharacter ? 0 : 1,
                                        rank3: !lesserFactions[faction] ? 0 : 1,
                                        index: matchPos,
                                        factions: factionCharacter ? factionCharacter.factions : [faction],
                                        character: factionCharacter,
                                    };
                                    factionObjects.push(factionObj);
                                }
                            }
                        }

                        if (nowCharacter && !hasTitleTakeoverFaction) {
                            if (factionsInTitle.length > 0) {
                                const charFactionsMap = Object.assign({}, ...nowCharacter.factions.map(faction => ({ [faction]: true })));
                                for (const faction of factionsInTitle) {
                                    if (!charFactionsMap[faction] && !(charFactionsMap.medical)) {
                                        newCharFactionSpotted = true;
                                        break;
                                    }
                                }
                            }
                        } else if (factionObjects.length) {
                            factionObjects.sort((a, b) => a.rank1 - b.rank1 || a.rank2 - b.rank2 || a.rank3 - b.rank3 || a.index - b.index);
                            if (factionObjects[0].character && !isOverridden) nowCharacter = factionObjects[0].character; // Sorted by has-character
                            factionNames = factionObjects.map(factionObj => factionObj.factions).flat(1);
                        }

                        const hasFactions = factionNames.length;

                        let possibleCharacter = nowCharacter;
                        if (!isOverridden && !nowCharacter && !hasFactions && hasCharacters) {
                            if (characters.assumeChar) {
                                nowCharacter = characters.assumeChar;
                                possibleCharacter = nowCharacter;
                            } else {
                                // If we have one, use the most-streamed character as the guess
                                let foundLongest = false;
                                const longestCharacters = longestCharactersLookup[wrpServer.id]?.[helixStream.userId];
                                if (longestCharacters) {
                                    for (const longest of longestCharacters) {
                                        const char = characters.find(c => c.id === longest.characterId);
                                        if (char !== undefined && char.assumeChar !== false && char.deceased !== true) {
                                            possibleCharacter = char;
                                            foundLongest = true;
                                            if (char.id !== characters[0].id) {
                                                // eslint-disable-next-line max-len
                                                logger.info(`Guessing character "${char.name}" (${char.id}) instead of "${characters[0].name}" (${characters[0].id}) based on previous stream duration`, {
                                                    event: 'longest-character-guess',
                                                    channel: channelName,
                                                    streamTitle: title,
                                                    longestCharacters,
                                                });
                                            }
                                            break;
                                        }
                                    }
                                }
                                if (!foundLongest) {
                                    possibleCharacter = characters[0];
                                }
                            }
                        }

                        if (hasTitleTakeoverFaction || (isOverridden && mostRecentStreamSegment?.characterUncertain)) {
                            possibleCharacter = nowCharacter;
                            nowCharacter = undefined;
                        }

                        let hasFactionsTagText;
                        if (!isOverridden && !nowCharacter && hasFactions && factionNames[0] in wrpFactionsSubRegex) {
                            for (const [tagText, tagReg] of wrpFactionsSubRegex[factionNames[0]]!) {
                                if (tagReg.test(title)) {
                                    hasFactionsTagText = tagText;
                                    break;
                                }
                            }
                        }

                        let activeFactions: FactionMini[];
                        let tagFaction: FactionColorsMini;
                        let tagText;

                        if (nowCharacter) {
                            activeFactions = [...nowCharacter.factions];
                            tagFaction = nowCharacter.factionUse;
                            tagText = nowCharacter.displayName;
                        } else if (hasFactions && !isOverridden) {
                            activeFactions = [...factionNames, 'guessed'];
                            tagFaction = isFactionColor(factionNames[0]) ? factionNames[0] : 'independent';
                            const factionNameFull = fullFactionMap[factionNames[0]] || factionNames[0];
                            tagText = hasFactionsTagText ? `〈${hasFactionsTagText}〉` : `〈${factionNameFull}〉`;
                            if (tagFaction === 'podcast' || tagFaction === 'watchparty') {
                                const podcast = wrpPodcastReg.find(({ reg }) => reg.test(title))?.podcast;
                                tagText = `《${factionNameFull}》${podcast ? podcast.name : channelName}`;
                            }
                        } else if (possibleCharacter) {
                            activeFactions = [...possibleCharacter.factions, 'guessed'];
                            tagFaction = possibleCharacter.factionUse;
                            tagText = `? ${possibleCharacter.displayName} ?`;
                        } else {
                            activeFactions = ['otherwrp'];
                            tagFaction = 'otherwrp';
                            tagText = `${serverName}`;
                        }

                        if (newCharFactionSpotted) activeFactions.push('guessed');

                        characterId = possibleCharacter?.id ?? null;
                        characterUncertain = possibleCharacter !== undefined && nowCharacter === undefined;
                        stream = {
                            id: nextId,
                            ...baseStream,
                            rpServer: serverName,
                            serverId: wrpServer.id,
                            characterName: possibleCharacter?.name ?? null,
                            characterDisplayName: possibleCharacter?.displayFullName ?? null,
                            characterUncertain,
                            characterContact: possibleCharacter?.telegram ?? null,
                            characterId,
                            nicknameLookup: possibleCharacter?.nicknames ? possibleCharacter.nicknames.map(nick => parseLookup(nick)).join(' _-_ ') : null,
                            faction: activeFactions[0],
                            factions: activeFactions,
                            factionsMap: Object.assign({}, ...activeFactions.map(faction => ({ [faction]: true }))),
                            tagText,
                            tagFaction,
                            thumbnailUrl: helixStream.thumbnailUrl,
                            startDate: helixStream.startDate.toISOString(),
                            isHidden: mostRecentStreamSegment?.isHidden ?? false,
                        };

                        logger.info(`Found stream for ${channelName} with tag "${stream.tagText}"`, {
                            event: 'stream',
                            traceID: fetchID,
                            channel: channelName,
                            stream,
                        });

                        for (const faction of activeFactions) factionCount[faction]++;
                        factionCount.allwildrp++;
                    }

                    const chunk: Omit<StreamChunk, 'id' | 'isOverridden' | 'isHidden'> = {
                        serverId: matchedServer?.id ?? null,
                        streamerId: helixStream.userId,
                        characterId,
                        characterUncertain,
                        serverUncertain,
                        streamId: helixStream.id,
                        streamStartDate: helixStream.startDate,
                        title: helixStream.title,
                        firstSeenDate: now,
                        lastSeenDate: now,
                        lastViewerCount: helixStream.viewers,
                        gameTwitchId: helixStream.gameId,
                        isLive: true,
                    };

                    let segmentId: number;
                    if (mostRecentStreamSegment) {
                        const { id } = mostRecentStreamSegment;
                        const { lastSeenDate, lastViewerCount, isLive } = chunk;
                        const chunkUpdate: Some<StreamChunk,
                        'id' | 'lastSeenDate' | 'lastViewerCount' | 'isLive', 'characterId' |
                        'characterUncertain' | 'serverId' | 'serverUncertain'> = {
                            id,
                            lastSeenDate,
                            lastViewerCount,
                            isLive,
                        };
                        if (!mostRecentStreamSegment.isOverridden) {
                            chunkUpdate.serverId = chunk.serverId;
                            chunkUpdate.serverUncertain = chunk.serverUncertain;
                            chunkUpdate.characterId = chunk.characterId;
                            chunkUpdate.characterUncertain = chunk.characterUncertain;
                        }

                        try {
                            const appliedUpdate = { ...chunkUpdate };
                            await dataSource
                                .getRepository(StreamChunk)
                                .save(chunkUpdate);

                            updatedChunks.push({
                                ...mostRecentStreamSegment,
                                ...appliedUpdate,
                            });
                            segmentId = mostRecentStreamSegment.id;
                        } catch (error) {
                            logger.error('Failed to update chunk', {
                                chunkUpdate,
                                error,
                            });
                            continue;
                        }
                    } else {
                        try {
                            const newChunk = await dataSource
                                .getRepository(StreamChunk)
                                .save(chunk);
                            newChunks.push(newChunk);
                            segmentId = newChunk.id;
                        } catch (error) {
                            logger.error('Failed to insert chunk', {
                                chunk,
                                error,
                            });
                            continue;
                        }
                    }

                    if (helixStream.userId in unknownTwitchUsers) {
                        const u = unknownTwitchUsers[helixStream.userId];
                        delete unknownTwitchUsers[helixStream.userId];
                        newChannels.push({
                            twitchId: u.id,
                            twitchLogin: u.login,
                            displayName: u.displayName,
                            profilePhotoUrl: u.profilePictureUrl,
                            twitchCreatedAt: u.createdAt,
                        });
                    }

                    nextId++;
                    const fullStream: Stream = { ...stream, segmentId };
                    wrpStreams.push(fullStream);
                }

                const allChunks = [...newChunks, ...updatedChunks];

                try {
                    const liveChunkIds = allChunks.map(c => c.id);
                    const noLongerLiveResult = await dataSource
                        .getRepository(StreamChunk)
                        .update(
                            {
                                isLive: true,
                                id: liveChunkIds.length > 0 ? Not(In(liveChunkIds)) : undefined,
                                gameTwitchId: game,
                            },
                            { isLive: false }
                        );

                    if (!process.env.DISABLE_VIEWER_STATS) {
                        const insertedStats = await dataSource
                            .getRepository(StreamChunkStat)
                            .insert(allChunks.map(c => ({
                                streamChunkId: c.id,
                                time: now,
                                viewerCount: c.lastViewerCount,
                            })));

                        logger.info(`Stored ${insertedStats.identifiers.length} stream chunk stats to database`, {
                            event: 'segment-stat-insert',
                            count: insertedStats.identifiers.length,
                        });
                    }

                    logger.info(`Updated ${updatedChunks.length} streams in database`, {
                        event: 'segment-update',
                        count: updatedChunks.length,
                    });

                    logger.info(`Stored ${newChunks.length} new streams to database`, {
                        event: 'segment-insert',
                        count: newChunks.length,
                    });

                    logger.info(`Updated ${noLongerLiveResult.affected ?? 0} streams to no longer be live`, {
                        event: 'segment-update-not-live',
                        count: noLongerLiveResult.affected ?? 0,
                    });

                    if (newChannels.length) {
                        const result = await dataSource
                            .getRepository(TwitchChannel)
                            .upsert(newChannels, {
                                conflictPaths: ['twitchId'],
                                skipUpdateIfNoValuesChanged: true,
                            });
                        const updateCount = result.identifiers.reduce((count, id) => (
                            id ? count + 1 : count
                        ), 0);
                        if (updateCount) {
                            logger.info(`Updated ${updateCount} twitch channels in database`, {
                                event: 'channel-update',
                                count: updateCount,
                            });
                        }
                        Object.assign(
                            knownTwitchUsers,
                            Object.fromEntries(newChannels.map(c => [c.twitchId, c]))
                        );
                    }

                    const liveStreamIds = allChunks.map(c => c.streamId);

                    // Fetch any missing thumbnails from streams that just went offline
                    const recentVideosMissingThumbnailsQueryBuilder = dataSource.getRepository(Video)
                        .createQueryBuilder('video')
                        .select()
                        .distinctOn(['video.videoId'])
                        .innerJoin(StreamChunk, 'stream_chunk', 'video.streamId = stream_chunk.streamId')
                        .where('stream_chunk.lastSeenDate >= :cutoff', { cutoff: new Date(now.getTime() - 1000 * 60 * 10) })
                        .andWhere('video.thumbnailUrl IS NULL')
                        .orderBy('video.videoId', 'ASC');

                    if (liveStreamIds.length > 0) {
                        recentVideosMissingThumbnailsQueryBuilder
                            .andWhere('stream_chunk.streamId NOT IN (:...liveStreamIds)', { liveStreamIds });
                    }
                    const recentVideosMissingThumbnails = await recentVideosMissingThumbnailsQueryBuilder.getMany();

                    if (recentVideosMissingThumbnails.length) {
                        await fetchMissingThumbnailsForVideoIds(apiClient, dataSource, logger, recentVideosMissingThumbnails.map(v => v.videoId));
                    } else {
                        logger.info('No recent videos missing thumbnails', {
                            event: 'video-thumbnail-skip',
                        });
                    }

                    // Fetch videos for users who just went offline
                    const chunksToFetchQueryBuilder = dataSource.getRepository(StreamChunk)
                        .createQueryBuilder('stream_chunk')
                        .select()
                        .distinctOn(['stream_chunk.streamId'])
                        .leftJoin(Video, 'video', 'video.streamId = stream_chunk.streamId')
                        .where('video.id IS NULL')
                        .andWhere('stream_chunk.lastSeenDate >= :cutoff', { cutoff: new Date(now.getTime() - 1000 * 60 * 10) })
                        // Only fetch videos for the game we’re fetching. (Let
                        // other videos get scooped up by the video fetch job)
                        .andWhere('stream_chunk.gameTwitchId = :game', { game })
                        .orderBy('stream_chunk.streamId', 'ASC');
                    if (liveStreamIds.length > 0) {
                        chunksToFetchQueryBuilder
                            .andWhere('stream_chunk.streamId NOT IN (:...liveStreamIds)', { liveStreamIds });
                    }

                    const chunksToFetch = await chunksToFetchQueryBuilder.getMany();

                    const streamIds = new Set(chunksToFetch.map(c => c.streamId));
                    const streamerIds = [...new Set(chunksToFetch.map(c => c.streamerId))];

                    if (streamerIds.length) {
                        let foundVideos = 0;
                        for (const streamerId of streamerIds) {
                            try {
                                foundVideos += await fetchVideosForUser(apiClient, dataSource, logger, streamerId, streamIds);
                            } catch (error) {
                                logger.warning(`Failed to fetch videos for user ${streamerId}`, {
                                    event: 'twitch-user-video-fetch',
                                    error,
                                });
                            }
                        }
                        logger.info(`Fetched videos for ${streamerIds.length} users, found ${foundVideos} videos`, {
                            event: 'video-end',
                            userCount: streamerIds.length,
                            foundVideos,
                        });
                    } else {
                        logger.info('No recent stream segments to fetch videos for', {
                            event: 'video-skip',
                        });
                    }
                } catch (error) {
                    logger.error('Failed to store streams to db', { error });
                }

                factionCount.alltwitch = gtaStreams.length;

                const filterFactions = (cloneDeepJson(filterFactionsBase) as typeof filterFactionsBase)
                    .sort((dataA, dataB) => {
                        const countA = factionCount[dataA[0]] || 0;
                        const countB = factionCount[dataB[0]] || 0;
                        if (countA === countB) return 0;
                        if (countA === 0) return 1;
                        if (countB === 0) return -1;
                        return 0;
                    });

                for (const data of filterFactions) {
                    data[2] = factionCount[data[0]] !== 0;
                }

                const recentlyOnlineCharacters: CharacterInfo[] = [];
                try {
                    const distinctCharacters = dataSource
                        .getRepository(StreamChunk)
                        .createQueryBuilder('stream_chunk')
                        .select('stream_chunk.streamerId', 'streamer_id')
                        .addSelect('stream_chunk.serverId', 'server_id')
                        .addSelect('stream_chunk.characterId', 'character_id')
                        .addSelect('stream_chunk.streamStartDate', 'stream_start_date')
                        .addSelect('stream_chunk.streamId', 'stream_id')
                        .addSelect('MIN(stream_chunk.firstSeenDate)', 'first_seen_date')
                        .addSelect('MAX(stream_chunk.lastSeenDate)', 'last_seen_date')
                        .addSelect('MAX(stream_chunk.id)', 'id')
                        .addSelect(`
                            jsonb_agg(
                                jsonb_build_object(
                                  'title', stream_chunk.title,
                                  'start', stream_chunk.firstSeenDate,
                                  'end', stream_chunk.lastSeenDate)
                              )
                        `, 'spans')
                        .distinctOn(['stream_chunk.serverId', 'stream_chunk.characterId'])
                        .innerJoin(Server, 'server', 'server.id = stream_chunk.serverId')
                        .where('server.key = \'wrp\'')
                        .andWhere('stream_chunk.characterId IS NOT NULL')
                        .andWhere('stream_chunk.characterUncertain = false')
                        .andWhere(
                            'stream_chunk.lastSeenDate > (current_timestamp at time zone \'UTC\' - make_interval(hours => 12))'
                        )
                        .andWhere(
                            'stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)'
                        )
                        .groupBy('stream_chunk.serverId')
                        .addGroupBy('stream_chunk.streamerId')
                        .addGroupBy('stream_chunk.streamId')
                        .addGroupBy('stream_chunk.characterId')
                        .addGroupBy('stream_chunk.streamStartDate')
                        .orderBy('server_id', 'ASC')
                        .addOrderBy('character_id', 'ASC')
                        .addOrderBy('last_seen_date', 'DESC');

                    const liveCharacterIds = allChunks.flatMap(c => (c.characterId ? [c.characterId] : []));
                    if (liveCharacterIds.length) {
                        distinctCharacters.andWhere(
                            'stream_chunk.characterId NOT IN (:...ids)',
                            { ids: liveCharacterIds }
                        );
                    }

                    interface AggregateChunk {
                        mostRecentSegmentId: number;
                        serverId: number;
                        streamerId: string;
                        characterId: number;
                        streamId: string;
                        streamStartDate: Date;
                        firstSeenDate: Date;
                        lastSeenDate: Date;
                        spans: { title: string, start: string, end: string }[];
                        videoUrl: string | null;
                        videoThumbnailUrl: string | null;
                    }

                    const recentChunks = await dataSource
                        .createQueryBuilder()
                        .select('recent_chunk.id', 'mostRecentSegmentId')
                        .addSelect('recent_chunk.server_id', 'serverId')
                        .addSelect('recent_chunk.streamer_id', 'streamerId')
                        .addSelect('recent_chunk.character_id', 'characterId')
                        .addSelect('recent_chunk.stream_id', 'streamId')
                        .addSelect('recent_chunk.stream_start_date', 'streamStartDate')
                        .addSelect('recent_chunk.first_seen_date', 'firstSeenDate')
                        .addSelect('recent_chunk.last_seen_date', 'lastSeenDate')
                        .addSelect('recent_chunk.spans', 'spans')
                        .addSelect('video.url', 'videoUrl')
                        .addSelect('video.thumbnailUrl', 'videoThumbnailUrl')
                        .from(`(${distinctCharacters.getQuery()})`, 'recent_chunk')
                        .leftJoin(Video, 'video', 'video.streamId = recent_chunk.stream_id')
                        .setParameters(distinctCharacters.getParameters())
                        .orderBy('recent_chunk.last_seen_date', 'DESC')
                        .addOrderBy('recent_chunk.streamer_id')
                        .execute() as AggregateChunk[];

                    const factions = getFactionInfos(factionCount);
                    const factionMap = Object.fromEntries(factions.map(f => [f.key, f]));

                    recentChunks.forEach((chunk) => {
                        let { videoUrl } = chunk;
                        if (!chunk.streamerId || !chunk.characterId || !chunk.lastSeenDate) {
                            logger.warning('Missing required properties on recent stream segment', {
                                segment: chunk,
                            });
                            return;
                        }
                        const knownUser = knownTwitchUsers[chunk.streamerId];
                        if (!knownUser) return;
                        const channelNameLower = knownUser.displayName.toLowerCase();
                        const characters = wrpRawCharacters[channelNameLower];
                        const character = characters.find(c => c.id === chunk.characterId);
                        if (!character) return;

                        if (videoUrl) {
                            const start = chunk.streamStartDate;
                            const firstSeen = chunk.firstSeenDate;

                            videoUrl = videoUrlOffset(videoUrl, start, firstSeen);
                        }

                        recentlyOnlineCharacters.push({
                            ...getCharacterInfo(
                                knownUser.displayName,
                                character,
                                knownUser,
                                factionMap
                            ),
                            lastSeenLive: chunk.lastSeenDate.toISOString(),
                            lastSeenTitle: chunk.spans[0]?.title,
                            lastSeenVideoUrl: videoUrl ?? undefined,
                            lastSeenVideoThumbnailUrl: chunk.videoThumbnailUrl ?? undefined,
                            lastSeenSegmentId: chunk.mostRecentSegmentId,
                        });
                    });
                } catch (error) {
                    logger.error('Failed to load recent characters', { error });
                }

                // logger.info(filterFactions);

                const result: InternalLiveResponse = {
                    ...includedData,
                    factionCount,
                    filterFactions,
                    streams: wrpStreams,
                    tick: nowTime,
                    fetchDate: now,
                    recentOfflineCharacters: recentlyOnlineCharacters.length
                        ? recentlyOnlineCharacters
                        : undefined,
                };

                // logger.debug('npStreamsFb', npStreamsFb);

                cachedResults = result;
                const parseEnd = process.hrtime.bigint();
                logger.info('Done fetching streams data!', {
                    traceID: fetchID,
                    event: 'done',
                    factionCount,
                    parseTime: Number((parseEnd - fetchEnd) / BigInt(1e+6)),
                    totalTime: Number((parseEnd - fetchStart) / BigInt(1e+6)),
                    factionViewerCount: wrpStreams.reduce<Record<string, number>>((viewers, stream) => (
                        Object.entries(stream.factionsMap).filter(([_, v]) => v).reduce((innerViewers, [faction, _]) => {
                            innerViewers[faction] = (innerViewers[faction] ?? 0) + stream.viewers;
                            return innerViewers;
                        }, viewers)
                    ), {}),
                    serverViewerCount: wrpStreams.reduce<Record<string, number>>((viewers, stream) => {
                        if (stream.rpServer) {
                            viewers[stream.rpServer] = (viewers[stream.rpServer] ?? 0) + stream.viewers;
                        }
                        return viewers;
                    }, {}),
                });
                resolve(result);
            } catch (err) {
                const parseEnd = process.hrtime.bigint();
                logger.error('Failed to fetch streams data', {
                    traceID: fetchID,
                    event: 'failed',
                    error: err,
                    totalTime: Number((parseEnd - fetchStart) / BigInt(1e+6)),
                });
                reject(err);
            }
        });
    } else {
        logger.info('Waiting for wrpStreamsPromise...');
    }

    await wrpStreamsPromise;

    logger.info('Got data!');

    return cachedResults!;
};

export const getFilteredWrpLive = async (apiClient: ApiClient, dataSource: DataSource, logger: Logger, currentUser: UserResponse): Promise<LiveResponse> => {
    const { streams, ...rest } = await getWrpLive(apiClient, dataSource, logger);
    const isEditor = isGlobalEditor(currentUser);
    return {
        streams: streams
            .filter(s => !s.isHidden || isEditor),
        ...rest,
    };
};

export const forceWrpLiveRefresh = async (apiClient: ApiClient, dataSource: DataSource, logger: Logger): Promise<void> => {
    await getWrpLive(apiClient, dataSource, logger, true);
};

export const getWrpStreams = async (apiClient: ApiClient, dataSource: DataSource, logger: Logger, override = false): Promise<Stream[]> => {
    const live = await getWrpLive(apiClient, dataSource, logger, override);
    return live.streams;
};

export type IntervalTimeout = ReturnType<typeof setInterval>;

const logAPIStats = (apiClient: ApiClient, logger: Logger) =>
    logger.info(`${apiClient.lastKnownRemainingRequests} remaining requests until ${apiClient.lastKnownResetDate} with a limit of ${apiClient.lastKnownLimit}`, {
        event: 'twitch-api-stats',
        now: new Date(),
        limit: apiClient.lastKnownLimit,
        requests: apiClient.lastKnownRemainingRequests,
        resetDate: apiClient.lastKnownResetDate,
    });

const refresh = async (apiClient: ApiClient, dataSource: DataSource, logger: Logger, override = false): Promise<void> => {
    const { streams, fetchDate } = await getWrpLive(apiClient, dataSource, logger, override);
    await track(apiClient, dataSource, logger, {
        alreadyFetchedSegments: streams,
        now: fetchDate,
    });
    logAPIStats(apiClient, logger);
};

export const startRefreshing = (apiClient: ApiClient, dataSource: DataSource, logger: Logger, intervalMs: number): IntervalTimeout => {
    syncTracked(dataSource)
        .then(() => refresh(apiClient, dataSource, logger));

    return setInterval(async () => {
        if (cachedResults === undefined) {
            logger.info('Not refreshing cache...');
            return;
        }
        logger.info('Refreshing cache...');
        await refresh(apiClient, dataSource, logger, true);
    }, intervalMs);
};

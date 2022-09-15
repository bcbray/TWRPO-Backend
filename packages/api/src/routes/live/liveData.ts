import { randomUUID } from 'crypto';
import { ApiClient, HelixPaginatedResult, HelixStream, HelixStreamType } from '@twurple/api';
import { DataSource } from 'typeorm';
import { LiveResponse, Stream, CharacterInfo, UserResponse } from '@twrpo/types';

import {
    log, cloneDeepJson, filterObj, mapObj, parseParam,
    isObjEmpty, parseLookup, videoUrlOffset,
} from '../../utils';

import { getKnownTwitchUsers } from '../../pfps';

import { getCharacterInfo } from '../../characterUtils';
import { getFactionInfos } from '../../factionUtils';
import { regOthers, regWrp } from '../../data/settings';
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

import type { RecordGen } from '../../utils';
import type { FactionMini, FactionFull, FactionRealMini, FactionRealFull } from '../../data/meta';
import type { Character as CharacterOld, WrpCharacters as WrpCharactersOld, AssumeOther } from '../../data/characters';
import type { WrpFactionsRegexMini, FactionColorsMini, FactionColorsRealMini } from '../../data/factions';
import type { Podcast } from '../../data/podcasts';
import type { TwitchUser } from '../../pfps';

import { StreamChunk } from '../../db/entity/StreamChunk';
import { Video } from '../../db/entity/Video';
import { TwitchChannel } from '../../db/entity/TwitchChannel';

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
// const maxPages = 5 as const;
const searchNumDefault = 2000;
const searchNumMax = 5000;
// const updateCacheMs = 1000 * 60;

const toFactionMini = (faction: string) => faction.toLowerCase().replaceAll(' ', '');

/*

*****************************************************************************
***************************** PARSE CHARACTERS ******************************
*****************************************************************************

*/

for (const [streamer, characters] of Object.entries(wrpCharacters)) {
    const streamerLower = streamer.toLowerCase();

    /* if (characters.length > 0) {
        // const usuallyWl = !characters[0].assumeServer || characters[0].assumeServer === 'whitelist';
        const permathonCharDefault = {
            name: '? "< One-Life Character >" ?',
            nicknames: ['Permathon', 'Perma?thon', '/\\bone[\\s-]life/'],
            // assumeServer: 'whitelist',
        } as Character;
        // const permathonCharPublic = { ...permathonCharWl, assumeServer: 'public' } as Character;
        // const permathonCharInternational = { ...permathonCharWl, assumeServer: 'international' } as Character;
        characters.push(permathonCharDefault); // '/\\bone[\\s-]life[\\s-]charac/'
    } */

    const foundOthers: { [key in AssumeOther]?: boolean } = {};

    // eslint-disable-next-line no-loop-func
    characters.forEach((char, charIdx) => {
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
        } // testing commit identity

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

        // console.log(char.displayName);

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
let unknownTwitchUsers: { [key: string]: TwitchUser } = {};

interface GetStreamsOptions { searchNum?: number; international?: boolean }
type GetStreamsOptionsRequired = Required<GetStreamsOptions>;
const getStreams = async (apiClient: ApiClient, dataSource: DataSource, options: GetStreamsOptions, endpoint = '<no-endpoint>'): Promise<HelixStream[]> => {
    const optionsParsed: GetStreamsOptionsRequired = {
        searchNum: searchNumDefault,
        international: false,
        ...filterObj(options, v => v !== undefined),
    };

    const knownUsers = await getKnownTwitchUsers(apiClient, dataSource);
    knownUsers.forEach((user) => {
        knownPfps[user.id] = user.profilePictureUrl.replace('-300x300.', '-50x50.');
        knownTwitchUsers[user.id] = user;
    });

    let { searchNum } = optionsParsed;
    searchNum = Math.min(searchNum, searchNumMax);

    // const gtaGame = await apiClient.helix.games.getGameById(game);
    const gtaStreamsObj: { [key: string]: HelixStream } = {};
    const gtaStreams: HelixStream[] = [];
    let after;
    while (searchNum > 0) {
        const limitNow = Math.min(searchNum, bigLimit);
        searchNum -= limitNow;
        const gtaStreamsNow: HelixPaginatedResult<HelixStream> = await apiClient.streams.getStreams({
            game,
            // language: optionsParsed.international ? undefined : language,
            language: languages,
            limit: limitNow,
            type: streamType,
            after,
        });

        if (gtaStreamsNow.data.length === 0) {
            log(`${endpoint}: Search ended (limit: ${limitNow})`, gtaStreamsNow);
            break;
        }

        const lookupStreams = [];
        for (const helixStream of gtaStreamsNow.data) {
            const { userId } = helixStream;
            if (gtaStreamsObj[userId]) continue;
            gtaStreamsObj[userId] = helixStream;
            gtaStreams.push(helixStream);
            if (knownPfps[userId] === undefined) {
                lookupStreams.push(userId);
            }
        }

        if (lookupStreams.length > 0) {
            log(`${endpoint}: Looking up pfp for ${lookupStreams.length} users after...`);
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

    return gtaStreams;
};

export interface LiveOptions {
    factionName: FactionMini;
    filterEnabled: boolean;
    allowPublic: boolean;
    allowInternational: boolean;
    allowOthers: boolean;
    darkMode: boolean;
    international: boolean;
    searchNum?: number;
}

interface BaseStream {
    channelName: string;
    title: string;
    // tagIds: string[];
    viewers: number;
    profileUrl: string;
    streamId: string;
}

type FactionCount = { [key in FactionMini]: number };

const cachedResults: { [key: string]: LiveResponse | undefined } = {};
const wrpStreamsPromise: { [key: string]: Promise<LiveResponse> | undefined } = {};

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
    baseOptions = {},
    override = false,
    endpoint = '<no-endpoint>',
    useActivePromise = false
): Promise<LiveResponse> => {
    if (!isObjEmpty(baseOptions)) log(`${endpoint}: options -`, JSON.stringify(baseOptions));

    const options: LiveOptions = {
        factionName: 'allwildrp',
        filterEnabled: true,
        allowPublic: true,
        allowInternational: true,
        allowOthers: true,
        international: false,
        darkMode: true,
        ...filterObj(
            mapObj(baseOptions as RecordGen, (v, k) => {
                const value = parseParam(v as any);
                if (k === 'factionName') return toFactionMini(value);
                return value;
            }),
            v => v !== undefined
        ),
    };

    const optionsStr = JSON.stringify(options);

    if (!override && cachedResults[optionsStr] !== undefined && !useActivePromise) {
        log(`${endpoint}: Returning cached results.`);
        return cachedResults[optionsStr]!;
    }

    const fetchID = randomUUID();
    const fetchStart = process.hrtime.bigint();
    console.log(JSON.stringify({ traceID: fetchID, event: 'start' }));

    if (wrpStreamsPromise[optionsStr] === undefined || override) {
        wrpStreamsPromise[optionsStr] = new Promise<LiveResponse>(async (resolve, reject) => {
            try {
                log(`${endpoint}: Fetching streams data...`);

                const {
                    factionName, filterEnabled, allowOthers, searchNum, international,
                } = options;
                const allowOthersNow = allowOthers || factionName === 'other';

                const nowTime = +new Date();

                const gtaStreams: (HelixStream)[] = await getStreams(apiClient, dataSource,
                    { searchNum, international }, endpoint);

                const fetchEnd = process.hrtime.bigint();
                console.log(JSON.stringify({ traceID: fetchID, event: 'fetched', fetchTime: Number((fetchEnd - fetchStart) / BigInt(1e+6)) }));

                log(`${endpoint}: Fetched streams! Now processing data...`);

                // log(gtaStreams.length);

                // const useTextColor = '#000';
                // const useColors = darkMode ? useColorsDark : useColorsLight;
                const metaFactions: FactionMini[] = ['allwildrp', 'alltwitch'];
                const isMetaFaction = metaFactions.includes(factionName);
                // const isNpMetaFaction = npMetaFactions.includes(factionName);
                // const minViewersUse = isNpMetaFaction ? minViewers : 3;

                let nextId = 0;
                const wrpStreams: Stream[] = [];
                const factionCount: FactionCount = mapObj(wrpFactions, () => 0);

                const newChunks: StreamChunk[] = [];
                const updatedChunks: StreamChunk[] = [];
                const newChannels: Omit<TwitchChannel, 'id' | 'createdAt' | 'lastVideoCheck'>[] = [];
                const now = new Date();

                for (const helixStream of gtaStreams) {
                    const { userDisplayName: channelName, title, viewers } = helixStream;

                    const baseStream: BaseStream = {
                        channelName,
                        title,
                        // tagIds: helixStream.tagIds,
                        viewers,
                        profileUrl: knownPfps[helixStream.userId],
                        streamId: helixStream.id,
                    }; // rpServer, characterName, faction, tagText, tagFaction

                    // let noOthersInclude = true; // INV: Still being used?

                    const titleParsed = title.toLowerCase().replace(/\./g, ' ');
                    const channelNameLower = channelName.toLowerCase();

                    let onOther = false;
                    let onOtherPos = -1;
                    let onOtherIncluded = false;
                    let serverName = '';

                    // log(channelName, '>>>', titleParsed);

                    for (let i = 0; i < regOthers.length; i++) {
                        const regOther = regOthers[i];
                        onOtherPos = title.indexOfRegex(regOther.reg);
                        if (onOtherPos > -1) {
                            onOther = true;
                            serverName = regOther.name;
                            if (regOther.include) onOtherIncluded = true;
                            break;
                        }
                    }

                    let onNp = false;
                    const onNpPos = title.indexOfRegex(regWrp);
                    if (onNpPos > -1 && (onOther === false || onNpPos < onOtherPos)) {
                        onNp = true;
                        onOther = false;
                        onOtherIncluded = false;
                    }

                    const characters = wrpCharacters[channelNameLower] as WrpCharacter | undefined;

                    if (characters && characters.assumeOther === ASTATES.neverNp) {
                        console.log('Excluded', channelName, 'because of "neverNp"');
                        continue;
                    }

                    const mainsOther = characters && characters.assumeOther == ASTATES.assumeOther;
                    const keepNp = characters && characters.assumeOther == ASTATES.assumeNpNoOther;
                    const onMainOther = !onNp && mainsOther;
                    const npStreamer = onNp || characters;

                    const nowFilterEnabled = filterEnabled && factionName !== 'alltwitch';

                    // log(title, '>>>', onNp);

                    let streamState; // remove, mark-np, mark-other
                    if (nowFilterEnabled) {
                        // If filtering streams is enabled
                        if ((npStreamer && !mainsOther && !keepNp && onOther)) {
                            // If is-including-others and streamer on another server, or it's an NP streamer playing another server
                            streamState = FSTATES.other;
                        } else if ((onOtherIncluded || onMainOther || (npStreamer && onOther))) {
                            if (allowOthersNow) {
                                streamState = FSTATES.other;
                                // noOthersInclude = false;
                            } else {
                                continue;
                            }
                        } else if (npStreamer && !onMainOther && !onOther) {
                            // If NoPixel streamer that isn't on another server
                            streamState = FSTATES.nopixel;
                            serverName = 'WRP';
                        } else {
                            continue;
                        }
                    } else if (npStreamer && !onMainOther && !onOther) {
                        // If NoPixel streamer that isn't on another server
                        streamState = FSTATES.nopixel;
                        serverName = 'WRP';
                    } else {
                        streamState = FSTATES.other;
                    }

                    // log(streamState);

                    const hasCharacters = characters && characters.length;

                    if (streamState === FSTATES.other) {
                        // Other included RP servers
                        const allowStream = isMetaFaction;
                        if (allowStream === false) {
                            continue;
                        }

                        const stream: Stream = {
                            id: nextId,
                            ...baseStream,
                            rpServer: serverName.length ? serverName : null,
                            characterName: null,
                            characterId: null,
                            nicknameLookup: null,
                            faction: 'other',
                            factions: ['other'],
                            factionsMap: { other: true },
                            tagText: serverName.length > 0 ? `::${serverName}::` : '::Other Server::',
                            tagFaction: 'other',
                            // keepCase: true,
                            thumbnailUrl: helixStream.thumbnailUrl,
                            startDate: helixStream.startDate.toISOString(),
                            isHidden: false,
                        };

                        nextId++;
                        factionCount.other++;
                        wrpStreams.push(stream);
                        continue;
                    }

                    let mostRecentStreamSegment = await dataSource.getRepository(StreamChunk)
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
                    if (mostRecentStreamSegment && mostRecentStreamSegment.title !== title) {
                        mostRecentStreamSegment = null;
                    }

                    const isOverridden = mostRecentStreamSegment !== null && mostRecentStreamSegment.isOverridden;

                    // streamState === FSTATES.nopixel

                    let nowCharacter: Character | undefined;

                    if (hasCharacters) {
                        if (isOverridden) {
                            if (mostRecentStreamSegment?.characterId) {
                                nowCharacter = characters.find(c => c.id === mostRecentStreamSegment?.characterId);
                            }
                            console.log(JSON.stringify({
                                level: 'info',
                                event: 'stream-override',
                                message: `Found override for ${channelName} to character ${nowCharacter ? `"${nowCharacter.name}"` : '(NULL)'}`,
                                channel: channelName,
                                title,
                                character: nowCharacter?.name ?? null,
                            }));
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

                    // if (nowCharacter === undefined) {
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
                        // factionNames = factionObjects[0].factions;
                        factionNames = factionObjects.map(factionObj => factionObj.factions).flat(1);
                    }
                    // }

                    const hasFactions = factionNames.length;

                    // log(nowCharacter);

                    let allowStream = isMetaFaction;
                    if (allowStream === false) {
                        if (factionName === 'otherwrp') {
                            allowStream = !nowCharacter && !hasFactions && !hasCharacters;
                        } else {
                            // eslint-disable-next-line no-lonely-if
                            if (nowCharacter) {
                                allowStream = factionName in nowCharacter.factionsObj;
                            } else if (hasFactions) {
                                allowStream = (factionNames as string[]).includes(factionName);
                            } else if (hasCharacters) {
                                allowStream = factionName in characters[0].factionsObj;
                            }
                        }
                    }

                    let possibleCharacter = nowCharacter;
                    if (!isOverridden && !nowCharacter && !hasFactions && hasCharacters) {
                        if (characters.assumeChar) {
                            nowCharacter = characters.assumeChar;
                            possibleCharacter = nowCharacter;
                        } else {
                            possibleCharacter = characters[0];
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

                    // log(allowStream === false, (onNpPublic && factionName !== 'publicnp' && allowPublic == false));

                    if (allowStream === false) {
                        continue;
                    }

                    // let keepCase = false;
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
                        // keepCase = true;
                        activeFactions = ['otherwrp'];
                        tagFaction = 'otherwrp';
                        tagText = `${serverName}`;
                    }

                    if (newCharFactionSpotted) activeFactions.push('guessed');

                    const chunk: Omit<StreamChunk, 'id' | 'isOverridden' | 'isHidden'> = {
                        streamerId: helixStream.userId,
                        characterId: possibleCharacter?.id ?? null,
                        characterUncertain: possibleCharacter !== undefined && nowCharacter === undefined,
                        streamId: helixStream.id,
                        streamStartDate: helixStream.startDate,
                        title: helixStream.title,
                        firstSeenDate: now,
                        lastSeenDate: now,
                    };

                    let segmentId: number | undefined;
                    if (mostRecentStreamSegment) {
                        const { id } = mostRecentStreamSegment;
                        const chunkUpdate: Some<StreamChunk, 'id' | 'lastSeenDate', 'characterId' | 'characterUncertain'> = {
                            id,
                            lastSeenDate: now,
                        };
                        if (!mostRecentStreamSegment.isOverridden) {
                            const { characterId, characterUncertain } = chunk;
                            chunkUpdate.characterId = characterId;
                            chunkUpdate.characterUncertain = characterUncertain;
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
                            console.error(JSON.stringify({
                                level: 'error',
                                message: 'Failed to update chunk',
                                chunkUpdate,
                                error,
                            }));
                        }
                    } else {
                        try {
                            const newChunk = await dataSource
                                .getRepository(StreamChunk)
                                .save(chunk);
                            newChunks.push(newChunk);
                            segmentId = newChunk.id;
                        } catch (error) {
                            console.error(JSON.stringify({
                                level: 'error',
                                message: 'Failed to insert chunk',
                                chunk,
                                error,
                            }));
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

                    const stream: Stream = {
                        id: nextId,
                        ...baseStream,
                        rpServer: serverName,
                        characterName: possibleCharacter?.name ?? null,
                        characterId: possibleCharacter?.id ?? null,
                        nicknameLookup: possibleCharacter?.nicknames ? possibleCharacter.nicknames.map(nick => parseLookup(nick)).join(' _-_ ') : null,
                        faction: activeFactions[0],
                        factions: activeFactions,
                        factionsMap: Object.assign({}, ...activeFactions.map(faction => ({ [faction]: true }))),
                        tagText,
                        tagFaction,
                        thumbnailUrl: helixStream.thumbnailUrl,
                        startDate: helixStream.startDate.toISOString(),
                        segmentId,
                        isHidden: mostRecentStreamSegment?.isHidden ?? false,
                    };

                    console.log(JSON.stringify({
                        level: 'info',
                        event: 'stream',
                        traceID: fetchID,
                        message: `Found stream for ${channelName} with tag "${stream.tagText}"`,
                        channel: channelName,
                        stream,
                    }));

                    nextId++;
                    for (const faction of activeFactions) factionCount[faction]++;
                    factionCount.allwildrp++;
                    wrpStreams.push(stream);
                }

                const allChunks = [...newChunks, ...updatedChunks];

                try {
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
                            console.log(JSON.stringify({
                                level: 'info',
                                event: 'channel-update',
                                message: `Updated ${updateCount} twitch channels in database`,
                                count: updateCount,
                            }));
                        }
                        Object.assign(
                            knownTwitchUsers,
                            Object.fromEntries(newChannels.map(c => [c.twitchId, c]))
                        );
                        unknownTwitchUsers = {};
                    }

                    console.log(JSON.stringify({
                        level: 'info',
                        event: 'segment-update',
                        message: `Updated ${updatedChunks.length} streams in database`,
                        count: updatedChunks.length,
                    }));

                    console.log(JSON.stringify({
                        level: 'info',
                        event: 'segment-insert',
                        message: `Stored ${newChunks.length} new streams to database`,
                        count: newChunks.length,
                    }));

                    const liveStreamIds = allChunks.map(c => c.streamId);

                    // Fetch any missing thumbnails from streams that just went offline
                    const recentVideosMissingThumbnails = await dataSource.getRepository(Video)
                        .createQueryBuilder('video')
                        .select()
                        .distinctOn(['video.videoId'])
                        .innerJoin(StreamChunk, 'stream_chunk', 'video.streamId = stream_chunk.streamId')
                        .where('stream_chunk.lastSeenDate >= :cutoff', { cutoff: new Date(now.getTime() - 1000 * 60 * 10) })
                        .andWhere('video.thumbnailUrl IS NULL')
                        .andWhere('stream_chunk.streamId NOT IN (:...liveStreamIds)', { liveStreamIds })
                        .orderBy('video.videoId', 'ASC')
                        .getMany();
                    if (recentVideosMissingThumbnails.length) {
                        await fetchMissingThumbnailsForVideoIds(apiClient, dataSource, recentVideosMissingThumbnails.map(v => v.videoId));
                    } else {
                        console.log(JSON.stringify({
                            level: 'info',
                            message: 'No recent videos missing thumbnails',
                            event: 'video-thumbnail-skip',
                        }));
                    }

                    // Fetch videos for users who just went offline
                    const chunksToFetch = await dataSource.getRepository(StreamChunk)
                        .createQueryBuilder('stream_chunk')
                        .select()
                        .distinctOn(['stream_chunk.streamId'])
                        .leftJoin(Video, 'video', 'video.streamId = stream_chunk.streamId')
                        .where('video.id IS NULL')
                        .andWhere('stream_chunk.lastSeenDate >= :cutoff', { cutoff: new Date(now.getTime() - 1000 * 60 * 10) })
                        .andWhere('stream_chunk.streamId NOT IN (:...liveStreamIds)', { liveStreamIds })
                        .orderBy('stream_chunk.streamId', 'ASC')
                        .getMany();

                    const streamIds = new Set(chunksToFetch.map(c => c.streamId));
                    const streamerIds = [...new Set(chunksToFetch.map(c => c.streamerId))];

                    if (streamerIds.length) {
                        let foundVideos = 0;
                        for (const streamerId of streamerIds) {
                            foundVideos += await fetchVideosForUser(apiClient, dataSource, streamerId, streamIds);
                        }
                        console.log(JSON.stringify({
                            level: 'info',
                            message: `Fetched videos for ${streamerIds.length} users, found ${foundVideos} videos`,
                            event: 'video-end',
                            userCount: streamerIds.length,
                            foundVideos,
                        }));
                    } else {
                        console.log(JSON.stringify({
                            level: 'info',
                            message: 'No recent stream segments to fetch videos for',
                            event: 'video-skip',
                        }));
                    }
                } catch (error) {
                    console.error(JSON.stringify({ level: 'error', message: 'Failed to store streams to db', error }));
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
                        .distinctOn(['stream_chunk.characterId'])
                        .where('stream_chunk.characterId IS NOT NULL')
                        .andWhere('stream_chunk.characterUncertain = false')
                        .andWhere(
                            'stream_chunk.lastSeenDate > (current_timestamp at time zone \'UTC\' - make_interval(hours => 12))'
                        )
                        .andWhere(
                            'stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)'
                        )
                        .groupBy('stream_chunk.streamerId')
                        .addGroupBy('stream_chunk.streamId')
                        .addGroupBy('stream_chunk.characterId')
                        .addGroupBy('stream_chunk.streamStartDate')
                        .orderBy('character_id', 'ASC')
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
                            console.warn(JSON.stringify({
                                level: 'warning',
                                message: 'Missing required properties on recent stream segment',
                                segment: chunk,
                            }));
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
                    console.error(JSON.stringify({ level: 'error', message: 'Failed to load recent characters', error }));
                }

                // log(filterFactions);

                const result: LiveResponse = {
                    ...includedData,
                    factionCount,
                    filterFactions,
                    streams: wrpStreams,
                    tick: nowTime,
                    recentOfflineCharacters: recentlyOnlineCharacters.length
                        ? recentlyOnlineCharacters
                        : undefined,
                };

                // console.log('npStreamsFb', npStreamsFb);

                cachedResults[optionsStr] = result;
                log(`${endpoint}: Done fetching streams data!`);
                const parseEnd = process.hrtime.bigint();
                console.log(JSON.stringify({
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
                }));
                resolve(result);
            } catch (err) {
                const parseEnd = process.hrtime.bigint();
                console.log(JSON.stringify({ traceID: fetchID, event: 'failed', error: err, totalTime: Number((parseEnd - fetchStart) / BigInt(1e+6)) }));
                log(`${endpoint}: Failed to fetch streams data:`, err);
                reject(err);
            }
        });
    } else {
        log(`${endpoint}: Waiting for wrpStreamsPromise...`);
    }

    await wrpStreamsPromise[optionsStr]!;

    log(`${endpoint}: Got data!`);

    return cachedResults[optionsStr]!;
};

export const getRawWrpLive = getWrpLive;

export const getFilteredWrpLive = async (apiClient: ApiClient, dataSource: DataSource, currentUser: UserResponse): Promise<LiveResponse> => {
    const { streams, ...rest } = await getWrpLive(apiClient, dataSource);
    const isEditor = isGlobalEditor(currentUser);
    return {
        streams: streams
            .filter(s => !s.isHidden || isEditor),
        ...rest,
    };
};

export const forceWrpLiveRefresh = async (apiClient: ApiClient, dataSource: DataSource): Promise<void> => {
    await getWrpLive(apiClient, dataSource, {}, true);
};

export const getWrpStreams = async (apiClient: ApiClient, dataSource: DataSource, baseOptions = {}, override = false): Promise<Stream[]> => {
    const live = await getWrpLive(apiClient, dataSource, baseOptions, override, '/streams');
    return live.streams;
};

export type IntervalTimeout = ReturnType<typeof setInterval>;

export const startRefreshing = (apiClient: ApiClient, dataSource: DataSource, intervalMs: number): IntervalTimeout => {
    getWrpLive(apiClient, dataSource);

    return setInterval(async () => {
        const cachedResultsKeys = Object.keys(cachedResults);
        if (!cachedResultsKeys.length) {
            log('Not refreshing cache...');
            return;
        }
        log('Refreshing cache...');
        for (const optionsStr of cachedResultsKeys) {
            log('Refreshing optionStr');
            const optionsObj = JSON.parse(optionsStr);
            await getWrpLive(apiClient, dataSource, optionsObj, true);
        }
    }, intervalMs);
};

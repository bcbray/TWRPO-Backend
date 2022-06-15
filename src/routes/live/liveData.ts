import { randomUUID } from 'crypto'

import { HelixPaginatedResult, HelixStream, HelixStreamType } from 'twitch';

import { apiClient } from '../../twitchSetup';
import {
    log, cloneDeepJson, filterObj, mapObj, parseParam, isObjEmpty, parseLookup,
} from '../../utils';

import { regOthers, regWrp } from '../../data/settings';
import settingsParsed from '../../data/settingsParsed';
import factionsParsed from '../../data/factionsParsed';
import { WrpFactions, wrpFactions } from '../../data/meta';
import { wrpCharacters as wrpCharactersOld } from '../../data/characters';
import { isFactionColor, lesserFactions, greaterFactions, wrpFactionsRegex, wrpFactionsSubRegex, filterFactionsBase } from '../../data/factions';

import type { RecordGen } from '../../utils';
import type { FactionMini, FactionFull, FactionRealMini, FactionRealFull } from '../../data/meta';
import type { Character as CharacterOld, WrpCharacters as WrpCharactersOld, AssumeOther } from '../../data/characters';
import type { WrpFactionsRegexMini, FactionColorsMini, FactionColorsRealMini } from '../../data/factions';

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

type WrpCharacter = Character[] & { assumeChar?: Character; assumeOther: number; };

type WrpCharacters = { [key: string]: WrpCharacter };

const wrpCharacters = cloneDeepJson<WrpCharactersOld, WrpCharacters>(wrpCharactersOld);

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
const streamType = HelixStreamType.Live;
const bigLimit = 100 as const;
// const maxPages = 5 as const;
const searchNumDefault = 2000;
const searchNumMax = 5000;
const updateCacheMs = 1000 * 60;

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
        }

        if (charOld.nicknames) {
            if (realNames.length === 1) realNames.push(realNames[0]);
            if (displayNameNum !== 0) realNames.push(...charOld.nicknames.filter(nck => typeof nck === 'string'));
            charOld.nicknames.forEach((nck) => {
                if (nck[0] === '/' && nck[nck.length - 1] === '/') {
                    nameRegAll.push(nck.substring(1, nck.length - 1));
                } else {
                    const nicknameKeywords = [...nck.matchAll(/"([^"]+)"/g)].map(result => result[1]);
                    if (nicknameKeywords.length > 0) {
                        parsedNames.push(...nicknameKeywords.map(keyword => RegExp.escape(keyword.toLowerCase())));
                    } else {
                        parsedNames.push(RegExp.escape(nck.toLowerCase()));
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

const wrpFactionsRegexEntries = Object.entries(wrpFactionsRegex) as [WrpFactionsRegexMini, RegExp][];

const knownPfps: { [key: string]: string } = {};

interface GetStreamsOptions { searchNum?: number; international?: boolean }
type GetStreamsOptionsRequired = Required<GetStreamsOptions>;
export const getStreams = async (options: GetStreamsOptions, endpoint = '<no-endpoint>'): Promise<HelixStream[]> => {
    const optionsParsed: GetStreamsOptionsRequired = {
        searchNum: searchNumDefault,
        international: false,
        ...filterObj(options, v => v !== undefined),
    };

    let { searchNum } = optionsParsed;
    searchNum = Math.min(searchNum, searchNumMax);

    // const gtaGame = await apiClient.helix.games.getGameById(game);
    const gtaStreamsObj: { [key: string]: HelixStream } = {};
    const gtaStreams: HelixStream[] = [];
    let after;
    while (searchNum > 0) {
        const limitNow = Math.min(searchNum, bigLimit);
        searchNum -= limitNow;
        const gtaStreamsNow: HelixPaginatedResult<HelixStream> = await apiClient.helix.streams.getStreams({
            game,
            // language: optionsParsed.international ? undefined : language,
            language: languages,
            limit: String(limitNow),
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
            const foundUsers = await apiClient.helix.users.getUsersByIds(lookupStreams);
            for (const helixUser of foundUsers) {
                knownPfps[helixUser.id] = helixUser.profilePictureUrl.replace('-300x300.', '-50x50.');
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
}

interface Stream extends BaseStream {
    id: number;
    rpServer: string | null;
    characterName: string | null;
    nicknameLookup: string | null;
    faction: FactionMini;
    factions: FactionMini[];
    factionsMap: { [key in FactionMini]?: boolean };
    tagText: string;
    tagFaction: FactionColorsMini;
    tagFactionSecondary?: FactionColorsMini;
    videoUrl?: string;
    thumbnailUrl?: string;
    startDate?: Date;
}

type FactionCount = { [key in FactionMini]: number };

interface InjectionConfiguration {
    targetElementSelector: string;
    hopsToMainAncestor: number;
    channelNameElementSelector: string;
    liveBadgeElementSelector: string;
    liveBadgeContentElementSelector: string;
    viewersBadgeElementSelector: string;

    mainScrollSelector: string;

    settingsTargetElementSelector: string;
    hopsToSettingsContainerAncestor: number;

    insertionElementSelector: string;
}

interface Live {
    minViewers: number;
    stopOnMin: boolean;
    intervalSeconds: number;
    useColorsDark: RecordGen;
    useColorsLight: RecordGen;
    wrpFactions: WrpFactions;
    factionCount: FactionCount;
    filterFactions: any[];
    streams: Stream[];
    baseHtml: string;
    tick: number;
    injectionConfiguration: InjectionConfiguration;
}

const cachedResults: { [key: string]: Live | undefined } = {};
const wrpStreamsPromise: { [key: string]: Promise<Live> | undefined } = {};

export const getWrpLive = async (baseOptions = {}, override = false, endpoint = '<no-endpoint>', useActivePromise = false): Promise<Live> => {
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

    const fetchID = randomUUID()
    const fetchStart = process.hrtime.bigint();
    console.log(JSON.stringify({traceID: fetchID, event: "start"}));

    if (wrpStreamsPromise[optionsStr] === undefined || override) {
        wrpStreamsPromise[optionsStr] = new Promise<Live>(async (resolve, reject) => {
            try {
                log(`${endpoint}: Fetching streams data...`);

                const {
                    factionName, filterEnabled, allowOthers, searchNum, international,
                } = options;
                const allowOthersNow = allowOthers || factionName === 'other';

                const nowTime = +new Date();

                const gtaStreams: (HelixStream)[] = await getStreams({ searchNum, international }, endpoint);

                const fetchEnd = process.hrtime.bigint();
                console.log(JSON.stringify({traceID: fetchID, event: "fetched", fetchTime: Number((fetchEnd-fetchStart) / BigInt(1e+6))}));

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
                gtaStreams.forEach((helixStream) => {
                    const { userDisplayName: channelName, title, viewers } = helixStream;

                    const baseStream: BaseStream = {
                        channelName,
                        title,
                        // tagIds: helixStream.tagIds,
                        viewers,
                        profileUrl: knownPfps[(helixStream as HelixStream).userId],
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
                        return;
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
                                return;
                            }
                        } else if (npStreamer && !onMainOther && !onOther) {
                            // If NoPixel streamer that isn't on another server
                            streamState = FSTATES.nopixel;
                            serverName = 'WRP';
                        } else {
                            return;
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
                            return;
                        }

                        const stream: Stream = {
                            id: nextId,
                            ...baseStream,
                            rpServer: serverName.length ? serverName : null,
                            characterName: null,
                            nicknameLookup: null,
                            faction: 'other',
                            factions: ['other'],
                            factionsMap: { other: true },
                            tagText: serverName.length > 0 ? `::${serverName}::` : '::Other Server::',
                            tagFaction: 'other',
                            // keepCase: true,
                            thumbnailUrl: helixStream.thumbnailUrl,
                            startDate: helixStream.startDate
                        };

                        nextId++;
                        factionCount.other++;
                        wrpStreams.push(stream);
                        return;
                    }

                    // streamState === FSTATES.nopixel

                    let nowCharacter;

                    if (hasCharacters) {
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
                            if (nowCharacter) {
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

                    if (nowCharacter) {
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
                        if (factionObjects[0].character) nowCharacter = factionObjects[0].character; // Sorted by has-character
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

                    let hasFactionsTagText;
                    if (!nowCharacter && hasFactions && factionNames[0] in wrpFactionsSubRegex) {
                        for (const [tagText, tagReg] of wrpFactionsSubRegex[factionNames[0]]!) {
                            if (tagReg.test(title)) {
                                hasFactionsTagText = tagText;
                                break;
                            }
                        }
                    }

                    let possibleCharacter = nowCharacter;
                    if (!nowCharacter && !hasFactions && hasCharacters) {
                        if (characters.assumeChar) {
                            nowCharacter = characters.assumeChar;
                            possibleCharacter = nowCharacter;
                        } else {
                            possibleCharacter = characters[0];
                        }
                    }

                    // log(allowStream === false, (onNpPublic && factionName !== 'publicnp' && allowPublic == false));

                    if (allowStream === false) {
                        return;
                    }

                    // let keepCase = false;
                    let activeFactions: FactionMini[];
                    let tagFaction: FactionColorsMini;
                    let tagText;

                    if (nowCharacter) {
                        activeFactions = [...nowCharacter.factions];
                        tagFaction = nowCharacter.factionUse;
                        tagText = nowCharacter.displayName;
                    } else if (hasFactions) {
                        activeFactions = [...factionNames, 'guessed'];
                        tagFaction = isFactionColor(factionNames[0]) ? factionNames[0] : 'independent';
                        const factionNameFull = fullFactionMap[factionNames[0]] || factionNames[0];
                        tagText = hasFactionsTagText ? `〈${hasFactionsTagText}〉` : `〈${factionNameFull}〉`;
                        if (tagFaction === 'podcast' || tagFaction === 'watchparty') {
                            tagText = `《${factionNameFull}》${channelName}`;
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

                    const stream: Stream = {
                        id: nextId,
                        ...baseStream,
                        rpServer: serverName,
                        characterName: possibleCharacter?.name ?? null,
                        nicknameLookup: possibleCharacter?.nicknames ? possibleCharacter.nicknames.map(nick => parseLookup(nick)).join(' _-_ ') : null,
                        faction: activeFactions[0],
                        factions: activeFactions,
                        factionsMap: Object.assign({}, ...activeFactions.map(faction => ({ [faction]: true }))),
                        tagText,
                        tagFaction,
                        thumbnailUrl: helixStream.thumbnailUrl,
                        startDate: helixStream.startDate
                    };

                    console.log(JSON.stringify({traceID: fetchID, event: "stream", channel: channelName, stream: stream}));

                    nextId++;
                    for (const faction of activeFactions) factionCount[faction]++;
                    factionCount.allwildrp++;
                    wrpStreams.push(stream);
                });

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

                // log(filterFactions);

                // Includes npManual, _ORDER_, _TITLE_, _VIEWERS_, _PFP_, _CHANNEL1_, _CHANNEL2_
                // eslint-disable-next-line max-len
                const baseHtml = '<div class="tno-stream" id="tno-stream-_TNOID_" data-target="" style="order: _ORDER_;"><div class="Layout-sc-nxg1ff-0 cUYIUW"><div><div class="Layout-sc-nxg1ff-0"><article data-a-target="card-4" data-a-id="card-_CHANNEL1_" class="Layout-sc-nxg1ff-0 frepDF"><div class="Layout-sc-nxg1ff-0 ggozbG"><div class="Layout-sc-nxg1ff-0 kTkZWx"><div class="ScTextWrapper-sc-14f6evl-1 fejGga"><div class="ScTextMargin-sc-14f6evl-2 biJSak"><a data-test-selector="TitleAndChannel" data-a-target="preview-card-channel-link" aria-label="_TITLE_" class="ScCoreLink-sc-udwpw5-0 cmQKL tw-link" href="/_CHANNEL1_/videos"><h3 title="_TITLE_" class="CoreText-sc-cpl358-0 hjONlz">_TITLE_</h3><p data-a-target="preview-card-channel-link" tabindex="-1" title="_CHANNEL2_" class="CoreText-sc-cpl358-0 eyuUlK">_CHANNEL2_</p></a></div><div class="Layout-sc-nxg1ff-0 dRKpYM"><div class="InjectLayout-sc-588ddc-0 eXNwOD"><div class="InjectLayout-sc-588ddc-0 beXCOC"><button class="ScTag-sc-xzp4i-0 iKNvdP tw-tag" aria-describedby="9449931af8bd9bbdff3c67df6755f045" aria-label="English" data-a-target="English"><div class="ScTagContent-sc-xzp4i-1 gONNWj"><div class="ScTagText-sc-xzp4i-2 eMoqSY"><span>English</span></div></div></button></div></div></div></div><div class="ScImageWrapper-sc-14f6evl-0 jISSAW"><a data-a-target="card-4" data-a-id="card-_CHANNEL1_" data-test-selector="preview-card-avatar" tabindex="-1" class="ScCoreLink-sc-udwpw5-0 ktfxqP tw-link" href="/_CHANNEL1_/videos"><div class="ScAspectRatio-sc-1sw3lwy-1 eQcihY tw-aspect"><div class="ScAspectSpacer-sc-1sw3lwy-0 dsswUS"></div><figure aria-label="_CHANNEL1_" class="ScAvatar-sc-12nlgut-0 bmqpYD tw-avatar"><img class="InjectLayout-sc-588ddc-0 iDjrEF tw-image tw-image-avatar" alt="_CHANNEL1_" src="_PFP_"></figure></div></a></div></div></div><div class="ScWrapper-sc-uo2e2v-0 sqjWZ tw-hover-accent-effect"><div class="ScTransformWrapper-sc-uo2e2v-1 ScCornerTop-sc-uo2e2v-2 lmjSRR gaYszF"></div><div class="ScTransformWrapper-sc-uo2e2v-1 ScCornerBottom-sc-uo2e2v-3 gEIaFB fGRgGA"></div><div class="ScTransformWrapper-sc-uo2e2v-1 ScEdgeLeft-sc-uo2e2v-4 eTyELd eRrHBW"></div><div class="ScTransformWrapper-sc-uo2e2v-1 ScEdgeBottom-sc-uo2e2v-5 kocUMp cWOxay"></div><div class="ScTransformWrapper-sc-uo2e2v-1 ghrhyx"><a data-a-target="preview-card-image-link" tabindex="-1" class="ScCoreLink-sc-udwpw5-0 ktfxqP preview-card-image-link tw-link" href="/_CHANNEL1_"><div class="Layout-sc-nxg1ff-0 fjGGXR"><div class="ScAspectRatio-sc-1sw3lwy-1 kPofwJ tw-aspect"><div class="ScAspectSpacer-sc-1sw3lwy-0 kECpQh"></div><img alt="_TITLE_ - _CHANNEL1_" class="tw-image" src="https://static-cdn.jtvnw.net/previews-ttv/live_user__CHANNEL1_-440x248.jpg_TIMEID_"></div><div class="ScPositionCorner-sc-1iiybo2-1 gtpTmt"><div class="ScChannelStatusTextIndicator-sc-1f5ghgf-0 gfqupx tw-channel-status-text-indicator" font-size="font-size-6"><p class="CoreText-sc-cpl358-0 duTViv">LIVE</p></div></div><div class="ScPositionCorner-sc-1iiybo2-1 eHqCXd"><div class="ScMediaCardStatWrapper-sc-1ncw7wk-0 jluyAA tw-media-card-stat">_VIEWERS_ viewers</div></div></div></a></div></div></article></div></div></div></div>';

                const injection: InjectionConfiguration = {
                    targetElementSelector: "article",
                    hopsToMainAncestor: 4,
                    channelNameElementSelector: `p[data-a-target='preview-card-channel-link']`,
                    liveBadgeElementSelector: `.tw-channel-status-text-indicator`,
                    liveBadgeContentElementSelector: `p`,
                    viewersBadgeElementSelector: `.tw-media-card-stat`,
                    mainScrollSelector: `div.root-scrollable.scrollable-area > div.simplebar-scroll-content`,
                    settingsTargetElementSelector: `[data-test-selector="follow-game-button-component"]`,
                    hopsToSettingsContainerAncestor: 2,
                    insertionElementSelector: `[data-target="directory-first-item"]`,
                };

                const result: Live = {
                    ...includedData,
                    factionCount,
                    filterFactions,
                    streams: wrpStreams,
                    baseHtml,
                    tick: nowTime,
                    injectionConfiguration: injection,
                };

                // console.log('npStreamsFb', npStreamsFb);

                cachedResults[optionsStr] = result;
                log(`${endpoint}: Done fetching streams data!`);
                const parseEnd = process.hrtime.bigint();
                console.log(JSON.stringify({traceID: fetchID, event: "done", factionCount: factionCount, parseTime: Number((parseEnd-fetchEnd) / BigInt(1e+6)), totalTime: Number((parseEnd-fetchStart) / BigInt(1e+6))}));
                resolve(result);
            } catch (err) {
                const parseEnd = process.hrtime.bigint();
                console.log(JSON.stringify({traceID: fetchID, event: "failed", error: err, totalTime: Number((parseEnd-fetchStart) / BigInt(1e+6))}));
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

export const getWrpStreams = async (baseOptions = {}, override = false): Promise<Stream[]> => {
    const live = await getWrpLive(baseOptions, override, '/streams');
    return live.streams;
};

getWrpLive();

setInterval(async () => {
    const cachedResultsKeys = Object.keys(cachedResults);
    if (!cachedResultsKeys.length) return;
    log('Refreshing cache...');
    for (const optionsStr of cachedResultsKeys) {
        log('Refreshing optionStr');
        const optionsObj = JSON.parse(optionsStr);
        await getWrpLive(optionsObj, true);
    }
}, updateCacheMs);

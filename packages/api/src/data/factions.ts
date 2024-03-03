/* eslint-disable no-useless-escape */
/* eslint-disable max-len */

import { mergeRegex, objectEntries } from '../utils';
import { wrpFactions, wrpFactionsRealMini } from './meta';

import type { FactionMini, FactionRealMini } from './meta';

const noAutoFaction = {
    independent: true,
    otherfaction: true,
    other: true,
} as const;

export type WrpFactionsRegexKeys = Exclude<FactionRealMini, keyof typeof noAutoFaction>;

const noLater = (reg: RegExp) => mergeRegex(['(?:', reg, ')', /(?!(?:[\s-_]+(?:char\w*|roleplay|rp))?[^\w.;]+(?:later|after))/i]);

const noFormer = (reg: RegExp) => mergeRegex([/(?<!(?:\b|_)(?:vs?|versus|on|against|e?x|former|fake|wanna\s*be|fighting|clapping|with|becom\w+\s+a|for|then)(?:\s+(?:th?e|some|all|every|el|la|da))?[^a-z0-9]*|vs?)/i, '(?:', reg, ')']);

export const wrpFactionsRegex = {
    thebaastards: noLater(noFormer(/\b(?:the\s+)?baastards/i)),
    halfwits: noLater(noFormer(/\bhalf\s*wits/)),
    podcast: noLater(noFormer(/\b(?:(?<!!)podcast|rp\s+theory)\b/i)),
    watchparty: noLater(noFormer(/\b(?<!!)watch[\s\-_.]*part/i)),
    development: /\bdevelop|\bdev\b|\bcoding|devathon/i,
    law: noLater(noFormer(/\b(?:deputy|cadet|detective|sheriff|scsd|lawman)\b/i)),
    rangers: noFormer(/\brangers?\b/i),
    dicenzofamiglia: noFormer(/\bdicenzos?\b/i),
    taipan: noFormer(/\btai[\s|-]*pan\b/i),
    medical: noLater(/(?<!then\b.*|!)(?:doctor|medic|paramedic|therapist|psychologist|\b(?:dr(?!(?:\s*pepper|\s+will\s+see\s+you))|em[st]|scdh)\b)/i),
    lifer: noLater(/\blifer\b|\blife\W*sentence\b/i),
    sisikaguard: noLater(noFormer(/\bsisika\W*guard\b/i)),
    onelife: /\bperma-?thon|\bperma\s*character|\b(?:one|1)[\s\-_.]*life/i,
} as { [key in WrpFactionsRegexKeys]: RegExp };

export const wrpFactionsSubRegex: { [key in FactionRealMini]?: [string, RegExp][] } = {
};

// export const lesserFactions = asConst<PartialRecord<FactionRealMini, true>>()({
//     news: true,
//     rooster: true,
//     burgershot: true,
//     development: true,
//     mechanic: true,
//     harmony: true,
//     quickfix: true,
//     tunershop: true,
// });

// const validateType = <T> (obj: T) => undefined;

export const lesserFactions: { [key in FactionRealMini]?: true } = {
    development: true,
    onelife: true,
} as const;
// validateType<{ [key in FactionRealMini]?: true }>(lesserFactions);
// const checkKeys: FactionRealMini = (null!) as keyof typeof lesserFactions;

export const greaterFactions: { [key in FactionRealMini]?: true } = {
    podcast: true,
    watchparty: true,
} as const;

export type WrpFactionsRegexMini = keyof typeof wrpFactionsRegex;

const has = <K extends string>(key: K, x: Record<string, unknown>): x is { [key in K]: unknown } => key in x;

// const keepS: { [key in FactionRealMini]?: boolean } = { pegasus: true, news: true, russians: true, dans: true };
const keepS: { [key in FactionRealMini]?: boolean } = { news: true };

wrpFactionsRealMini.forEach((faction) => {
    const fullFaction = wrpFactions[faction];
    if (!has(faction, noAutoFaction) && !has(faction, wrpFactionsRegex)) {
        faction = faction as WrpFactionsRegexKeys;
        let regStr = RegExp.escape(fullFaction[fullFaction.length - 1] === 's' && !keepS[faction] ? fullFaction.slice(0, -1) : fullFaction).toLowerCase();
        if (regStr.length <= 4) {
            regStr = `\\b${regStr}\\b`;
        } else {
            regStr = `\\b${regStr}`;
        }
        wrpFactionsRegex[faction] = new RegExp(regStr, 'i');
    }
});

export const useColorsDark = { // #ff77ff #FAA0A0 #FA0B42
    thebaastards: '#e74c3c',
    kettlemangang: '#ab5179',
    dicenzofamiglia: '#F6EE6D',
    moretticrew: '#F6EE6D',
    halfwits: '#FFECAF',
    guppygang: '#3cbe4e',
    thehumblebunch: '#A87C2D',
    coltons: '#a35231',
    taipan: '#74A1D3',
    boonsboys: '#F3C741',
    redwater: '#AD3A3A',
    themaskedmen: '#FA8EE4',
    quilgang: '#9C51AB',
    thefirm: '#a0cfd1',
    permatrail: '#BFAECE',
    development: '#718093',
    law: '#0abde3',
    rangers: '#0984e3',
    medical: '#badc58',
    guarma: '#A8C078',
    onelife: '#BFAECE',
    conductors: '#a4b3cc',
    sisikaguard: '#6ecaec',
    lifer: '#cecebd',
    otherfaction: '#32ff7e',
    independent: '#32ff7e',
    podcast: '#ffffff',
    watchparty: '#ffffff',
    otherwrp: '#ffffff',
    other: '#429e9d',
    allwildrp: '#ffffff',
    alltwitch: '#ffffff',
} as const;

export type FactionColorsMini = keyof typeof useColorsDark;

export type FactionColorsRealMini = FactionRealMini & FactionColorsMini;

export const isFactionColor = (factionMini: FactionMini): factionMini is FactionColorsMini => factionMini in useColorsDark;

export const useColorsLight: { [key in FactionColorsMini]: string } = {
    thebaastards: '#c74c3c',
    kettlemangang: '#ab5179',
    dicenzofamiglia: '#CDC14C',
    moretticrew: '#CDC14C',
    halfwits: '#cfba57',
    guppygang: '#006422',
    thehumblebunch: '#A87C2D',
    coltons: '#a35231',
    taipan: '#2B5586',
    boonsboys: '#B6952F',
    redwater: '#852323',
    themaskedmen: '#A81B90',
    quilgang: '#8B4594',
    thefirm: '#2c9496',
    permatrail: '#453C55',
    development: '#718093',
    law: '#0a0de3',
    rangers: '#1080d6',
    medical: '#9adc58',
    guarma: '#789048',
    onelife: '#453C55',
    conductors: '#566b86',
    sisikaguard: '#2b5d88',
    lifer: '#707066',
    otherfaction: '#12af7e',
    independent: '#12af7e',
    podcast: '#000000',
    watchparty: '#000000',
    otherwrp: '#000000',
    other: '#35b0a8',
    allwildrp: '#ffffff',
    alltwitch: '#ffffff',
} as const;

const filterExclude: { [key in FactionMini]?: boolean } = {
    otherfaction: true,
    otherwrp: true,
};

type FactionMiniArr = FactionMini[];

const filterOrderTop: FactionMiniArr = [
    'allwildrp',
    'alltwitch',
    'independent',
    'law',
    'rangers',
    'thebaastards',
    'kettlemangang',
    'medical',
];

const filterOrderAfterHasColor: FactionMiniArr = ['development'];

const filterOrderAfterNoColor: FactionMiniArr = ['guessed', 'podcast', 'watchparty', 'other'];

const filterOrder: { [key in FactionMini]?: number } = Object.assign(
    {},
    ...filterOrderTop.map((mini, index) => ({ [mini]: index + 1 })),
    ...filterOrderAfterHasColor.map((mini, index) => ({ [mini]: 1000 + index + 1 })),
    ...filterOrderAfterNoColor.map((mini, index) => ({ [mini]: 3000 + index + 1 }))
);

export const filterRename: { [key in FactionMini]?: string } = {
    allwildrp: 'All WildRP (Default)',
    alltwitch: 'All Twitch (No Filtering)',
    law: 'Law',
    lifer: 'Sisika Lifer',
    thehumblebunch: 'Unnamed (The Humble Bunch)',
    boonsboys: 'Boon’s Boys',
    redwater: 'Red Water Co.',
    bluestone: 'Bluestone Security',
    topaota: 'To’Pa Ota',
    permatrail: 'The Perma Trail',
    news: 'Saint’s Daily Newspaper',
    lostsouls: 'Church of Lost Souls',
    onelife: 'One Life Characters',
    otherwrp: 'Unknown RPers',
    other: 'Other Servers',
    guessed: 'Uncertain',
};

export const filterFactionsBase: [FactionMini, string, boolean][] = objectEntries(wrpFactions)
    .filter(mini => !(mini[0] in filterExclude))
    .sort((miniA, miniB) => (filterOrder[miniA[0]] || (miniA[0] in useColorsDark ? 1000 : 2000)) - (filterOrder[miniB[0]] || (miniB[0] in useColorsDark ? 1000 : 2000)))
    .map(mini => [mini[0], filterRename[mini[0]] || mini[1], true]);

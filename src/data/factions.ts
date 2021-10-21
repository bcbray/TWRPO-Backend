/* eslint-disable no-useless-escape */
/* eslint-disable max-len */

import { mergeRegex, objectEntries } from '../utils';
import { npFactions, npFactionsRealMini } from './meta';

import type { FactionMini, FactionRealMini } from './meta';

const noAutoFaction = {
    independent: true,
    otherfaction: true,
    other: true,
    cleanbois: true,
    russians: true,
    chaos: true,
    mechanic: true,
} as const;

export type NpFactionsRegexKeys = Exclude<FactionRealMini, keyof typeof noAutoFaction>;

const noLater = (reg: RegExp) => mergeRegex(['(?:', reg, ')', /(?!(?:[\s-_]+(?:char\w*|roleplay|rp))?[^\w.;]+(?:later|after))/i]);

const noFormer = (reg: RegExp) => mergeRegex([/(?<!(?:\b|_)(?:vs?|versus|against|e?x|former|fake|wanna\s*be|fighting|with|becom\w+\s+a|for|then)(?:\s+(?:th?e|some|all|every|el|la|da))?[^a-z0-9]*|vs?)/i, '(?:', reg, ')']);

export const npFactionsRegex = {
    lostmc: noLater(noFormer(/lost\s*mc|the\s*lost\b/i)),
    changgang: noFormer(/chang\s*gang|\bcga?\b/i),
    streetteam: noFormer(/street\s*team|\bst\b/i),
    cleancartel: noFormer(/\bclean\s*cartel/i),
    vagos: noLater(noFormer(/vagos|\bvago\b|yellow[\s\-]*gang|\besv\b/i)),
    gsf: noLater(noFormer(/grove|\bgsf\b/i)),
    ssb: noLater(noFormer(/\bball+a|\besb\b|\bssb\b(?![\s\-]+(?:wo?rld|later))/i)),
    bsk: noFormer(/\bb[s$]k\b|brouge street|burger shot king/i),
    marabunta: noLater(noFormer(/\bmarabunta/i)),
    hoa: noFormer(/\bh[.\s]*o[.\s\-_]*[ab]\b|hogs\s*of\s*anarchy|home[\s\-]*owners[\s\-]*association/i),
    pinkgang: noFormer(/\bpittman|(?:pink|\bpit+?)[\s\-_.]*(?:gang|crew)/i), // [^\w\s(]\s*pc\s*[^\w\s)]
    doj: noLater(noFormer(/\bdoj\b|department\s*of\s*justice|judge\b(?![\s]*me)|\bd\.a\b|\ba\.?d\.?a\b|(?<!\b(?:former|ex|aspiring)[\s\-]*)(?:lawyer|attorney)|para[\s\-]*legal/i)),
    asrr: noLater(noFormer(/\balta[\s\-]*street|\bblock(?:\b|[\s\-]*party|[\s\-]*athon)/i)),
    dans: noLater(noFormer(/\bdans\b|g[le][el][\s\-_.]+dan/i)),
    angels: noFormer(/(?<!rejected[\s\-_.]*)\bangels\b/i),
    nbc: noFormer(/\bnbc\b/i),
    mandem: noFormer(/\bmandem|\bmdma?\b/i),
    bbmc: noFormer(/\bbbmc\b|\bbondi/i),
    stable: noLater(noFormer(/\bstable(?:hand)?\b/i)),
    podcast: noLater(noFormer(/\b(?<!!)podcast\b/i)),
    gulaggang: noLater(noFormer(/\bgulag[\s\-_.]*gang/i)),
    condemnedmc: noLater(noFormer(/\bcondemned|\bcmc\b/i)),
    news: noFormer(/(?<!(?:good|big|great|amazing|bad|some)\s*)\bnews\b|\blsbn\b|weazel[\s\-_.]*news/i),
    rooster: noFormer(/\brr\b|\brooster[^\w\s]?(?:s|\b)|rooster[\s\-_.]*(?:rest|ranch|reef|inn|hotel|cab)/i),
    burgershot: noFormer(/(?<!(?:everyone|people)\s+at\s+)burger[\s\-]*shot|\bburgers\b|\bburgersh/i),
    development: /\bdevelop|\bdev\b|\bcoding|devathon/i,
    doc: noLater(noFormer(/\bdoc\b|\bcorrection/i)),
    frat: noLater(noFormer(/\bfrat\b/i)),
    prison: noLater(/\blifer|\bprison|\blife\W+sentence/i),
    harmony: /\bharmony\b/i,
    quickfix: /\bquick[\s\-]*fix/i,
    tunershop: /\btun(?:er|a)[\s\-]*shop\b|\b6str\W*tun(?:er|a)\b/i,
    larpers: /\blarp\b|\blarper|the\s*guild/i,
    police: noLater(noFormer(
        mergeRegex([
            /(?<!\bthen\b.*|!|\bformer\b[\s\w]+|corrections\s+|\bdoc\s+|\bmedic\w*\s+|\bems\s+)/i,
            /(?:\bcop\b|chief of police|officer|der?puty|\bd-\d|\bdispatch\b|ride[\s\-_.]*along|sergeant|lieutenant|corporal|sheriff|trooper|cadet|\b(?:ranger|dt|sgt|cpl|cpt|ofc|lspd|sasp|bcso|police[\s\-_]*academy|lt(?![^|!]*\bjones\b))\b)/i,
            /(?!\?)/i,
        ])
    )),
    medical: noLater(/(?<!then\b.*|!)(?:doctor|paramedic|therapist|psychologist|\b(?:dr|em[st])\b)/i),
} as { [key in NpFactionsRegexKeys]: RegExp };

export const npFactionsSubRegex: { [key in FactionRealMini]?: [string, RegExp][] } = {
    police: [
        ['Dispatch', /\bd-\d|\bdispatch\b/i],
        ['Ride Along', /ride[\s\-_.]*along/i],
    ],
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
    news: true,
    rooster: true,
    burgershot: true,
    development: true,
    mechanic: true,
    harmony: true,
    quickfix: true,
    tunershop: true,
} as const;
// validateType<{ [key in FactionRealMini]?: true }>(lesserFactions);
// const checkKeys: FactionRealMini = (null!) as keyof typeof lesserFactions;

export const greaterFactions: { [key in FactionRealMini]?: true } = {
    podcast: true,
} as const;

export type NpFactionsRegexMini = keyof typeof npFactionsRegex;

const has = <K extends string>(key: K, x: Record<string, unknown>): x is { [key in K]: unknown } => key in x;

const keepS: { [key in FactionRealMini]?: boolean } = { pegasus: true, news: true, russians: true, dans: true };

npFactionsRealMini.forEach((faction) => {
    const fullFaction = npFactions[faction];
    if (!has(faction, noAutoFaction) && !has(faction, npFactionsRegex)) {
        faction = faction as NpFactionsRegexKeys;
        let regStr = RegExp.escape(fullFaction[fullFaction.length - 1] === 's' && !keepS[faction] ? fullFaction.slice(0, -1) : fullFaction).toLowerCase();
        if (regStr.length <= 4) {
            regStr = `\\b${regStr}\\b`;
        } else {
            regStr = `\\b${regStr}`;
        }
        console.log(faction);
        npFactionsRegex[faction] = new RegExp(regStr, 'i');
    }
});

// export type NoFactionColorsMini = 'alltwitch' | 'allnopixel' | 'darkweb' | 'news' | 'russians' | 'condemnedmc' | 'mersions' | 'lunatix' | 'marabunta';
// type FactionColorsMini = Exclude<FactionMini, NoFactionColorsMini>;
// : { [key in FactionColorsMini]: string }

export const useColorsDark = { // #f9002f
    cleanbois: '#e74c3c',
    limelight: '#bfff00',
    lostmc: '#ab5179',
    changgang: '#686de0',
    streetteam: '#32ff7e',
    cleancartel: '#32ff7e',
    vagos: '#f1c40f',
    gsf: '#006422',
    ssb: '#9b59b6',
    bsk: '#7957D4',
    pegasus: '#A87C2D',
    hoa: '#a6033a',
    doj: '#00a032',
    asrr: '#a35231',
    angels: '#ff9ff3',
    mandem: '#F95FAB',
    pinkgang: '#ff77ff',
    nbc: '#789500',
    bbmc: '#3B64E6',
    burgershot: '#E99062',
    development: '#718093',
    condemnedmc: '#90fa8f',
    doc: '#0984e3',
    prison: '#1C8EA2',
    stable: '#40739e',
    larpers: '#ffeaa7',
    police: '#0abde3',
    medical: '#badc58',
    otherfaction: '#32ff7e',
    independent: '#32ff7e',
    podcast: '#ffffff',
    othernp: '#ffffff',
    international: '#f780a1',
    publicnp: '#81ecec',
    other: '#429e9d',
    allnopixel: '#ffffff',
    alltwitch: '#ffffff',
} as const;

export type FactionColorsMini = keyof typeof useColorsDark;

export type FactionColorsRealMini = FactionRealMini & FactionColorsMini;

export const isFactionColor = (factionMini: FactionMini): factionMini is FactionColorsMini => factionMini in useColorsDark;

export const useColorsLight: { [key in FactionColorsMini]: string } = {
    cleanbois: '#c74c3c',
    limelight: '#bfff00',
    lostmc: '#ab5179',
    changgang: '#686de0',
    streetteam: '#12af7e',
    cleancartel: '#12af7e',
    vagos: '#e3ba16',
    gsf: '#006422',
    ssb: '#9b59b6',
    bsk: '#8854d0',
    pegasus: '#A87C2D',
    hoa: '#a6033a',
    doj: '#00a032',
    asrr: '#a35231',
    angels: '#e192d7',
    nbc: '#789500',
    mandem: '#e84393',
    pinkgang: '#ff77ff',
    bbmc: '#2250ff',
    burgershot: '#c77c50',
    development: '#718093',
    condemnedmc: '#6ab36a',
    doc: '#1080d6',
    prison: '#1C8EA2',
    stable: '#40739e',
    larpers: '#cfba57',
    police: '#0a0de3',
    medical: '#9adc58',
    otherfaction: '#12af7e',
    independent: '#12af7e',
    podcast: '#000000',
    othernp: '#000000',
    international: '#8faf7f',
    publicnp: '#65b1b8',
    other: '#35b0a8',
    allnopixel: '#ffffff',
    alltwitch: '#ffffff',
} as const;

const filterExclude: { [key in FactionMini]?: boolean } = {
    mechanic: true,
    harmony: true,
    quickfix: true,
    mersions: true,
    podcast: true,
    otherfaction: true,
    othernp: true,
};

type FactionMiniArr = FactionMini[];

const filterOrderTop: FactionMiniArr = [
    'allnopixel',
    'alltwitch',
    'publicnp',
    'independent',
    'cleanbois',
    'changgang',
    'police',
    'doj',
    'limelight',
    'vagos',
    'ssb',
    'bsk',
    'gsf',
    'cleancartel',
    'rooster',
    'tunershop',
    'hoa',
    'lostmc',
    'stable',
    'burgershot',
    'prison',
    'nbc',
    'bbmc',
    'mandem',
    'pinkgang',
    'asrr',
    'streetteam',
    'britneygang',
    'pegasus',
    'condemnedmc',
    'gulaggang',
    'angels',
];

const filterOrderAfterHasColor: FactionMiniArr = ['larpers', 'medical', 'doc', 'development'];

const filterOrderAfterNoColor: FactionMiniArr = ['podcast', 'international', 'other'];

const filterOrder: { [key in FactionMini]?: number } = Object.assign(
    {},
    ...filterOrderTop.map((mini, index) => ({ [mini]: index + 1 })),
    ...filterOrderAfterHasColor.map((mini, index) => ({ [mini]: 1000 + index + 1 })),
    ...filterOrderAfterNoColor.map((mini, index) => ({ [mini]: 3000 + index + 1 }))
);

const filterRename: { [key in FactionMini]?: string } = {
    allnopixel: 'All NoPixel (Default)',
    alltwitch: 'All Twitch (No Filtering)',
    publicnp: 'NoPixel Public',
    international: 'NoPixel International',
    hoa: 'Home Owners Association',
    asrr: 'Alta Street Ruff Rydaz',
    nbc: 'Natural Born Crackheads',
    bsk: 'Brouge Street Kingz',
    bbmc: 'Bondi Boys MC',
    rooster: 'Rooster Companies',
    doc: 'Department of Corrections',
    doj: 'Law & Government', // Lawyers & Judges
    ssb: 'Ballas',
    gsf: 'Grove Street Families',
    larpers: 'The Guild',
    stable: 'The Stable',
    mandem: 'The Mandem',
    prison: 'Prison Lifers',
    angels: 'The Angels',
    lunatix: 'Lunatix MC',
    britneygang: 'Britney Gang',
    othernp: 'Unknown RPers',
    other: 'Other Servers',
};

export const filterFactionsBase: [FactionMini, string, boolean][] = objectEntries(npFactions)
    .filter(mini => !(mini[0] in filterExclude))
    .sort((miniA, miniB) => (filterOrder[miniA[0]] || (miniA[0] in useColorsDark ? 1000 : 2000)) - (filterOrder[miniB[0]] || (miniB[0] in useColorsDark ? 1000 : 2000)))
    .map(mini => [mini[0], filterRename[mini[0]] || mini[1], true]);

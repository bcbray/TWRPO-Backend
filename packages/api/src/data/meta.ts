export const wrpFactionsReal = { // map: removed spaces + converted to lower case
    thebaastards: 'The Baastards',
    kettlemangang: 'Kettleman Gang',
    rangers: 'Rangers',
    dicenzofamiglia: 'DiCenzo Famiglia',
    moretticrew: 'Moretti Crew',
    halfwits: 'Half Wits',
    guppygang: 'Guppy Gang',
    thehumblebunch: 'The Humble Bunch',
    deadendgang: 'Dead End Gang',
    coltons: 'Coltons',
    thenameless: 'The Nameless',
    hagen: 'Hagen',
    taipan: 'Taipan',
    boonsboys: 'Boons Boys',
    redwater: 'Red Water',
    themaskedmen: 'The Masked Men',
    freemanfamily: 'Freeman Family',
    quilgang: 'Quil Gang',
    bellgang: 'Bell Gang',
    theblackcompany: 'The Black Company',
    milesgang: 'Miles Gang',
    '10tonnegang': '10 Tonne Gang',
    littlegang: 'Little Gang',
    daughtersoffenrir: 'Daughters of Fenrir',
    dellobos: 'Del Lobos',
    thefirm: 'The Firm',
    bluestone: 'Bluestone',
    theward: 'The Ward',
    thestrays: 'The Strays',
    fullerhouse: 'Fuller House',
    sunwarriors: 'Sun Warriors',
    wapiti: 'Wapiti',
    topaota: 'ToPa Ota',
    kellygang: 'Kelly Gang',
    fraziergang: 'Frazier Gang',
    pruittgang: 'Pruitt Gang',
    permatrail: 'Perma Trail',
    woodsgang: 'Woods Gang',
    lostsouls: 'Lost Souls',
    news: 'News',
    development: 'Development',
    law: 'Law',
    medical: 'Medical',
    conductors: 'Conductors',
    sisikaguard: 'Sisika Guard',
    lifer: 'Lifer',
    guarma: 'Guarma',
    independent: 'Independent',
    otherfaction: 'Other Faction',
    other: 'Other',
    podcast: 'Podcast',
    watchparty: 'Watch Party',
    onelife: 'One Life',
} as const;

export const wrpFactionsMeta = {
    allwildrp: 'All WildRP',
    alltwitch: 'All Twitch',
    otherwrp: 'Other WRP',
    guessed: 'Guessed',
} as const;

type WrpFactionsReal = typeof wrpFactionsReal;
type WrpFactionsMeta = typeof wrpFactionsMeta;

export const wrpFactions: WrpFactionsReal & WrpFactionsMeta = { ...wrpFactionsReal, ...wrpFactionsMeta } as const;

export type WrpFactions = typeof wrpFactions;

export type FactionRealMini = keyof WrpFactionsReal;
export type FactionRealFull = (WrpFactionsReal)[FactionRealMini];

export type FactionMini = keyof WrpFactions;
export type FactionFull = (WrpFactions)[FactionMini];

export const wrpFactionsRealMini: FactionRealMini[] = (Object.keys(wrpFactionsReal) as FactionRealMini[]);
export const wrpFactionsMini: FactionMini[] = (Object.keys(wrpFactions) as FactionMini[]);

export const wrpFactionsReal = { // map: removed spaces + converted to lower case
    samsclub: 'Sams Club',
    kettlemangang: 'Kettleman Gang',
    rangers: 'Rangers',
    dicenzofamiglia: 'DiCenzo Famiglia',
    halfwits: 'Half Wits',
    guppygang: 'Guppy Gang',
    thehumblebunch: 'The Humble Bunch',
    deadendkids: 'Dead End Kids',
    coltons: 'Coltons',
    thenameless: 'The Nameless',
    summersgang: 'Summers Gang',
    kellygang: 'Kelly Gang',
    development: 'Development',
    law: 'Law',
    medical: 'Medical',
    conductors: 'Conductors',
    independent: 'Independent',
    otherfaction: 'Other Faction',
    other: 'Other',
    podcast: 'Podcast',
    watchparty: 'Watch Party',
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

export interface Podcast {
    name: string;
    nicknames?: string[];
}

const reg = (r: RegExp): string => `/${r.source}/`;

export const wrpPodcasts: Podcast[] = [
    { name: 'RP Theory', nicknames: [reg(/\b(?:(?<!!)rp\s*theory)\b/i)] },
];

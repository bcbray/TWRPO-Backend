import { LiveResponse, FactionInfo } from './types';

export const ignoredFactions = ['other', 'alltwitch'];
export const ignoredFilterFactions = ['otherwrp', 'allwildrp', 'guessed', ...ignoredFactions]

export function factionsFromLive(
  live: LiveResponse,
  options: {
    ignoredKeys?: string[],
    ignoredFilterKeys?: string[],
    fallbackColorLight?: string,
    fallbackColorDark?: string,
  } = {}
): FactionInfo[] {
  const {
    ignoredKeys = ignoredFactions,
    ignoredFilterKeys = ignoredFilterFactions,
    fallbackColorLight = '#12af7e',
    fallbackColorDark = '#32ff7e',
  } = options;

  return Object.entries(live.wrpFactions)
    .filter(([key]) => !ignoredKeys.includes(key))
    .map(([key, rawName]) => {
      const filterFaction = live.filterFactions.find(([k]) => k === key);
      const [name, isLive] = filterFaction ? [filterFaction[1], filterFaction[2]] : [rawName, false];
      return {
        key,
        name,
        colorLight: live.useColorsLight[key] ?? fallbackColorLight,
        colorDark: live.useColorsDark[key] ?? fallbackColorDark,
        liveCount: live.factionCount[key],
        isLive,
        hideInFilter: filterFaction === null || ignoredFilterKeys.includes(key),
      };
    });
}

export const formatViewers = (viewers: number) => {
  if (viewers === 1) {
    return '1 viewer';
  }

  let maximumFractionDigits = 0;
  let suffix = '';
  let denominator = 1;
  if (viewers >= 1000) {
    maximumFractionDigits = (viewers < 100000) ? 1 : 0;
    suffix = 'K'
    denominator = 1000;
  }
  const formatted = (viewers/denominator).toLocaleString(undefined, { maximumFractionDigits: maximumFractionDigits });

  return `${formatted}${suffix} viewers`;
}

type ClassPart = string | false | null | undefined | ClassPart[];

export const classes = (...parts: ClassPart[]): string | undefined => {
  let names: string[] = [];
  parts.forEach((part) => {
    if (!part) return;
    if (typeof part == 'string') {
      names.push(part);
    } else if (Array.isArray(part)) {
      names.concat(classes(part) ?? []);
    } else {
      // At this point, `part` is `never` type, but in case we somehow fall in here
      console.warn('Unknown class part:', part);
    }
  });
  if (names.length === 0) {
    return undefined;
  }
  return names.join(' ');
}

export function createChainedFunction<Args extends any[], This>(
  ...funcs: Array<(this: This, ...args: Args) => any>
): (this: This, ...args: Args) => void {
  return funcs
    .filter((f) => f != null)
    .reduce((acc, f) => {
      if (f === null) {
        return acc;
      }

      return function chainedFunction(...args: any[]) {
        // @ts-ignore
        acc.apply(this, args);
        // @ts-ignore
        f.apply(this, args);
      };
    }, () => {});
}

export const formatDuration = (start: Date, end: Date): string => {
  const totalSeconds = (end.getTime() - start.getTime()) / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

/*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    A fast and simple hash function with decent collision resistance.
    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
    Public domain. Attribution appreciated.
*/
export const cyrb53 = function(str: string, seed: number = 0): number {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

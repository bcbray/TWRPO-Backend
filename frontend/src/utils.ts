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

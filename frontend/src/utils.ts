import { LiveResponse, FactionInfo } from './types';

export const ignoredFactions = ['other', 'alltwitch'];
export const ignoredFilterFactions = ['otherwrp', 'allwildrp', 'guessed', ...ignoredFactions]

export function factionsFromLive(
  live: LiveResponse,
  options: {
    ignoredKeys?: string[],
    fallbackColorLight?: string
    fallbackColorDark?: string
  } = {}
): FactionInfo[] {
  const {
    ignoredKeys = ['other', 'alltwitch'],
    fallbackColorLight = '#12af7e',
    fallbackColorDark = '#32ff7e',
  } = options;

  return live.filterFactions
    .filter(([key]) => !ignoredKeys.includes(key))
    .map(([key, name, isLive]) => {
      return {
        key,
        name,
        colorLight: live.useColorsLight[key] ?? fallbackColorLight,
        colorDark: live.useColorsDark[key] ?? fallbackColorDark,
        liveCount: live.factionCount[key],
        isLive,
      }
    })
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

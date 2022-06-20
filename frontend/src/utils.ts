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

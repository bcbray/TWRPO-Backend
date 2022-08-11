import React from 'react';
import tinycolor from 'tinycolor2';

import { useFactions } from './Data';
import LoadingState, { isSuccess } from './LoadingState';
import { FactionInfo, FactionsResponse } from './types';
import { cyrb53 } from './utils';
import { PreloadedDataContext } from './Data';

const rootFactionStyles = (factions: FactionInfo[]) => {
  return {
    '--faction-color-fallback-light': '#12af7e',
    '--faction-color-fallback-dark': '#32ff7e',
    '--faction-color-fallback-light-hover': tinycolor('#12af7e').darken().toString(),
    '--faction-color-fallback-dark-hover': tinycolor('#32ff7e').darken().toString(),
    ...Object.fromEntries(factions.flatMap(faction => [
      [
        `--faction-color-light-${faction.key}`,
        faction.colorLight,
      ],
      [
        `--faction-color-light-${faction.key}-hover`,
        tinycolor(faction.colorLight).darken().toString(),
      ],
      [
        `--faction-color-dark-${faction.key}`,
        faction.colorDark,
      ],
      [
        `--faction-color-dark-${faction.key}-hover`,
        tinycolor(faction.colorDark).darken().toString(),
      ],
    ]))
  }
}

export const rootFactionStylesheetContents = (factions: FactionInfo[]): [string, string] => {
  var contents = `:root { ${
    Object.entries(rootFactionStyles(factions)).map(([k, v]) => `${k}: ${v}`).join('; ')
  } }`;
  return [contents, cyrb53(contents).toString(16)];
}

const useInstallFactionCss = (loadState: LoadingState<FactionsResponse, Error>) => {
  const factions = isSuccess(loadState) ? loadState.data.factions : null;
  React.useEffect(() => {
    if (!factions) {
      return;
    }
    if (typeof document === 'undefined') {
      return;
    }
    if (!document.head) {
      return;
    }
    const existing = document.getElementById('root-faction-styles');
    const existingHash = existing?.dataset.styleHash;
    const [styles, hash] = rootFactionStylesheetContents(factions);
    if (existingHash === hash) {
      return;
    }
    let styleElement: HTMLElement;
    if (existing) {
      while (existing.firstChild) {
        existing.removeChild(existing.firstChild);
      }
      styleElement = existing;
    } else {
      styleElement = document.createElement('style');
      document.head.appendChild(styleElement)
    }
    styleElement.dataset.styleHash = hash;
    styleElement.appendChild(document.createTextNode(styles));
  }, [factions]);
}


const factionStyles = (faction: FactionInfo) => factionStylesForKey(faction.key);

const factionStylesForKey = (key?: string): React.CSSProperties => {
  if (key) {
    return {
      '--faction-color-light': `var(--faction-color-light-${key}, var(--faction-color-fallback-light))`,
      '--faction-color-dark': `var(--faction-color-dark-${key}, var(--faction-color-fallback-dark))`,
      '--faction-color-light-hover': `var(--faction-color-light-${key}-hover, var(--faction-color-fallback-light-hover))`,
      '--faction-color-dark-hover': `var(--faction-color-dark-${key}-hover, var(--faction-color-fallback-dark-hover))`,
    } as React.CSSProperties;
  } else {
    return {
      '--faction-color-light': `var(--faction-color-fallback-light)`,
      '--faction-color-dark': `var(--faction-color-fallback-dark)`,
      '--faction-color-light-hover': `var(--faction-color-fallback-light-hover)`,
      '--faction-color-dark-hover': `var(--faction-color-fallback-dark-hover)`,
    } as React.CSSProperties;
  }

};

interface FactionStyleProviderProps {
  children: React.ReactElement;
}

const FactionStyleProviderContext = React.createContext<{ hasProvided: boolean; needsFactionCss: () => void } | null>(null);

export const FactionStyleContextProvider: React.FC<FactionStyleProviderProps> = ({ children }) => {
  const [hasProvided, setHasProvided] = React.useState(false);
  const [loadState] = useFactions({ needsLoad: hasProvided });
  useInstallFactionCss(loadState);

  return (
    <FactionStyleProviderContext.Provider
      value={{
        hasProvided,
        needsFactionCss: () => { setHasProvided(true) }
      }}
    >
      {children}
    </ FactionStyleProviderContext.Provider>
  );
}

export interface FactionMethods {
  factionStyles: typeof factionStyles;
  factionStylesForKey: typeof factionStylesForKey;
}

export const useFactionCss = (): FactionMethods => {
  const context = React.useContext(FactionStyleProviderContext);
  if (!context) {
    console.warn('Missing FactionStyleContextProvider in tree');
  }
  React.useEffect(() => context?.needsFactionCss(), [context]);

  const preloadedContext = React.useContext(PreloadedDataContext);
  preloadedContext.usedFactionCss = true;

  return { factionStyles, factionStylesForKey };
}

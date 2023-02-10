import React from 'react';
import tinycolor from 'tinycolor2';
import { FactionInfo, FactionsResponse, ServerBase } from '@twrpo/types';

import { useFactions } from './Data';
import LoadingState, { isSuccess } from './LoadingState';
import { cyrb53 } from './utils';
import { PreloadedUsedContext } from './Data';

const rootFactionStyles = (server: ServerBase, factions: FactionInfo[]) => {
  return {
    '--faction-color-fallback-light': '#12af7e',
    '--faction-color-fallback-dark': '#32ff7e',
    '--faction-color-fallback-light-hover': tinycolor('#12af7e').darken().toString(),
    '--faction-color-fallback-dark-hover': tinycolor('#32ff7e').brighten(20).toString(),
    '--faction-color-fallback-light-active': tinycolor('#12af7e').darken(20).toString(),
    '--faction-color-fallback-dark-active': tinycolor('#32ff7e').brighten(40).toString(),
    [`--faction-color-${server.id}-light-otherwrp`]: '#000',
    [`--faction-color-${server.id}-dark-otherwrp`]: '#fff',
    [`--faction-color-${server.id}-light-otherwrp-hover`]: 'var(--faction-color-light-otherwrp)',
    [`--faction-color-${server.id}-dark-otherwrp-hover`]: 'var(--faction-color-dark-fallback)',
    [`--faction-color-${server.id}-light-otherwrp-active`]: 'var(--faction-color-light-otherwrp)',
    [`--faction-color-${server.id}-dark-otherwrp-active`]: 'var(--faction-color-dark-otherwrp)',
    ...Object.fromEntries(factions.flatMap(faction => [
      [
        `--faction-color-${server.id}-light-${faction.key}`,
        faction.colorLight,
      ],
      [
        `--faction-color-${server.id}-light-${faction.key}-hover`,
        tinycolor(faction.colorLight).darken().toString(),
      ],
      [
        `--faction-color-${server.id}-light-${faction.key}-active`,
        tinycolor(faction.colorLight).darken(20).toString(),
      ],
      [
        `--faction-color-${server.id}-dark-${faction.key}`,
        faction.colorDark,
      ],
      [
        `--faction-color-${server.id}-dark-${faction.key}-hover`,
        tinycolor(faction.colorDark).brighten(20).toString(),
      ],
      [
        `--faction-color-${server.id}-dark-${faction.key}-active`,
        tinycolor(faction.colorDark).brighten(40).toString(),
      ],
    ]))
  }
}

export const rootFactionStylesheetContents = (server: ServerBase, factions: FactionInfo[]): [string, string] => {
  var contents = `:root { ${
    Object.entries(rootFactionStyles(server, factions)).map(([k, v]) => `${k}: ${v}`).join('; ')
  } }`;
  return [contents, cyrb53(contents).toString(16)];
}

const useInstallFactionCss = (server: ServerBase, loadState: LoadingState<FactionsResponse, Error>) => {
  const factions = isSuccess(loadState) ? loadState.data.factions : null;
  React.useEffect(() => {
    if (!factions || factions.length === 0) {
      return;
    }
    if (typeof document === 'undefined') {
      return;
    }
    if (!document.head) {
      return;
    }
    const existing = document.getElementById(`root-faction-styles-${server.id}`);
    const existingHash = existing?.dataset.styleHash;
    const [styles, hash] = rootFactionStylesheetContents(server, factions);
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
      styleElement.id = `root-faction-styles-${server.id}`;
      document.head.appendChild(styleElement)
    }
    styleElement.dataset.styleHash = hash;
    styleElement.appendChild(document.createTextNode(styles));
  }, [factions, server]);
}


const factionStyles = (server: ServerBase) => (faction: FactionInfo) => factionStylesForKey(server)(faction.key);

const factionStylesForKey = (server: ServerBase) => (key?: string): React.CSSProperties => {
  if (key) {
    return {
      '--faction-color-light': `var(--faction-color-${server.id}-light-${key}, var(--faction-color-fallback-light))`,
      '--faction-color-dark': `var(--faction-color-${server.id}-dark-${key}, var(--faction-color-fallback-dark))`,
      '--faction-color-light-hover': `var(--faction-color-${server.id}-light-${key}-hover, var(--faction-color-fallback-light-hover))`,
      '--faction-color-dark-hover': `var(--faction-color-${server.id}-dark-${key}-hover, var(--faction-color-fallback-dark-hover))`,
      '--faction-color-light-active': `var(--faction-color-${server.id}-light-${key}-active, var(--faction-color-fallback-light-active))`,
      '--faction-color-dark-active': `var(--faction-color-${server.id}-dark-${key}-active, var(--faction-color-fallback-dark-active))`,
    } as React.CSSProperties;
  } else {
    return {
      '--faction-color-light': `var(--faction-color-fallback-light)`,
      '--faction-color-dark': `var(--faction-color-fallback-dark)`,
      '--faction-color-light-hover': `var(--faction-color-fallback-light-hover)`,
      '--faction-color-dark-hover': `var(--faction-color-fallback-dark-hover)`,
      '--faction-color-light-active': `var(--faction-color-fallback-light-active)`,
      '--faction-color-dark-active': `var(--faction-color-fallback-dark-active)`,
    } as React.CSSProperties;
  }
};

interface FactionStyleProviderProps {
  children: React.ReactElement;
}

const FactionStyleProviderContext = React.createContext<{
  needsFactionCss: (server: ServerBase) => void
} | null>(null);

const FactionStyleLoader: React.FC<{ server: ServerBase }> = ({ server }) => {
  const [loadState] = useFactions({ serverId: server.id });
  useInstallFactionCss(server, loadState);
  return <></>;
}

export const FactionStyleContextProvider: React.FC<FactionStyleProviderProps> = ({ children }) => {
  const [servers, setServers] = React.useState<ServerBase[]>([]);

  const needsFactionCss = React.useCallback((server: ServerBase) => (
    setServers(servers => servers.some(s => s.id === server.id) ? servers : [...servers, server])
  ), []);

  return (
    <FactionStyleProviderContext.Provider value={{ needsFactionCss }}>
      {servers.map(s => <FactionStyleLoader key={s.id} server={s}/>)}
      {children}
    </ FactionStyleProviderContext.Provider>
  );
}

export interface FactionMethods {
  factionStyles: ReturnType<typeof factionStyles>;
  factionStylesForKey: ReturnType<typeof factionStylesForKey>;
}

export const useFactionCss = (server: ServerBase): FactionMethods => {
  const context = React.useContext(FactionStyleProviderContext);
  if (!context) {
    console.warn('Missing FactionStyleContextProvider in tree');
  }
  React.useEffect(() => context?.needsFactionCss(server), [context, server]);

  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (preloadedUsed) {
    if (!preloadedUsed.usedFactionCssServers) {
      preloadedUsed.usedFactionCssServers = [server];
    } else if (!preloadedUsed.usedFactionCssServers.some(s => s.id === server.id)) {
      preloadedUsed.usedFactionCssServers.push(server)
    }
  }

  return {
    factionStyles: factionStyles(server),
    factionStylesForKey: factionStylesForKey(server),
  };
}

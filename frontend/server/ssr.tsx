import { RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import { SSRProvider } from "@restart/ui/ssr";
import { HelmetProvider, FilledContext } from 'react-helmet-async';

import TWRPOApi from '@twrpo/api';
import { LiveResponse, CharactersResponse, FactionsResponse, StreamerResponse } from '@twrpo/types';

import App from '../client/App';
import { SSRRouting, SSRRoutingProvider } from '../client/SSRRouting';
import {
  PreloadedData,
  PreloadedUsed,
  ServerPreloadedDataProvider,
  preloadedDataKey,
} from '../client/Data';
import { rootFactionStylesheetContents } from '../client/FactionStyleProvider';

const ssrHandler = (api: TWRPOApi): RequestHandler => async (req, res) => {
  try {
    let indexHTML = fs.readFileSync(path.resolve('build/index.html'), {
      encoding: 'utf8',
    });

    const now = new Date();

    const preload = (() => {
      const routingContext: SSRRouting = {};
      const preloadedData: PreloadedData = {
        now: JSON.stringify(now),
      }
      const used: PreloadedUsed = {};
      const helmetContext = {};

      ReactDOMServer.renderToString(
        <ServerPreloadedDataProvider data={preloadedData} used={used}>
          <SSRProvider>
            <SSRRoutingProvider value={routingContext}>
              <HelmetProvider context={helmetContext} >
                <StaticRouter location={req.url}>
                  <App />
                </StaticRouter>
              </HelmetProvider>
            </SSRRoutingProvider>
          </SSRProvider>
        </ServerPreloadedDataProvider>
      );
      return used;
    })();

    const preloaded: PreloadedData = {
      now: JSON.stringify(now)
    };

    if (preload.usedLive) {
      const liveResponse = await api.fetchLive();
      // Hacky round-trip through JSON to make sure our types are converted the same
      // TODO: Maybe we should just make an API call?
      preloaded.live = JSON.parse(JSON.stringify(liveResponse)) as LiveResponse;
    }

    if (preload.usedFactions || preload.usedFactionCss) {
      const factionsResponse = await api.fetchFactions();
      // Hacky round-trip through JSON to make sure our types are converted the same
      // TODO: Maybe we should just make an API call?
      preloaded.factions = JSON.parse(JSON.stringify(factionsResponse)) as FactionsResponse;
    }

    if (preload.usedCharacters) {
      const charactersResponse = await api.fetchCharacters();
      // Hacky round-trip through JSON to make sure our types are converted the same
      // TODO: Maybe we should just make an API call?
      preloaded.characters = JSON.parse(JSON.stringify(charactersResponse)) as CharactersResponse;
    }

    if (preload.usedStreamerNames && preload.usedStreamerNames.length) {
      preloaded.streamers = {};
      for (const name of preload.usedStreamerNames) {
        const streamerResponse = await api.fetchStreamer(name);
        if (!streamerResponse) {
          continue;
        }
        // Hacky round-trip through JSON to make sure our types are converted the same
        // TODO: Maybe we should just make an API call?
        preloaded.streamers[name.toLowerCase()] = JSON.parse(JSON.stringify(streamerResponse)) as StreamerResponse;
      }
    }

    const routingContext: SSRRouting = {};
    const helmetContext = {};

    let loadedAppHTML = ReactDOMServer.renderToString(
      <ServerPreloadedDataProvider data={preloaded} used={{}}>
        <SSRProvider>
          <SSRRoutingProvider value={routingContext}>
            <HelmetProvider context={helmetContext} >
              <StaticRouter location={req.url}>
                <App />
              </StaticRouter>
            </HelmetProvider>
          </SSRRoutingProvider>
        </SSRProvider>
      </ServerPreloadedDataProvider>
    );

    if (routingContext.redirect) {
      return res.redirect(routingContext.redirect);
    }

    indexHTML = indexHTML.replace(
      '<script id="preloaded"></script>',
      `<script id="preloaded">
window.${preloadedDataKey} = ${JSON.stringify(preloaded).replace(/</g,'\\u003c')}
</script>`
    )


    if (preloaded.factions && preload.usedFactionCss) {
      const [factionStyles, factionStylesHash] = rootFactionStylesheetContents(preloaded.factions.factions)
      indexHTML = indexHTML.replace(
        '<style id="root-faction-styles"></style>',
        `<style id="root-faction-styles" data-style-hash="${factionStylesHash}">${factionStyles}</style>`
      )
    }

    indexHTML = indexHTML.replace(
      '<div id="root"></div>',
      `<div id="root">${loadedAppHTML}</div>`
    );

    if ('helmet' in helmetContext) {
      const helmet = (helmetContext as FilledContext).helmet;
      helmet.title.toString()
      indexHTML = indexHTML.replace(
        '<title>Twitch WildRP Only</title>',
        `${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}`
      );
    }

    return res
      .status(routingContext.notFound ? 404 : 200)
      .contentType('text/html')
      .send(indexHTML);
  } catch (err) {
    console.error(err);

    // Send a real basic 500 screen
    return res
      .status(500)
      .contentType('text/html')
      .send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<h1>Internal server error</h1>
<p>Something went wrong</p>
</body>
</html>`);
  }
};

export default ssrHandler;

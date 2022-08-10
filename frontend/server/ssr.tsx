import { RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import { SSRProvider } from "@restart/ui/ssr";
import { HelmetProvider, FilledContext } from 'react-helmet-async';

import TWRPOApi from '@twrpo/api';

import App from '../client/App';
import { SSRRouting, SSRRoutingProvider } from '../client/SSRRouting';
import {
  PreloadedData,
  ServerPreloadedDataProvider,
  preloadedDataKey,
} from '../client/Data';
import { LiveResponse, CharactersResponse, FactionsResponse } from '../client/types';
import { rootFactionStylesheetContents } from '../client/FactionStyleProvider';

const ssrHandler = (api: TWRPOApi): RequestHandler => async (req, res) => {
  try {
    let indexHTML = fs.readFileSync(path.resolve('build/index.html'), {
      encoding: 'utf8',
    });

    const now = new Date();

    // TODO: try/catch this
    const liveResponse = await api.fetchLive();
    // Hacky round-trip through JSON to make sure our types are converted the same
    // TODO: Maybe we should just make an API call?
    const live = JSON.parse(JSON.stringify(liveResponse)) as LiveResponse;

    const factionsResponse = await api.fetchFactions();
    // Hacky round-trip through JSON to make sure our types are converted the same
    // TODO: Maybe we should just make an API call?
    const factions = JSON.parse(JSON.stringify(factionsResponse)) as FactionsResponse;

    const charactersResponse = await api.fetchCharacters();
    // Hacky round-trip through JSON to make sure our types are converted the same
    // TODO: Maybe we should just make an API call?
    const characters = JSON.parse(JSON.stringify(charactersResponse)) as CharactersResponse;

    const routingContext: SSRRouting = {};
    const preloadedData: PreloadedData = {
      now: JSON.stringify(now),
      live,
      factions,
      characters,
    }
    const helmetContext = {};

    let appHTML = ReactDOMServer.renderToString(
      <ServerPreloadedDataProvider value={preloadedData}>
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

    // TODO: Actual XSS concerns pls
    // (threat model: someone puts data into a twitch title, which… there's not really anything to XSS right now anyway given we don't have such a thing as authenticated sessions, but still)
    const preloaded: PreloadedData = {
      now: preloadedData.usedNow ? JSON.stringify(now) : undefined,
      live: preloadedData.usedLive ? live : undefined,
      factions: preloadedData.usedFactions || preloadedData.usedFactionCss ? factions : undefined,
      characters: preloadedData.usedCharacters ? characters : undefined,
    }

    indexHTML = indexHTML.replace(
      '<script id="preloaded"></script>',
      `<script id="preloaded">
window.${preloadedDataKey} = ${JSON.stringify(preloaded).replace(/</g,'\\u003c')}
</script>`
    )


    if (preloadedData.usedFactionCss) {
      const [factionStyles, factionStylesHash] = rootFactionStylesheetContents(factions.factions)
      indexHTML = indexHTML.replace(
        '<style id="root-faction-styles"></style>',
        `<style id="root-faction-styles" data-style-hash="${factionStylesHash}">${factionStyles}</style>`
      )
    }

    indexHTML = indexHTML.replace(
      '<div id="root"></div>',
      `<div id="root">${appHTML}</div>`
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

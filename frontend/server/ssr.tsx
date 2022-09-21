import { RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import { SSRProvider } from "@restart/ui/ssr";
import { HelmetProvider, FilledContext } from 'react-helmet-async';

import { TWRPOApi, SessionUser } from '@twrpo/api';
import {
  LiveResponse,
  CharactersResponse,
  FactionsResponse,
  StreamerResponse,
  UnknownResponse,
  UserResponse,
  VideoSegment,
  StreamsResponse,
  ServersResponse,
} from '@twrpo/types';

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

    const userResponse = await api.fetchSessionUser(req.user as SessionUser | undefined);
    const now = new Date();

    const {
      appHtml,
      preloadedData,
      routingContext,
      helmetContext,
      needsFactionCss,
    } = await (async () => {
      const preloadedData: PreloadedData = {
        now: JSON.stringify(now),
      }

      let routingContext: SSRRouting = {};
      let helmetContext = {};
      let needsFactionCss = false;

      let appHtml = '';
      const MAX_LOADS = 5;
      for (let i = 1; i <= MAX_LOADS; i++) {
        routingContext = {};
        helmetContext = {};
        const used: PreloadedUsed = {};

        appHtml = ReactDOMServer.renderToString(
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

        let needsAnotherLoad = false;

        if (used.usedLive) {
          needsAnotherLoad = true;
          const liveResponse = await api.fetchLive(userResponse);
          // Hacky round-trip through JSON to make sure our types are converted the same
          // TODO: Maybe we should just make an API call?
          preloadedData.live = JSON.parse(JSON.stringify(liveResponse)) as LiveResponse;
        }

        if (used.usedFactions || used.usedFactionCss) {
          needsFactionCss = needsFactionCss || used.usedFactionCss === true;
          if (used.usedFactions) {
            needsAnotherLoad = true;
          }
          const factionsResponse = await api.fetchFactions(userResponse);
          // Hacky round-trip through JSON to make sure our types are converted the same
          // TODO: Maybe we should just make an API call?
          preloadedData.factions = JSON.parse(JSON.stringify(factionsResponse)) as FactionsResponse;
        }

        if (used.usedCharactersQueries && used.usedCharactersQueries.length) {
          needsAnotherLoad = true;
          if (!preloadedData.characters) {
            preloadedData.characters = {};
          }
          for (const query of used.usedCharactersQueries) {
            const charactersResponse = await api.fetchCharactersWithQuery(query, userResponse);
            // const streamsResponse = await api.fetchRecentStreams(cursor === '' ? undefined : cursor, userResponse);
            // Hacky round-trip through JSON to make sure our types are converted the same
            // TODO: Maybe we should just make an API call?
            preloadedData.characters[query] = JSON.parse(JSON.stringify(charactersResponse)) as CharactersResponse;
          }
        }

        if (used.usedStreamerNames && used.usedStreamerNames.length) {
          needsAnotherLoad = true;
          if (!preloadedData.streamers) {
            preloadedData.streamers = {};
          }
          for (const name of used.usedStreamerNames) {
            const streamerResponse = await api.fetchStreamer(name, userResponse);
            // Hacky round-trip through JSON to make sure our types are converted the same
            // TODO: Maybe we should just make an API call?
            preloadedData.streamers[name.toLowerCase()] = JSON.parse(JSON.stringify(streamerResponse)) as StreamerResponse | null;
          }
        }

        if (used.usedUnknown) {
          needsAnotherLoad = true;
          const unknownResponse = await api.fetchUnknown(userResponse);
          // Hacky round-trip through JSON to make sure our types are converted the same
          // TODO: Maybe we should just make an API call?
          preloadedData.unknown = JSON.parse(JSON.stringify(unknownResponse)) as UnknownResponse;
        }

        if (used.usedCurrentUser) {
          needsAnotherLoad = true;
          // Hacky round-trip through JSON to make sure our types are converted the same
          // TODO: Maybe we should just make an API call?
          preloadedData.currentUser = JSON.parse(JSON.stringify(userResponse)) as UserResponse;
        }

        if (used.usedSegmentIds && used.usedSegmentIds.length) {
          needsAnotherLoad = true;
          if (!preloadedData.segments) {
            preloadedData.segments = {};
          }
          for (const id of used.usedSegmentIds) {
            const segmentResponse = await api.fetchSegment(id, userResponse);
            // Hacky round-trip through JSON to make sure our types are converted the same
            // TODO: Maybe we should just make an API call?
            preloadedData.segments[id] = JSON.parse(JSON.stringify(segmentResponse)) as VideoSegment | null;
          }
        }

        if (used.usedLiveStreams) {
          needsAnotherLoad = true;
          const liveStreamsResponse = await api.fetchLiveStreams(userResponse);
          // Hacky round-trip through JSON to make sure our types are converted the same
          // TODO: Maybe we should just make an API call?
          preloadedData.liveStreams = JSON.parse(JSON.stringify(liveStreamsResponse)) as StreamsResponse;
        }

        if (used.usedRecentStreamsQueries && used.usedRecentStreamsQueries.length) {
          needsAnotherLoad = true;
          if (!preloadedData.recentStreams) {
            preloadedData.recentStreams = {};
          }
          for (const query of used.usedRecentStreamsQueries) {
            const streamsResponse = await api.fetchRecentStreamsWithQuery(query, userResponse);
            // Hacky round-trip through JSON to make sure our types are converted the same
            // TODO: Maybe we should just make an API call?
            preloadedData.recentStreams[query] = JSON.parse(JSON.stringify(streamsResponse)) as StreamsResponse;
          }
        }

        if (used.usedStreamsQueries && used.usedStreamsQueries.length) {
          needsAnotherLoad = true;
          if (!preloadedData.streams) {
            preloadedData.streams = {};
          }
          for (const query of used.usedStreamsQueries) {
            const streamsResponse = await api.fetchStreamsWithQuery(query, userResponse)
            // Hacky round-trip through JSON to make sure our types are converted the same
            // TODO: Maybe we should just make an API call?
            preloadedData.streams[query] = JSON.parse(JSON.stringify(streamsResponse)) as StreamsResponse;
          }
        }

        if (used.usedUnknownStreamsQueries && used.usedUnknownStreamsQueries.length) {
          needsAnotherLoad = true;
          if (!preloadedData.unknownStreams) {
            preloadedData.unknownStreams = {};
          }
          for (const query of used.usedUnknownStreamsQueries) {
            const streamsResponse = await api.fetchUnknownStreamsWithQuery(query, userResponse);
            // Hacky round-trip through JSON to make sure our types are converted the same
            // TODO: Maybe we should just make an API call?
            preloadedData.unknownStreams[query] = JSON.parse(JSON.stringify(streamsResponse)) as StreamsResponse;
          }
        }

        if (used.usedServers) {
          needsAnotherLoad = true;
          const serversResponse = await api.fetchServers(userResponse);
          // Hacky round-trip through JSON to make sure our types are converted the same
          // TODO: Maybe we should just make an API call?
          preloadedData.servers = JSON.parse(JSON.stringify(serversResponse)) as ServersResponse;
        }

        if (!needsAnotherLoad) {
          break;
        }

        if (needsAnotherLoad && i === MAX_LOADS) {
          console.warn(JSON.stringify({
              level: 'warning',
              event: 'too-many-ssr-loads',
              message: `Required more than ${MAX_LOADS} to render ${req.url}`,
              path: req.url,
          }));
        }
      }
      return {
        appHtml,
        preloadedData,
        routingContext,
        helmetContext,
        needsFactionCss,
      };
    })();

    if (routingContext.redirect) {
      return res.redirect(routingContext.redirect);
    }

    indexHTML = indexHTML.replace(
      '<script id="preloaded"></script>',
      `<script id="preloaded">
window.${preloadedDataKey} = ${JSON.stringify(preloadedData).replace(/</g,'\\u003c')}
</script>`
    )


    if (preloadedData.factions && needsFactionCss) {
      const [factionStyles, factionStylesHash] = rootFactionStylesheetContents(preloadedData.factions.factions)
      indexHTML = indexHTML.replace(
        '<style id="root-faction-styles"></style>',
        `<style id="root-faction-styles" data-style-hash="${factionStylesHash}">${factionStyles}</style>`
      )
    }

    indexHTML = indexHTML.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
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

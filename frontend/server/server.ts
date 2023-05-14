import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';
import { Logger } from 'winston';
import { TWRPOApi } from '@twrpo/api';

import ssr from './ssr';
import sitemap from './sitemap';
import { authentication } from './authentication';

interface ServerOptions {
  twrpo: TWRPOApi;
  twitchClientId: string;
  twitchClientSecret: string;
  sessionSecret: string;
  rootUrl: string;
  logger: Logger,
  insecureSessions?: boolean;
}

const server = ({
  twrpo,
  twitchClientId,
  twitchClientSecret,
  sessionSecret,
  rootUrl,
  logger,
  insecureSessions = false,
}: ServerOptions) => {
  const router = Router();

  router.use(authentication({
    twrpo,
    twitchClientId,
    twitchClientSecret,
    sessionSecret,
    logger,
    callbackUrlBase: rootUrl,
    insecure: insecureSessions,
  }));

  // Index is SSR
  router.get('/', ssr(twrpo, logger));

  // Redirect /live to /api/v1/live
  const redirectRouter = Router();
  redirectRouter.use(cors());
  redirectRouter.get('/', (_req, res) => res.redirect('/api/v1/live/extension'));
  router.use('/live', redirectRouter);

  // API
  router.use('/api', twrpo.apiRouter);

  // sitemap.xml
  router.get('/sitemap.xml', sitemap(twrpo));

  // robots.txt that disallows all if the environment says so
  if (process.env.TWRPO_NO_ROBOTS) {
    router.get('/robots.txt', (_req, res) => {
      res
        .set('Content-Type', 'text/plain')
        .send(`User-agent: *\nDisallow: /\n`);
    });
  }

  // Then static files
  router.use(express.static(path.resolve('build')));

  // And finally, back to SSR for catch-all to handle routing
  router.get('*', ssr(twrpo, logger));

  return router;
};

export default server;

import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';

import ssr from './ssr';
import twrpo from './twrpo';
import sitemap from './sitemap';

const router = Router();

// Index is SSR
router.get('/', ssr(twrpo));

// Redirect /live to /api/v1/live
const redirectRouter = Router();
redirectRouter.use(cors());
redirectRouter.get('/', (_req, res) => res.redirect('/api/v1/live'));
router.use('/live', redirectRouter);

// API
router.use('/api', twrpo.apiRouter);

// sitemap.xml
router.get('/sitemap.xml', sitemap(twrpo));

// robots.txt that disallows all if the environment says so
console.log(JSON.stringify(process.env));
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
router.get('*', ssr(twrpo));

const middleware = () => router;
export default middleware;

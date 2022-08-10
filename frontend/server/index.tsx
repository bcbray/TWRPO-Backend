import express from 'express';
import path from 'path';
import http from 'http';

import ssr from './ssr';
import twrpo from './twrpo';

const app = express();
app.enable('trust proxy');

// Index is SSR
app.get('/', ssr(twrpo));

// Redirect /live to /api/v1/live
app.get('/live', (_res, res) => res.redirect('/api/v1/live'));

// API
app.use('/api', twrpo.apiRouter);

// Then static files
app.use(express.static(path.resolve('build')));

// And finally, back to SSR for catch-all to handle routing
app.get('*', ssr(twrpo));

// Auto-refresh Twitch data
twrpo.startRefreshing();

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
    console.log(`HTTP server running on port ${port}!`);
});

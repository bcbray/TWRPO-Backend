import 'dotenv/config'
import 'reflect-metadata';

import './tracer';

import express from 'express';
import http from 'http';

import server from './server';
import twrpo from './twrpo';
import requireHttps from './requireHttps';

const app = express();
app.enable('trust proxy');
app.use(requireHttps);
app.use('/', server());

twrpo.initialize()
  .then(() => {
    // Auto-refresh Twitch data
    twrpo.startRefreshing();

    const port = process.env.PORT || 5000;

    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
        console.log(`HTTP server running on port ${port}!`);
    });
  })

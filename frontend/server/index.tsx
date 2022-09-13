import 'dotenv/config'
import 'reflect-metadata';

import './tracer';

import express from 'express';
import http from 'http';
import compression from 'compression';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { TWRPOApi } from '@twrpo/api';

import server from './server';
import requireHttps from './requireHttps';

console.log('Creating new client credentials...');
if (!process.env.TWITCH_CLIENT_ID) {
    console.log('Missing TWITCH_CLIENT_ID');
    process.exit(1);
}
if (!process.env.TWITCH_CLIENT_SECRET) {
    console.log('Missing TWITCH_CLIENT_SECRET');
    process.exit(1);
}
const twitchAuthProvider = new ClientCredentialsAuthProvider(
  process.env.TWITCH_CLIENT_ID,
  process.env.TWITCH_CLIENT_SECRET
);

if (!process.env.DATABASE_URL) {
    console.log('Missing DATABASE_URL');
    process.exit(1);
}
const postgresUrl = process.env.DATABASE_URL;

const twrpo = new TWRPOApi({ twitchAuthProvider, postgresUrl });

twrpo.initialize()
  .then(() => {
    const app = express();
    app.enable('trust proxy');
    app.use(compression());
    app.use(requireHttps);
    app.use('/', server(twrpo));

    // Auto-refresh Twitch data
    twrpo.startRefreshing();

    const port = process.env.PORT || 5000;

    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
        console.log(`HTTP server running on port ${port}!`);
    });
  })

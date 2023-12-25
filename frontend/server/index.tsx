import 'dotenv/config'
import 'reflect-metadata';
import { createLogger, transports, format, config } from 'winston';

import express from 'express';
import http from 'http';
import compression from 'compression';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { TWRPOApi } from '@twrpo/api';

import server from './server';
import requireHttps from './requireHttps';

const logger = createLogger({
  levels: config.syslog.levels,
  transports: [new transports.Console()],
  level: process.env.LOGGER_LEVEL ?? 'info',
  format: process.env.LOGGER_FORMAT === 'human'
    ? format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      )
    : format.json(),
});

logger.info('Creating new client credentials...')
if (!process.env.TWITCH_CLIENT_ID) {
    logger.error('Missing TWITCH_CLIENT_ID');
    process.exit(1);
}
const twitchClientId = process.env.TWITCH_CLIENT_ID;
if (!process.env.TWITCH_CLIENT_SECRET) {
    logger.error('Missing TWITCH_CLIENT_SECRET');
    process.exit(1);
}
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;
const twitchAuthProvider = new ClientCredentialsAuthProvider(
  twitchClientId,
  twitchClientSecret
);

if (!process.env.DATABASE_URL) {
    logger.error('Missing DATABASE_URL');
    process.exit(1);
}
const postgresUrl = process.env.DATABASE_URL;

if (!process.env.SESSION_SECRET) {
    logger.error('Missing SESSION_SECRET');
    process.exit(1);
}
const sessionSecret = process.env.SESSION_SECRET;

const rootUrl = process.env.ROOT_URL ?? 'https://twrponly.tv';

const postgresInsecure = (new URL(postgresUrl)).hostname === 'localhost';

if (postgresInsecure) {
  logger.warning('Using insecure postgres connection', {
    postgresHostname: (new URL(postgresUrl)).hostname,
  });
}

const twrpo = new TWRPOApi({
  twitchAuthProvider,
  postgresUrl,
  postgresInsecure,
  logger,
});

twrpo.initialize()
  .then(() => {
    const insecureSessions = rootUrl.startsWith('http://');
    if (insecureSessions) {
      logger.warning('Using insecure sessions', {
        rootUrl,
      });
    }
    const app = express();
    app.enable('trust proxy');
    app.use(compression());
    app.use(requireHttps);
    app.use('/', server({
      twrpo,
      twitchClientId,
      twitchClientSecret,
      sessionSecret,
      rootUrl,
      insecureSessions,
      logger,
    }));

    // Auto-refresh Twitch data
    twrpo.startRefreshing();

    const port = process.env.PORT || 5000;

    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
        logger.info(`HTTP server running on port ${port}!`);
    });
  })

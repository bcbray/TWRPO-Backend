import session from 'express-session';
import { Passport } from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import { TypeormStore, ISession } from 'connect-typeorm';
import { Repository } from 'typeorm';
import { Router } from 'express';

import { TWRPOApi, SessionUser } from '@twrpo/api';

import { TwitchStrategy, TwitchProfile } from './passport-twitch';
import { urlJoin } from './utils';

export interface AuthenticationOptions {
  twrpo: TWRPOApi
  twitchClientId: string;
  twitchClientSecret: string;
  sessionSecret: string;
  callbackUrlBase: string;
  insecure?: boolean;
}

export function authentication({
    twrpo,
    twitchClientId,
    twitchClientSecret,
    sessionSecret,
    callbackUrlBase,
    insecure = false,
}: AuthenticationOptions) {
  const passport = new Passport();

  passport.use(new TwitchStrategy({
    clientID: twitchClientId,
    clientSecret: twitchClientSecret,
    callbackURL: urlJoin(callbackUrlBase, '/auth/twitch/callback'),
  }, (accessToken: string, refreshToken: string, profile: TwitchProfile, verified: OAuth2Strategy.VerifyCallback) => {
    twrpo.createOrUpdateUser(accessToken, refreshToken, profile.user)
      .then((user: SessionUser) => {
        verified(null, user);
      })
      .catch((error?: Error) =>
        verified(error)
      );
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user as SessionUser);
  });

  const router = Router();

  router.get('/auth/twitch', passport.authenticate('twitch'));
  router.get('/auth/twitch/callback', passport.authenticate('twitch', {
    failureRedirect: '/auth/failure',
  }), (_req, res) => {
    res.redirect('/auth/success');
  });

  router.post('/auth/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      return res.send();
    })
  });

  const sessionRepository = twrpo.getSessionRepository() as any as Repository<ISession>;
  const sessionStore = new TypeormStore().connect(sessionRepository);

  return [
    session({
      name: 'session',
      cookie: {
        secure: !insecure,
        httpOnly: true,
      },
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: sessionStore
    }),
    passport.initialize(),
    passport.session(),
    router,
  ]
}

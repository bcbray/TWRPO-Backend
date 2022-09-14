import OAuth2Strategy from 'passport-oauth2';
import { HelixPaginatedResult, HelixUserData } from '@twurple/api';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface TwithAuthorizationParams {
  force_verify?: boolean
}

export interface TwitchProfile {
  user: HelixUserData,
  provider: 'twitch',
}

export class TwitchStrategy extends OAuth2Strategy {
  constructor(
    options: Optional<OAuth2Strategy.StrategyOptions, 'authorizationURL' | 'tokenURL'>,
    verify: OAuth2Strategy.VerifyFunction
  ) {
    const { customHeaders, ...rest } = options;
    const superOptions: OAuth2Strategy.StrategyOptions = {
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      customHeaders: {
        ...customHeaders,
        'Client-ID': options.clientID,
      },
      ...rest,
    }
    super(superOptions, verify);

    this.name = 'twitch';

    this._oauth2.setAuthMethod('Bearer');
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  userProfile(accessToken: string, done: (err?: Error, profile?: TwitchProfile) => void) {
    this._oauth2.get('https://api.twitch.tv/helix/users', accessToken, (err, body, _res) => {
      if (err) {
        return done(new OAuth2Strategy.InternalOAuthError('Failed to fetch user profile', err));
      }

      if (!body) {
        done(new OAuth2Strategy.InternalOAuthError('Failed to fetch user profile', err));
      }

      try {
        const bodyString = typeof body === 'string' ? body : body!.toString();
        const result = JSON.parse(bodyString) as HelixPaginatedResult<HelixUserData>;
        if (result.data.length !== 1) {
          done(new OAuth2Strategy.InternalOAuthError('Failed to fetch user profile', err));
        }
        done(undefined, {
          user: result.data[0],
          provider: 'twitch'
        } as TwitchProfile);
      } catch (e) {
        done(e);
      }
    })
  }

  authorizationParams(options: any): TwithAuthorizationParams {
    let params: TwithAuthorizationParams = {};
    if (typeof options.forceVerify !== 'undefined') {
        params.force_verify = !!options.forceVerify;
    }
    return params;
  }
}

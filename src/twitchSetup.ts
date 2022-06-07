// import { promises as fs } from 'fs';
import { ApiClient } from 'twitch';
import { ClientCredentialsAuthProvider } from 'twitch-auth';

import { log } from './utilsEarly';

log('| Setting up twitch client...');

const authProvider = new ClientCredentialsAuthProvider(process.env.TWITCH_CLIENT_ID || '', process.env.TWITCH_CLIENT_SECRET || '');

export const apiClient = new ApiClient({ authProvider });

log('Twitch client connected!');

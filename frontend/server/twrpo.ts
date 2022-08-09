import { ClientCredentialsAuthProvider } from 'twitch-auth';

import TWRPOApi from '@twrpo/api';

console.log('Creating new client credentials...');
if (!process.env.TWITCH_CLIENT_ID) {
    console.log('Missing TWITCH_CLIENT_ID');
}
if (!process.env.TWITCH_CLIENT_SECRET) {
    console.log('Missing TWITCH_CLIENT_SECRET');
}
const twitchAuthProvider = new ClientCredentialsAuthProvider(
  process.env.TWITCH_CLIENT_ID || '',
  process.env.TWITCH_CLIENT_SECRET || ''
);

const twrpo = new TWRPOApi({ twitchAuthProvider });

export default twrpo;

import { ClientCredentialsAuthProvider } from 'twitch-auth';

import TWRPOApi from '@twrpo/api';

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

export default twrpo;

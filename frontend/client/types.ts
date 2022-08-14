import { Stream } from '@twrpo/types';

export const channelInfo = (stream: Stream) => ({
  displayName: stream.channelName,
  profilePictureUrl: stream.profileUrl,
});

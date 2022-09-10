import DisplayInfo from './DisplayInfo';
import FactionInfo from './FactionInfo';
import ChannelInfo from './ChannelInfo';
import Stream from './Stream';

export default interface CharacterInfo {
  id: number;
  channelName: string;
  name: string;
  displayInfo: DisplayInfo;
  factions: FactionInfo[];
  liveInfo?: Stream;
  channelInfo?: ChannelInfo;
  lastSeenLive?: string;
  lastSeenTitle?: string;
  lastSeenVideoUrl?: string;
  lastSeenVideoThumbnailUrl?: string;
}

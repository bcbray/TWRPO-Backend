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
  formerFactions: FactionInfo[];
  contact?: string;
  isDeceased?: boolean;
  liveInfo?: Stream;
  channelInfo?: ChannelInfo;
  lastSeenLive?: string;
  lastSeenTitle?: string;
  lastSeenVideoUrl?: string;
  lastSeenVideoThumbnailUrl?: string;
  lastSeenSegmentId?: number;
  totalSeenDuration?: number;
  firstSeenLive?: string;
}

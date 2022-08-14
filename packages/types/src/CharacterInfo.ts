import DisplayInfo from './DisplayInfo';
import FactionInfo from './FactionInfo';
import ChannelInfo from './ChannelInfo';
import Stream from './Stream';

export default interface CharacterInfo {
  channelName: string;
  name: string;
  displayInfo: DisplayInfo;
  factions: FactionInfo[];
  liveInfo?: Stream;
  channelInfo?: ChannelInfo;
  lastSeenLive?: string;
}

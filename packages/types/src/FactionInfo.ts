export default interface FactionInfo {
  key: string;
  name: string;
  colorLight: string;
  colorDark: string;
  liveCount?: number;
  isLive?: boolean;
  hideInFilter?: boolean;
}

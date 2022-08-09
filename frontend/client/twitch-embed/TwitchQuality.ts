export interface TwitchQuality {
  name: string;
  group: string;
  isDefault: boolean;
  width: number;
  height: number;
  framerate: number;
  bitrate: number;
  codecs: string;
}


/*
bitrate: 999999999
codecs: ""
framerate: 60
group: "auto"
height: 0
isDefault: false
name: "Auto"
width: 0


bitrate: 4673037
codecs: "avc1.640028,mp4a.40.2"
framerate: 30
group: "chunked"
height: 1080
isDefault: true
name: "1080p (source)"
width: 1920


bitrate: 2373000
codecs: "avc1.4D401F,mp4a.40.2"
framerate: 30
group: "720p30"
height: 720
isDefault: false
name: "720p"
width: 1280
*/

import React from 'react';
import { SketchPicker } from 'react-color';
import { CharactersResponse, Stream, FactionInfo } from '@twrpo/types';

import styles from './ColorHelper.module.css';
import { classes } from './utils';
import StreamCard from './StreamCard';

interface Props {
  data: CharactersResponse;
}

const ColorCell: React.FC<{color: string, invert?: boolean, dark?: boolean }> = ({ color, invert = false, dark = false }) => {
  let background = color;
  let foreground = dark ? '#fff' : '#000';
  if (invert) {
    [background, foreground] = [foreground, background];
  }
  return (
    <div className={styles.colorSwatch} style={{
      backgroundColor: background,
      color: foreground,
    }}>
    <p>{color}</p>
    </div>
  );
}

const FactionCard: React.FC<{faction: FactionInfo}> = ({ faction }) => {
  const startDate = React.useMemo(() => (new Date(new Date().getTime() - 5241000)).toString() ,[]);
  const fakeStream: Stream = {
    channelName: 'Ssaab',
    title: 'Sam Baas | WildRP',
    viewers: 1432,
    profileUrl: '/images/example-live-pfp.png',
    id: 0,
    rpServer: 'WRP',
    characterName: 'Sam Baas',
    characterId: 1,
    nicknameLookup: null,
    faction: faction.key,
    factions: [faction.key],
    factionsMap: {fake: true},
    tagText: 'Sam',
    tagFaction: faction.key,
    thumbnailUrl: '/images/example-live-thumbnail.jpeg',
    startDate
  };
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h4 title={faction.name}>{faction.name}</h4>
        <div>
          <ColorCell dark color={faction.colorLight} />
          <ColorCell invert dark color={faction.colorLight} />
          (light)
        </div>
        <div>
          <ColorCell color={faction.colorDark} />
          <ColorCell invert color={faction.colorDark} />
          (dark)
        </div>
      </div>
      <div>
        <div>
          <StreamCard stream={fakeStream} factionInfos={{ [faction.key]: faction }} />
        </div>
      </div>
    </div>
  )
}

const ColorHelper: React.FC<Props> = ({ data }) => {
  const [colorLight, setColorLight] = React.useState('#12af7e');
  const [colorDark, setColorDark] = React.useState('#32ff7e');

  const presets: { color: string; title: string }[] = [
    { title: 'grape', color: '#5c16c5' },
    { title: 'dragonfruit', color: '#ff38db' },
    { title: 'carrot', color: '#e69900' },
    { title: 'sun', color: '#f5f500' },
    { title: 'lime', color: '#00f593' },
    { title: 'turquoise', color: '#00f0f0' },
    { title: 'eggplant', color: '#451093' },
    { title: 'wine', color: '#ae1392' },
    { title: 'slime', color: '#00f593' },
    { title: 'seafoam', color: '#8fffd2' },
    { title: 'cherry', color: '#eb0400' },
    { title: 'marine', color: '#1f69ff' },
    { title: 'seaweed', color: '#00a3a3' },
    { title: 'pebble', color: '#848494' },
    { title: 'moon', color: '#efeff1' },
    { title: 'fiji', color: '#8fffd2' },
    { title: 'blueberry', color: '#1f69ff' },
    { title: 'arctic', color: '#00f0f0' },
    { title: 'highlighter', color: '#f5f500' },
    { title: 'flamingo', color: '#ff38db' },
    { title: 'ruby', color: '#eb0400' },
    { title: 'punch', color: '#ffcdcc' },
    { title: 'creamsicle', color: '#ffd37a' },
  ];

  const previewFaction: FactionInfo = {
    key: 'preview',
    name: 'Preview',
    colorLight: colorLight,
    colorDark: colorDark,
  };

  return (
    <>
      <div className={classes(styles.grid, 'inset')}>
        <div className={classes(styles.items)}>
          <FactionCard faction={previewFaction} />
          <div className={styles.picker}>
            <p>Light:</p>
            <SketchPicker color={colorLight} presetColors={presets} onChange={c => setColorLight(c.hex)} />
          </div>
          <div className={styles.picker}>
            <p>Dark:</p>
            <SketchPicker color={colorDark} presetColors={presets} onChange={c => setColorDark(c.hex)} />
          </div>
        </div>
      </div>
      <hr className='inset' />
      <div className={classes(styles.grid, 'inset')}>
        <div className={classes(styles.items)}>
          {data.factions.map(faction => <FactionCard key={faction.key} faction={faction} />)}
        </div>
      </div>
    </>
  );
};

export default ColorHelper;

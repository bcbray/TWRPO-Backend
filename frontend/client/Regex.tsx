import React from 'react';

import styles from './Regex.module.css';

type Flag = 'case-insensitive';

interface RegexProps {
  source: string;
  flags: Flag[];
}

const flagString = (flags: Flag[]): string => {
  const chars: string[] = [];
  for (const flag of flags) {
    if (flag === 'case-insensitive') {
      chars.push('i');
    }
  }
  const deduped = [...(new Set(chars))];
  return deduped.sort().join('');
}

const Regex: React.FC<RegexProps> = ({ source, flags }) => {
  return <>
    <pre className={styles.regex}>
      <span className={styles.open}>/</span>
      {source}
      <span className={styles.close}>/</span>
      <span className={styles.flags}>{flagString(flags)}</span>
    </pre>
  </>;
};

export default Regex;

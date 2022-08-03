import React from 'react';

import styles from './Loading.module.css';
import Spinner from './Spinner';

interface LoadingProps {

}

const Loading: React.FC<LoadingProps> = () => {
  return (
    <div className={styles.content}>
      <Spinner />
    </div>
  );
};

export default Loading;

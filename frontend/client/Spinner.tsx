import React from 'react';

import styles from './Spinner.module.css';
import { classes } from './utils';

interface SpinnerProps<As extends React.ElementType = React.ElementType> {
  size?: 'sm'
  className?: string
  as?: As
}

const Spinner: React.FC<SpinnerProps> = ({
  size,
  className,
  as: Component = 'div'
}) => {
  const sizeClass = (size === 'sm')
    ? styles.small
    : undefined;
  return (
    <Component
      className={classes(styles.spinner, sizeClass, className)}
    />
  );
};

export default Spinner;

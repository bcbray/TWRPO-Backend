import React from 'react';

import styles from './Tag.module.css';

interface Props<T extends React.ElementType> {
  className?: string;
  as?: T;
}

function Tag<T extends React.ElementType = 'div'>(
  { as: tagName, className, ...props }:
    Props<T> &
    Omit<React.ComponentPropsWithoutRef<T>, keyof Props<T>>
) {
    const Component = tagName as React.ElementType || 'div';
    return <Component
      {...props}
      className={[styles.tag, ...(className ? [className] : [])].join(' ')}
    />
}

export default Tag;

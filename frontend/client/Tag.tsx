import React from 'react';

import styles from './Tag.module.css';

interface Props<T extends React.ElementType> {
  className?: string;
  as?: T;
}

export type TagProps<T extends React.ElementType> = Props<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof Props<T>>;

const TagImpl = <T extends React.ElementType = 'div'>(
  { as: tagName, className, ...props }: TagProps<T>,
  ref: React.Ref<T>
) => {
  const Component = tagName as React.ElementType || 'div';
  return <Component
    {...props}
    ref={ref}
    className={[styles.tag, ...(className ? [className] : [])].join(' ')}
  />
}

const Tag = React.forwardRef(TagImpl) as
  <T extends React.ElementType = 'div'>(p: TagProps<T> & { ref?: React.Ref<T> }) => React.ReactElement;


export default Tag;

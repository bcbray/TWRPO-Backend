import React from 'react';

import BaseDropdownItem, {
  useDropdownItem,
  DropdownItemProps as BaseDropdownItemProps,
} from '@restart/ui/DropdownItem';

import Anchor from '@restart/ui/Anchor';

import styles from './DropdownItem.module.css';
import { classes } from './utils';

interface DropdownItemProps extends BaseDropdownItemProps {
}

const DropdownItem = React.forwardRef<typeof BaseDropdownItem, DropdownItemProps>((
  {
    as: Component = Anchor,
    className,
    eventKey,
    disabled,
    onClick,
    active,
    ...props
  }, ref
) => {
  const [dropdownItemProps, meta] = useDropdownItem({
    key: eventKey,
    href: props.href,
    disabled,
    onClick,
    active,
  });

  return (
  <Component
    {...props}
    {...dropdownItemProps}
    ref={ref}
    role='button'
    className={classes(
      className,
      styles.item,
      meta.isActive && styles.active,
      disabled && styles.disabled,
    )}
  />
  );
});

export default DropdownItem;

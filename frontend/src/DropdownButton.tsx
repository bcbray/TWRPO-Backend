import React from 'react';
import { useDropdownToggle } from '@restart/ui/DropdownToggle';

import styles from './DropdownButton.module.css';
import { classes } from './utils';

interface DropdownButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect' | 'children'>
{
  as?: React.ElementType;
  hidePopper?: boolean;
  size?: 'sm';
  children?: React.ReactNode;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  as: Component = 'button',
  className,
  role = 'button',
  hidePopper = false,
  size,
  children,
  ...props
}) => {
  const [toggleProps] = useDropdownToggle();

  return (
    <Component
      className={classes(
        styles.button,
        className,
        'button',
        size === 'sm' && 'button-sm',
        hidePopper && styles.noPopper,
      )}
      role={role}
      {...toggleProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default DropdownButton;

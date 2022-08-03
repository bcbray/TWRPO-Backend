import React from 'react';
import BaseDropdown, {
  DropdownProps as BaseDropdownProps,
} from '@restart/ui/Dropdown';

import styles from './Dropdown.module.css';
import { classes } from './utils';

interface DropdownProps
  extends BaseDropdownProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'onSelect' | 'children'>
{
  as?: React.ElementType
}

const Dropdown = React.forwardRef<HTMLElement, DropdownProps>((
  {
    as: Component = 'div',
    placement,
    defaultShow,
    show,
    onSelect,
    onToggle,
    itemSelector,
    focusFirstItemOnShow,
    className,
    ...props
  }, ref
) => {
  return (
    <BaseDropdown
      placement={placement}
      defaultShow={defaultShow}
      show={show}
      onSelect={onSelect}
      onToggle={onToggle}
      itemSelector={itemSelector}
      focusFirstItemOnShow={focusFirstItemOnShow}
    >
      <Component
        {...props}
        ref={ref}
        className={classes(styles.dropdown, className)}
      />
    </BaseDropdown>
  );
});

export default Dropdown;

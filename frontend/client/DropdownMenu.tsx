import React from 'react';
import { useDropdownMenu, UseDropdownMenuOptions } from '@restart/ui/DropdownMenu';
import { useEventCallback } from '@restart/hooks';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import { useUpdateEffect } from 'react-use';

import styles from './DropdownMenu.module.css';
import { classes } from './utils';
import { useWrappedRefWithWarning } from './hooks';

interface DropdownMenuProps {
  className?: string;
  children?: React.ReactNode;
  popperConfig?: UseDropdownMenuOptions['popperConfig'];
  onShow?: () => void;
  onHide?: () => void;
  alwaysRender?: boolean;
}

const DropdownMenu = React.forwardRef<HTMLElement, DropdownMenuProps>((
  { className, children, popperConfig, onShow, onHide, alwaysRender = false }, ref
) => {
  const [props, { hasShown, show} ] = useDropdownMenu({
    popperConfig,
  });

  const showCallback = useEventCallback(() => {
    onShow && onShow()
  });

  const hideCallback = useEventCallback(() => {
    onHide && onHide()
  });

  useUpdateEffect(() => {
    show && showCallback();
    !show && hideCallback();
  }, [show, showCallback, hideCallback]);

  props.ref = useMergedRefs<HTMLElement>(
    props.ref,
    useWrappedRefWithWarning(ref, 'DropdownMenu')
  )

  if (!hasShown && !alwaysRender) {
    return null;
  }

  return (
    <div
      {...props}
      className={classes(
        className,
        styles.menu,
        show ? styles.visible : styles.hidden,
      )}
    >
      {children}
    </div>
  );
})

export default DropdownMenu;

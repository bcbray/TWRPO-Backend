import React from 'react';
import { OverlayArrowProps } from '@restart/ui/Overlay';

import styles from './Tooltip.module.css';

import { classes } from './utils';

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  arrowClassName?: string;
  arrowProps?: Partial<OverlayArrowProps>;
  innerClassName?: string;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>((
  { children, className, arrowClassName, arrowProps, innerClassName, ...props }, ref
) => {
  return (
    <div
      role='tooltip'
      className={classes(styles.tooltip, className)}
      ref={ref}
      {...props}
    >
      <div className={classes(styles.arrow, arrowClassName)} {...arrowProps} />
      <div className={classes(styles.inner, innerClassName)}>
        {children}
      </div>
    </div>
  )
})

export default Tooltip;

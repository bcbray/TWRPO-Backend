import React from 'react';

import { useDatadogRum } from 'react-datadog';

export interface OutboundLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  logName?: string;
  logContext?: object;
}

const OutboundLink = React.forwardRef<HTMLAnchorElement, OutboundLinkProps>((
  {logName, logContext = {}, children, href, onClick, ...props}, ref
) => {
  const rum = useDatadogRum();
  return <a
    ref={ref}
    href={href}
    onClick={(e) => {
      onClick?.(e);
      rum.addAction(`Click ${logName || 'Outbound Link'}`, {
        type: 'outbound-link',
        destination: href,
        ...logContext
      });
    }}
    {...props}
  >
    {children}
  </a>
});

export default OutboundLink;

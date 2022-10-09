import React from 'react';

import { useDatadogRum } from 'react-datadog';
import { usePlausible } from './Plausible';

export interface OutboundLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  logName?: string;
  logContext?: object;
}

const OutboundLink = React.forwardRef<HTMLAnchorElement, OutboundLinkProps>((
  {logName, logContext = {}, children, href, onClick, ...props}, ref
) => {
  const rum = useDatadogRum();
  const { trackEvent } = usePlausible();
  return <a
    ref={ref}
    href={href}
    onClick={(e) => {
      onClick?.(e);
      trackEvent('Outbound Link: Click',  { props: { url: href ?? '??' } })
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

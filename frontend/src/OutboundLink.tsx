import React from 'react';

import { useDatadogRum } from 'react-datadog';


const OutboundLink = React.forwardRef<HTMLAnchorElement, React.HTMLProps<HTMLAnchorElement>>(({children, href, onClick, ...props}, ref) => {
  const rum = useDatadogRum();
  return <a
    ref={ref}
    href={href}
    onClick={(e) => {
      onClick?.(e);
      rum.addAction('outbound-link', {
        'destination': href
      })
    }}
    {...props}
  >
    {children}
  </a>
});

export default OutboundLink;

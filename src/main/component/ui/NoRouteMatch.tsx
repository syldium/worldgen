import React, { useEffect } from 'react';
import { voidReturn } from '../../util/DomHelper';

export function NoRouteMatch(): JSX.Element {
  useEffect(() => {
    const robots = document.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', 'noindex');
    document.head.appendChild(robots);
    return voidReturn(() => document.head.removeChild(robots));
  }, []);

  return (
    <p>
      No match for <code>{location.pathname}</code>.
    </p>
  );
}

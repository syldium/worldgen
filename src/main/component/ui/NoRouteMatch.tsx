import { ReactElement, useEffect } from 'react';
import { voidReturn } from '../../util/DomHelper';

export function NoRouteMatch(): ReactElement {
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

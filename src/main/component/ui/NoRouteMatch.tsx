import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { voidReturn } from '../../util/DomHelper';

export function NoRouteMatch(): JSX.Element {
  const location = useLocation();

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

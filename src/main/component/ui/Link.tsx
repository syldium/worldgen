import React, { useEffect } from 'react';
import {
  currentPath,
  isActive,
  relativePath,
  routeLink
} from '../../util/UriHelper';
import { useForceUpdate } from '@pastable/use-force-update';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.shiftKey ||
    event.button !== 0
  ) {
    return;
  }
  event.preventDefault();
  routeLink(event.target as HTMLAnchorElement);
}
export function Link(props: LinkProps): JSX.Element {
  return <a {...props} onClick={onClick} href={relativePath(props.href!)} />;
}

export function NavLink({ ...props }: LinkProps) {
  const update = useForceUpdate();
  if (isActive(currentPath(), props.href!)) {
    props.className = 'current';
    props['aria-current'] = 'page';
  }
  useEffect(() => {
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, [update]);
  return Link(props);
}

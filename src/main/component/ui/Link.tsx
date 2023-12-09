import { ReactElement, useEffect } from 'react';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useForceUpdate } from '../../hook/useForceUpdate';
import {
  currentPath,
  isActive,
  relativePath,
  routeLink
} from '../../util/UriHelper';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
}

function onClick(event: MouseEvent<HTMLAnchorElement>) {
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
export function Link(props: LinkProps): ReactElement {
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

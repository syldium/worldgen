import { useCallback } from 'react';
import { match } from 'react-router';
import { NavLink } from 'react-router-dom';
import { isValidNamespacedKey } from '../../util/LabelHelper';
import type { LocationDescriptor, Pathname } from 'history';
import type { RefAttributes, ReactNode } from 'react';

interface LinkProps extends RefAttributes<HTMLAnchorElement> {
  exact?: boolean;
  to: LocationDescriptor;
  children?: ReactNode;
}
export function Link({
  exact,
  to,
  children,
  ...props
}: LinkProps): JSX.Element {
  const isActive = useCallback(function (
    match: match,
    { pathname }: { pathname: Pathname }
  ): boolean {
    if (!match) {
      return false;
    }
    if (match.isExact) {
      return true;
    }
    const additionalInfo = pathname.substring(match.path.length);
    return additionalInfo === '' || isValidNamespacedKey(additionalInfo);
  },
  []);

  return (
    // @ts-ignore
    <NavLink exact={exact} to={to} isActive={isActive} {...props}>
      {children}
    </NavLink>
  );
}

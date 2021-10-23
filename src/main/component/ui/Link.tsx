import React, { useCallback } from 'react';
import { match } from 'react-router';
import { NavLink } from 'react-router-dom';
import { LocationDescriptor, Pathname } from 'history';
import { isValidNamespacedKey } from '../../util/LabelHelper';

interface LinkProps extends React.RefAttributes<HTMLAnchorElement> {
  exact?: boolean;
  to: LocationDescriptor;
  children?: React.ReactNode;
}

const onClick = (event: React.MouseEvent<HTMLAnchorElement>) =>
  (event.target as HTMLAnchorElement).blur();
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
    <NavLink
      exact={exact}
      to={to}
      // @ts-ignore
      isActive={isActive}
      onClick={onClick}
      {...props}
    >
      {children}
    </NavLink>
  );
}

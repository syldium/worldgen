import type { ReactNode } from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { VersionSelect } from './VersionSelect';

interface NavBarProps {
  children?: ReactNode;
}
export const NavBar = ({ children }: NavBarProps): JSX.Element => (
  <div className="navbar">
    <nav className="tabs">{children}</nav>
    <VersionSelect />
    <p className="github">
      <a
        href="https://github.com/syldium/worldgen"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on GitHub
      </a>
    </p>
    <DarkModeToggle />
  </div>
);

import { DarkModeToggle } from './DarkModeToggle';
import type { ReactNode } from 'react';

interface NavBarProps {
  children?: ReactNode;
}
export const NavBar = ({ children }: NavBarProps): JSX.Element => (
  <div className="navbar">
    <nav className="tabs">{children}</nav>
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

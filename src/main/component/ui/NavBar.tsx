import React from 'react';
import { DarkModeToggle } from './DarkModeToggle';

interface NavBarProps {
  children?: React.ReactNode;
}
export const NavBar = ({ children }: NavBarProps): JSX.Element => (
  <div className="navbar">
    {children}
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

import { DarkModeToggle } from './DarkModeToggle';
import React from 'react';

export function MenuItem({active, children, onClick}) {
    return <li><a href="#_" role="menuitem" aria-current={active} onClick={onClick}>{children}</a></li>
}

export function NavBar({ children }) {
    return <div className="navbar">
        {children}
        <p className="github"><a href="https://github.com/syldium/worldgen" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
        <DarkModeToggle />
    </div>
}

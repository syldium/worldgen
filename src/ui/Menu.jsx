import { DarkModeToggle } from './DarkModeToggle';
import React from 'react';

export function NavBar({ children }) {
    return <div className="navbar">
        {children}
        <p className="github"><a href="https://github.com/syldium/worldgen" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
        <DarkModeToggle />
    </div>
}

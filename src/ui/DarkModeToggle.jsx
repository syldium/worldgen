import { Toggle } from './Toggle';
import React from 'react';
import useDarkMode from 'use-dark-mode';

export function DarkModeToggle() {
    const darkMode = useDarkMode(true);

    return <div className="dark-mode-toggle" title="Dark mode toggle">
        <button type="button" onClick={darkMode.disable} tabIndex="-1">☀</button>
        <Toggle ariaLabel="Dark mode toggle" checked={darkMode.value} onChange={darkMode.toggle} />
        <button type="button" onClick={darkMode.enable} tabIndex="-1">☾</button>
    </div>
}
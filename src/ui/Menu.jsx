import React from 'react';

export function MenuItem({active, children, onClick}) {
    const className = 'tabs-menu-link' + (active ? ' is-active' : '');
    return <a href="#_" className={className} onClick={onClick}>{children}</a>
}
import React from 'react';

export function Button ({loading, cat = 'primary', ...buttonProps}) {
    return <button className={`btn btn--${cat}`} {...buttonProps} tabIndex="0"></button>
}

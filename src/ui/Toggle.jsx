import React from 'react';

export const Toggle = ({ ariaLabel, checked, id, onChange }) => (
    <span className="toggle-control">
        <input
            aria-label={ariaLabel}
            className="dmcheck"
            type="checkbox"
            checked={checked}
            onChange={onChange}
            id={id}
        />
        <label htmlFor={id} />
    </span>
);

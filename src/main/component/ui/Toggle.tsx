import React from 'react';

interface ToggleProps {
  ariaLabel?: string;
  checked?: boolean;
  id?: string;
  onChange?: (event: React.ChangeEvent) => void;
}

export const Toggle = ({
  ariaLabel,
  checked,
  id,
  onChange
}: ToggleProps): JSX.Element => (
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

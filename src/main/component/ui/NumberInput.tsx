import React, { InputHTMLAttributes } from 'react';

export const NumberInput = ({
  ...props
}: InputHTMLAttributes<HTMLInputElement>): JSX.Element => (
  <input type="number" {...props} />
);

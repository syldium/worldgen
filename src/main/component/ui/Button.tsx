import React, { ButtonHTMLAttributes } from 'react';
import '../../../style/component/button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  cat?: 'primary' | 'secondary' | 'danger' | 'close' | 'info';
}
export const Button = ({
  cat = 'primary',
  className,
  ...props
}: ButtonProps): JSX.Element => (
  <button className={`btn btn--${cat} ${className}`} {...props} />
);

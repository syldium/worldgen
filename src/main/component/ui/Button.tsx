import type { ButtonHTMLAttributes, ReactElement } from 'react';
import '../../../style/component/button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  cat?: 'primary' | 'secondary' | 'danger' | 'close' | 'info';
}
export const Button = ({
  cat = 'primary',
  className,
  ...props
}: ButtonProps): ReactElement => (
  <button
    className={`btn btn--${cat}${className ? ' ' + className : ''}`}
    {...props}
  />
);

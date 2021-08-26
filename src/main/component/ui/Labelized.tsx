import React from 'react';
import { labelize } from '../../util/LabelHelper';

interface LabelizedProps {
  className?: string;
  id: string | undefined;
  name: string;
  children: React.ReactElement;
}
export function Labelized({
  className,
  id,
  name,
  children
}: LabelizedProps): JSX.Element {
  if (isNaN(name as unknown as number)) {
    return (
      <div className={className}>
        <div>
          <label htmlFor={id}>{labelize(name)}</label> :
        </div>
        {children}
      </div>
    );
  }
  return children;
}

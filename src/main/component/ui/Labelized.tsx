import type { ReactElement } from 'react';
import { labelize } from '../../util/LabelHelper';

interface LabelizedProps {
  className?: string;
  id: string | undefined;
  name: string;
  children: ReactElement;
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
        <div className="inline">
          <label htmlFor={id}>{labelize(name)}</label>:&nbsp;
        </div>
        {children}
      </div>
    );
  }
  return children;
}

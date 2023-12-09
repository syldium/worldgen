import type { ReactElement } from 'react';
import { labelize } from '../../util/LabelHelper';
import type { ObjectKey } from '../NodeElement';

interface LabelizedProps {
  className?: string;
  id: string | undefined;
  name: ObjectKey;
  children: ReactElement;
}
export function Labelized({
  className,
  id,
  name,
  children
}: LabelizedProps): ReactElement {
  if (typeof name === 'string') {
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

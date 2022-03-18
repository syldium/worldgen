import type { ReactNode } from 'react';
import { labelize } from '../../util/LabelHelper';
import type { ObjectKey } from '../NodeElement';

interface FieldsetLegendProps {
  name: ObjectKey;
  children?: ReactNode;
}
export const FieldsetLegend = ({ name, children }: FieldsetLegendProps) =>
  typeof name === 'string' ?
    (
      <legend className="flex">
        <div className="tabs">{labelize(name)}</div>
        {children}
      </legend>
    ) :
    <></>;

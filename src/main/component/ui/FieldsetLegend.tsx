import { labelize } from '../../util/LabelHelper';
import type { ObjectKey } from '../NodeElement';

interface FieldsetLegendProps {
  name: ObjectKey;
}
export const FieldsetLegend = ({ name }: FieldsetLegendProps) =>
  typeof name === 'string' ? <legend>{labelize(name)}</legend> : <></>;

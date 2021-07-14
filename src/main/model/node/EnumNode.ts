import {
  defaultNamespace,
  labelize,
  labelizeOption
} from '../../util/LabelHelper';
import { NodeBase } from './Node';
import { Option } from '../../component/ui/Select';

export interface EnumNodeParams extends NodeBase<'enum'> {
  values: Option[];
  default?: Option;
}

export const EnumNode = <
  T extends ReadonlyArray<string> | Record<string, string>
>(
  values: T,
  def?: T extends ReadonlyArray<string> ? typeof values[number] : keyof T,
  namespace = false
): EnumNodeParams => {
  const node: EnumNodeParams = {
    values: Array.isArray(values)
      ? values.map((value) =>
          namespace ? labelizeOption(value) : { label: labelize(value), value }
        )
      : Object.entries(values).map(([value, label]) => ({
          label,
          value:
            namespace && value.toUpperCase() !== value
              ? defaultNamespace(value)
              : value
        })),
    type: 'enum',
    isValid: (value: unknown) =>
      node.values.some((option) => option.value === value)
  };
  if (def) {
    const key = defaultNamespace(def);
    node.default = node.values.find((option) => option.value === key);
  }
  return node;
};

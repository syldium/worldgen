import React, { ChangeEvent, Suspense } from 'react';
import type { GroupTypeBase, OptionTypeBase } from 'react-select/src/types';
import type { Props, ValueType } from 'react-select';
import type { ActionMeta } from 'react-select/src/types';
import type { CreatableProps } from 'react-select/creatable';
import type ReactSelect from 'react-select';

export interface Option {
  label: string;
  value: string;
}

const LoadableSelect = React.lazy(
  () => import('./LoadableSelect')
) as typeof Select;

export function Select<
  OptionType extends OptionTypeBase = Option,
  IsMulti extends boolean = false,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
>(props: Props<OptionType, IsMulti, GroupType>): JSX.Element {
  if (!import.meta.env || import.meta.env.SSR) {
    return HtmlSelect(props);
  }
  return (
    <Suspense fallback={<HtmlSelect {...props} />}>
      <LoadableSelect {...props} />
    </Suspense>
  );
}

function HtmlSelect<
  OptionType extends OptionTypeBase = Option,
  IsMulti extends boolean = false,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
>({
  inputId,
  isMulti,
  name,
  options,
  value,
  onChange
}: Props<OptionType, IsMulti, GroupType>): JSX.Element {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const actionPlaceholder = {} as ActionMeta<OptionType>;
    if (isMulti) {
      onChange!(
        Array.from(e.target.options)
          .filter((o) => o.selected)
          .map((o) => ({
            label: o.label,
            value: o.value
          })) as unknown as ValueType<OptionType, IsMulti>,
        actionPlaceholder
      );
    } else {
      onChange!(
        options!.find((o) => o.value === e.target.value) as ValueType<
          OptionType,
          IsMulti
        >,
        actionPlaceholder
      );
    }
  };
  const val = Array.isArray(value)
    ? value.map((o) => o.value)
    : (value as unknown as Option)?.value;
  return (
    <select
      id={inputId}
      name={name}
      value={val}
      onChange={handleChange}
      multiple={isMulti}
    >
      {options!.map((o) => (
        <option value={o.value} key={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export const CreatableSelect = <
  OptionType extends OptionTypeBase = Option,
  IsMulti extends boolean = false
>(
  props: CreatableProps<OptionType, IsMulti> & Props<OptionType, IsMulti>
): JSX.Element => <Select creatable={true} {...props} />;

export default Select as unknown as typeof ReactSelect;

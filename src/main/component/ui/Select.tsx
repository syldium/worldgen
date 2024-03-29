import { ChangeEvent, lazy, ReactElement, Suspense } from 'react';
import type { ActionMeta, GroupBase, OnChangeValue, Props } from 'react-select';
import type ReactSelect from 'react-select';
import type { CreatableProps } from 'react-select/creatable';

export interface Option {
  label: string;
  value: string;
}

export interface SelectProps<
  OptionType extends Option,
  IsMulti extends boolean = false,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
> extends Props<OptionType, IsMulti, GroupType> {
  options: readonly OptionType[];
}

const LoadableSelect = lazy(() => import('./LoadableSelect')) as typeof Select;

export function Select<
  OptionType extends Option,
  IsMulti extends boolean = false,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
>(
  props: SelectProps<OptionType, IsMulti, GroupType> & {
    creatable?: true;
    testId?: string;
  }
): ReactElement {
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
  OptionType extends Option,
  IsMulti extends boolean = false,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
>({
  inputId,
  isMulti,
  name,
  options,
  value,
  onChange,
  testId
}: SelectProps<OptionType, IsMulti, GroupType> & {
  testId?: string;
}): ReactElement {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const actionPlaceholder = {} as ActionMeta<OptionType>;
    if (isMulti) {
      onChange!(
        Array.from(e.target.options)
          .filter((o) => o.selected)
          .map((o) => ({
            label: o.label,
            value: o.value
          })) as unknown as OnChangeValue<OptionType, IsMulti>,
        actionPlaceholder
      );
    } else {
      onChange!(
        options!.find((o) => o.value === e.target.value) as OnChangeValue<
          OptionType,
          IsMulti
        >,
        actionPlaceholder
      );
    }
  };
  const val = Array.isArray(value) ?
    value.map((o) => o.value) :
    (value as unknown as Option)?.value;
  return (
    <select
      id={inputId}
      name={name}
      value={val}
      onChange={handleChange}
      multiple={isMulti}
      data-testid={testId}
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
  OptionType extends Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
>(
  props:
    & CreatableProps<OptionType, IsMulti, Group>
    & SelectProps<OptionType, IsMulti>
): ReactElement => <Select creatable={true} {...props} />;

export default Select as unknown as typeof ReactSelect;

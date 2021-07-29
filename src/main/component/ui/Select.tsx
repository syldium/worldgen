import React from 'react';
import ReactSelect, {
  createFilter,
  MenuListComponentProps
} from 'react-select';
import ReactSelectCreatable from 'react-select/creatable';
import { Props } from 'react-select';
import { StylesConfig } from 'react-select/src/styles';
import { GroupTypeBase, OptionTypeBase } from 'react-select/src/types';
import { FixedSizeList } from 'react-window';
import type { SelectComponentsConfig } from 'react-select/src/components';

export interface Option {
  label: string;
  value: string;
}

const styles_: StylesConfig<Option, boolean> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'var(--bg-color-input)',
    borderColor: 'var(--border-color)',
    ':hover': {
      ...styles[':hover'],
      backgroundColor: 'var(--bg-color-input-hover)',
      borderColor: 'var(--border-color)'
    },
    ':focus': {
      ...styles[':focus'],
      boxShadow: '0 0 0 1px var(--focus-color)'
    },
    transition: '.1s'
  }),
  singleValue: (styles) => ({
    ...styles,
    color: 'var(--primary-color)'
  }),
  menuList: (styles) => ({
    ...styles,
    color: 'var(--primary-color)',
    backgroundColor: 'var(--bg-color-section)',
    ':hover': {
      ...styles[':hover'],
      color: 'var(--bg-color-input-hover)'
    }
  }),
  input: (styles) => ({
    ...styles,
    color: 'var(--primary-color)'
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: 'var(--bg-color-section)'
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    color: 'var(--primary-color)',
    cursor: 'pointer',
    backgroundColor: isSelected
      ? 'var(--bg-color-select-focus)'
      : isFocused
      ? 'var(--bg-color-input-hover)'
      : undefined,
    ':active': {
      ...styles[':active'],
      backgroundColor: isSelected
        ? 'var(--bg-color-select-focus)'
        : 'var(--bg-color-input-hover)'
    }
  }),
  multiValue: (styles) => ({
    ...styles,
    color: 'var(--primary-color)',
    backgroundColor: 'var(--select-label)'
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: 'var(--primary-color)',
    backgroundColor: 'var(--select-label)'
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    ':hover': {
      ...styles[':hover'],
      backgroundColor: 'var(--select-label)'
    }
  })
};

function MenuList<
  OptionType extends OptionTypeBase,
  IsMulti extends boolean,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
>({
  options,
  children,
  maxHeight,
  getValue
}: MenuListComponentProps<OptionType, IsMulti, GroupType>): JSX.Element | null {
  if (!children || !Array.isArray(children)) return null;

  const height = 40;
  const selectedValues = getValue();
  const initialOffset = selectedValues[0]
    ? options.indexOf(selectedValues[0]) * height
    : 0;

  return (
    <FixedSizeList
      width=""
      itemSize={height}
      height={maxHeight}
      itemCount={children.length}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => (
        <div className="option-wrapper" style={style}>
          {children[index]}
        </div>
      )}
    </FixedSizeList>
  );
}

const filter = createFilter({ ignoreAccents: false });
export const selectComponents: SelectComponentsConfig<Option, boolean> = {
  MenuList
};
const Select = <
  OptionType extends OptionTypeBase = Option,
  IsMulti extends boolean = false,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
>(
  props: Props<OptionType, IsMulti, GroupType>
): JSX.Element => (
  // @ts-ignore
  <ReactSelect
    components={selectComponents}
    styles={styles_}
    filterOption={filter}
    {...props}
  />
);

export const CreatableSelect = <
  OptionType extends OptionTypeBase,
  IsMulti extends boolean = false
>(
  props: Props<OptionType, IsMulti>
): JSX.Element => (
  // @ts-ignore
  <ReactSelectCreatable
    components={selectComponents}
    styles={styles_}
    filterOption={filter}
    {...props}
  />
);

export default React.memo(Select) as typeof Select;

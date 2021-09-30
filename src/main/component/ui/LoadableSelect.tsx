import React from 'react';
import ReactSelect, { createFilter } from 'react-select';
import ReactSelectCreatable, { CreatableProps } from 'react-select/creatable';
import { StylesConfig } from 'react-select/src/styles';
import { FixedSizeList } from 'react-window';
import type { SelectComponentsConfig } from 'react-select/src/components';
import type { Option } from './Select';
import type { Props } from 'react-select/base';
import type { GroupBase } from 'react-select/src/types';
import type { MenuProps } from 'react-select/src/components/Menu';

const styles_: StylesConfig<Option> = {
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
  OptionType,
  IsMulti extends boolean = false,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
>({
  options,
  children,
  maxHeight,
  getValue
}: MenuProps<OptionType, IsMulti, GroupType> & {
  maxHeight?: number;
}): JSX.Element | null {
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
      height={maxHeight!}
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
export const selectComponents = {
  MenuList
};
const Select = <
  OptionType extends Option,
  IsMulti extends boolean = false,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
>(
  props: Props<OptionType, IsMulti, GroupType> & { creatable?: true }
): JSX.Element => {
  if (props.creatable) {
    return <CreatableSelect {...props} />;
  }
  return (
    <ReactSelect
      {...props}
      components={
        selectComponents as unknown as SelectComponentsConfig<
          OptionType,
          IsMulti,
          GroupType
        >
      }
      styles={
        styles_ as unknown as StylesConfig<OptionType, IsMulti, GroupType>
      }
      filterOption={filter}
    />
  );
};

const CreatableSelect = <
  OptionType extends Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
>(
  props: CreatableProps<OptionType, IsMulti, Group>
): JSX.Element => (
  <ReactSelectCreatable
    components={
      selectComponents as unknown as SelectComponentsConfig<
        OptionType,
        IsMulti,
        Group
      >
    }
    styles={styles_ as unknown as StylesConfig<OptionType, IsMulti, Group>}
    filterOption={filter}
    {...props}
  />
);

export default React.memo(Select) as typeof Select;

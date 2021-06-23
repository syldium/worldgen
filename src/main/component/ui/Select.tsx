import React from 'react';
import ReactSelect from 'react-select';
import ReactSelectCreatable from 'react-select/creatable';
import { Props } from 'react-select';
import { StylesConfig } from 'react-select/src/styles';
import { GroupTypeBase, OptionTypeBase } from 'react-select/src/types';

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

const Select = <
  OptionType extends OptionTypeBase = Option,
  IsMulti extends boolean = false,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
>(
  props: Props<OptionType, IsMulti, GroupType>
): JSX.Element => (
  // @ts-ignore
  <ReactSelect styles={styles_} {...props} />
);

export const CreatableSelect = <
  OptionType extends OptionTypeBase,
  IsMulti extends boolean = false
>(
  props: Props<OptionType, IsMulti>
): JSX.Element => (
  // @ts-ignore
  <ReactSelectCreatable styles={styles_} {...props} />
);

export default Select;

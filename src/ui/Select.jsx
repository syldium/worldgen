import React from 'react';
import ReactSelect from 'react-select';
import ReactSelectCreatable from "react-select/creatable";

const styles = {
    control: styles => ({
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
        transition: '.1s',
    }),
    singleValue: styles => ({
        ...styles,
        color: 'var(--primary-color)',
    }),
    menuList: styles => ({
        ...styles,
        color: 'var(--primary-color)',
        backgroundColor: 'var(--bg-color-section)',
        ':hover': {
            ...styles[':hover'],
            color: 'var(--bg-color-input-hover)',
        },
    }),
    input: styles => ({
        ...styles,
        color: 'var(--primary-color)',
    }),
    menu: styles => ({
        ...styles,
        backgroundColor: 'var(--bg-color-section)',
    }),
    option: (styles, { isFocused, isSelected }) => ({
        ...styles,
        color: 'var(--primary-color)',
        cursor: 'pointer',
        backgroundColor: isSelected
            ? 'var(--bg-color-select-focus)'
            : isFocused
                ? 'var(--bg-color-input-hover)'
                : null,
        ':active': {
            ...styles[':active'],
            backgroundColor: isSelected
                ? 'var(--bg-color-select-focus)'
                : 'var(--bg-color-input-hover)',
        },
    }),
    multiValue: styles => ({
        ...styles,
        color: 'var(--primary-color)',
        backgroundColor: 'var(--select-label)'
    }),
    multiValueLabel: styles => ({
        ...styles,
        color: 'var(--primary-color)',
        backgroundColor: 'var(--select-label)'
    }),
    multiValueRemove: styles => ({
        ...styles,
        ':hover': {
            ...styles[':hover'],
            backgroundColor: 'var(--select-label)',
        },
    }),
};

const Select = props => {
    return (
        <ReactSelect
            styles={styles}
            {...props}
        />
    );
};

export const CreatableSelect = props => {
    return (
        <ReactSelectCreatable
            styles={styles}
            {...props}
        />
    );
};

export default React.memo(Select);

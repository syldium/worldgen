import React, { useEffect } from 'react';
import { hexColorToInteger, integerColorToHex } from '../utils/color';

export const ConfInput = React.memo(function ({
    attr, type,
    checked, defaultChecked,
    children,
    name, id,
    onChange,
    value, defaultValue,
    min, max, step,
    className, style = {}
}) {

    const uId = name || Math.random().toString(36).substr(2, 5) + '-' + id;
    
    if (typeof type !== 'string') {
        if (typeof checked !== 'undefined' || typeof defaultChecked !== 'undefined') {
            type = 'checkbox';
        } else if (typeof step === 'number' || typeof max === 'number' || !isNaN(typeof value === 'undefined' ? defaultValue : value)) {
            type = 'number';
        } else {
            type = 'text';
        }
    }

    if (type === 'number') {
        style.width = getNumberSize(parseFloat(defaultValue || value || 0), max, step);
        className = (className || '') + ' number-wrapper';
    }

    if (type === 'checkbox') {
        return <div className={className}>
            <label htmlFor={uId}>{children}</label>&nbsp;:&nbsp;<input type={type || 'checkbox'} data-name={name || id} name={name} id={uId} className="checkbox" {...{ ...attr, checked, defaultChecked, onChange, value, style }} />
        </div>
    }
    return <div className={className}>
        {typeof children === 'undefined' || <><label htmlFor={uId}>{children}</label> : </>}
        <input
            type={type} data-name={name || id} name={name} id={uId}
            {...{ ...attr, value, onChange, defaultValue, min, max, step, style }} />
    </div>
});

export const NumberInput = React.memo(function ({
    className, style, children, defaultValue = 0,
    id, name, onChange, upChange,
    required = true, value,
    type, step, min = 0, max
}) {

    const handleChange = function(e) {
        const value = e.target.value;

        if (type === 'color') {
            if (typeof upChange === 'function') {
                upChange({ [id || name]: hexColorToInteger(value) });
            } else if (typeof onChange === 'function') {
                onChange(hexColorToInteger(value));
            }
            return;
        }

        const parse = typeof step === 'undefined' ? parseInt : parseFloat;
        if (value !== '' && !isNaN(value)) {
            if (typeof upChange === 'function') {
                upChange({ [id || name]: parse(value) });
            } else if (typeof onChange === 'function') {
                onChange(parse(value));
            }
        }
    };
    
    if (required && typeof value !== 'number' && defaultValue !== 0) {
        useEffect(() => {
            if (typeof upChange === 'function') {
                upChange({ [id || name]: parseFloat(defaultValue) });
            } else if (typeof onChange === 'function') {
                onChange(parseFloat(defaultValue));
            }
        }, [defaultValue, id, name, onChange, upChange]);
    }
    value = type === 'color' ? integerColorToHex(value) : (typeof value === 'number' ? value : defaultValue);
    return <ConfInput id={id} name={name} className={className}
        step={step} min={min} max={max} type={type || 'number'} style={style}
        value={value} onChange={handleChange} required={required}>
            {children}
    </ConfInput>
});

function getNumberSize(n, max = 10, step = 1) {
    const decimals = Math.max(countDecimals(step), countDecimals(n));
    const length = n.toFixed(decimals).toString().length;
    const ceil = max > 9 && n < 10;
    const smooth = step === 1 ? 7 : 5;
    return length + smooth + (ceil ? 1 : 0) + 'ch';
}
function countDecimals(n) { 
    if ((n % 1) !== 0) 
        return n.toString().split(".")[1].length;  
    return 0;
};

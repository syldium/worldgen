import { INT_MAX_VALUE, maintainPrecision } from '../utils/math';
import { hexColorToInteger, integerColorToHex } from '../utils/color';
import React, { useCallback, useEffect, useState } from 'react';

export const ConfInput = React.memo(function ({
    attr, type,
    checked, defaultChecked,
    children,
    name, id,
    onChange,
    value, defaultValue,
    min, max, step,
    className, style
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
    className, style = {}, children, defaultValue = 0,
    id, name, onChange, upChange,
    required = true, title, value,
    type = 'number', step = 1, min = 0, max = INT_MAX_VALUE
}) {

    const uId = name || Math.random().toString(36).substr(2, 5) + '-' + id;
    const n = parseFloat(typeof value === 'number' || typeof value === 'string' ? value : defaultValue);
    const [val, setValue] = useState(n);
    const [prevVal, setPrevValue] = useState(n);
    const [click, setClick] = useState(null);

    value = parseFloat(value);
    min = parseFloat(min);
    step = parseFloat(step);
    max = parseFloat(max);

    if (n !== prevVal && n !== val && !isNaN(val) && val !== '') {
        setValue(n);
        setPrevValue(n);
    }

    const handleChange = useCallback(function (e) {
        const value = e.target.value;
        const n = parseFloat(value);
        if (value === '') {
            setValue(value);
        } else if (value.length <= INT_MAX_VALUE.toString().length) {
            if (value.endsWith('.00001')) {
                // Fix browser step
                setValue(val => maintainPrecision(val + (n > val ? step : -step)));
            } else {
                setValue(value);
            }
        }
    }, [step]);

    const stepUpDown = useCallback(function (addition) {
        setValue(val => {
            if (!isNaN(val)) {
                const n = maintainPrecision(val + (addition ? step : -step));
                if (n >= min && n <= max) {
                    return n;
                }
                return val;
            }
            return val;
        });
    }, [max, min, step]);

    const handleMouseDown = useCallback(function (e) {
        e.preventDefault();
        const addition = e.target.classList.contains('btn-plus');
        if (val === '') {
            return;
        }
        stepUpDown(addition);
        setClick(window.setInterval(() => stepUpDown(addition), 150));
    }, [stepUpDown, val]);

    const handleClick = useCallback(function (e) {
        e.preventDefault();
    }, []);

    const handleMouseUp = useCallback(function (e) {
        e.preventDefault();
        window.clearInterval(click);
        setClick(null);
    }, [click]);

    useEffect(function () {
        let n = val;
        if (typeof n === 'string') {
            const value = val.replace(',', '.');
            const parse = typeof step === 'undefined' ? parseInt : parseFloat;
            n = parse(value);
        }

        if (isNaN(value) && n === defaultValue && !required) {
            return;
        }

        if (!isNaN(n) && val !== value && n >= min && n <= max && click === null) {
            if (typeof upChange === 'function') {
                upChange({ [id || name]: n });
            } else if (typeof onChange === 'function') {
                onChange(n);
            }
        }
    }, [click, defaultValue, id, min, max, name, onChange, required, step, type, upChange, val, value]);

    style.width = getNumberSize(val, max, step);
    className = (className || '') + ' number-wrapper';

    return <div className={className} title={title}>
        {typeof children === 'undefined' || <div className="label"><label htmlFor={uId}>{children}</label> :&nbsp;</div>}
            <div className="number-input-wrapper"><input
                type={type} name={name} id={uId} style={style}
                min={min} max={max}
                value={val} data-name={name || id} required={required}
                step={step < 1 ? 'any' : step} onChange={handleChange}
            />
            {type === 'number' &&
                <div className="number-controls">
                    <button className="btn-plus" tabIndex="-1" onMouseDown={handleMouseDown} onClick={handleClick} onMouseOut={handleMouseUp} onMouseUp={handleMouseUp}></button>
                    <button className="btn-minus" tabIndex="-1" onMouseDown={handleMouseDown} onClick={handleClick} onMouseOut={handleMouseUp} onMouseUp={handleMouseUp}></button>
                </div>
            }</div>
    </div>
});

export const ColorInput = React.memo(function({ children, defaultValue = 0, id, onChange, upChange, value }) {
    const uId = Math.random().toString(36).substr(2, 5) + '-' + id;

    const handleChange = useCallback(function(e) {
        const value = e.target.value;

        if (typeof upChange === 'function') {
            upChange({ [id]: hexColorToInteger(value) });
        } else if (typeof onChange === 'function') {
            onChange(hexColorToInteger(value));
        }
    }, [id, onChange, upChange]);

    
    useEffect(() => {
        if (typeof value !== 'number' && defaultValue !== 0) {
            if (typeof upChange === 'function') {
                upChange({ [id]: parseFloat(defaultValue) });
            } else if (typeof onChange === 'function') {
                onChange(parseFloat(defaultValue));
            }
        }
    }, [defaultValue, id, onChange, upChange, value]);

    return <div>
        {typeof children === 'undefined' || <><label htmlFor={uId}>{children}</label> : </>}
        <input type="color" id={uId} data-name={id} onChange={handleChange} value={integerColorToHex(value || defaultValue)} />
    </div>
});

function getNumberSize(numeric, max = 10, step = 1) {
    if (numeric === '') {
        return 12 + 'ch';
    }
    const decimals = countDecimals(step);

    let n, str;
    if (typeof numeric === 'number') {
        n = numeric;
        str = numeric.toString();
    } else {
        n = parseFloat(numeric);
        str = numeric;
    }

    let length = str.length;
    if (!isNaN(n)) {
        length = Math.max(length, n.toFixed(decimals).toString().length);
    }
    const ceil = max > 9 && n < 10;
    const smooth = step === 1 ? 4 : 2;
    return length + smooth + (ceil ? 1 : 0) + 'ch';
}
function countDecimals(n) {
    if (typeof n !== 'number') {
        return 0;
    }
    if ((n % 1) !== 0)
        return n.toString().split(".")[1].length;
    return 0;
}

import { NumberInput } from '../../ui/Input';
import React, { useCallback } from 'react';

export const UniformInt = React.memo(function ({ children, id, minBase = 0, maxBase = 4, maxSpread = 4, upChange, value, defaultValue = 4 }) {
    const handleChange = useCallback(function (val) {
        upChange({ [id]: { ...value, ...val } })
    }, [id, upChange, value]);

    if (typeof value === 'number' || typeof value === 'undefined') {
        return <NumberInput id={id} value={value} defaultValue={defaultValue} max={maxBase} upChange={upChange}>{children}</NumberInput>
    }

    if (typeof value !== 'object') {
        value = { base: 4, spread: 1 };
    }
    return <>
        <NumberInput id="base" value={value.base} upChange={handleChange} min={minBase} max={maxBase}>{children} base</NumberInput>
        <NumberInput id="spread" value={value.spread} upChange={handleChange} max={maxSpread}>{children} spread</NumberInput>
    </>
});

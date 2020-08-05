import React from 'react';
import { NumberInput } from './Input';

export const NumberList = React.memo(function ({ children, numbers = [], onChange }) {

    const handleChange = function(val, pos) {
        onChange(numbers.map((n, i) => i === pos ? val : n));
    };

    return <div className="form-row">
        <label>{children}</label>&nbsp;:&nbsp;{numbers.map((n, i) => <NumberInput key={i} value={n} onChange={(n) => handleChange(n, i)} />)}
    </div>
});

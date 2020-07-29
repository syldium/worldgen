import React from 'react';

export const NumberList = React.memo(function ({ numbers = [], onChange }) {

    const handleChange = function(val, pos) {
        onChange(numbers.map((n, i) => i === pos ? val : n));
    };

    return <div className="flex-container">
        {numbers.map((n, i) => <NumberInput key={i} number={n} onChange={(n) => handleChange(n, i)} />)}
    </div>
});

const NumberInput = React.memo(function ({ number, onChange }) {
    return <input type="number" value={number} onChange={e => onChange(parseInt(e.target.value))} />
});
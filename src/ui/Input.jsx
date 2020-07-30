import React from 'react';

export const ConfInput = React.memo(function ({
    attr,
    checked, defaultChecked,
    children,
    name, id,
    onChange,
    value, defaultValue,
    min, max, step,
    style
}) {

    const uId = name || Math.random().toString(36).substr(2, 5) + '-' + id;

    if (typeof checked !== 'undefined' || typeof defaultChecked !== 'undefined') {
        return <div>
            <label htmlFor={uId}>{children}</label> : <input type="checkbox" data-name={name || id} name={name} id={uId} className="checkbox" {...{ ...attr, checked, defaultChecked, onChange, value, style }} />
        </div>
    }
    return <div>
        <label htmlFor={uId}>{children}</label> : <input type={isNaN(typeof value === 'undefined' ? defaultValue : value) ? 'text' : 'number'} data-name={name || id} name={name} id={uId} {...{ ...attr, onChange, value, defaultValue, min, max, step, style }} />
    </div>
});
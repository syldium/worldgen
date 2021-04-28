import { useKeyedListOptions } from '../../../hooks/context';
import React, { useCallback } from 'react';
import Select from '../../../ui/Select';

export function DecoratedFeature({ feature, onChange }) {

    const options = useKeyedListOptions('features');

    const handleChange = useCallback(function (option) {
        onChange(option.value)
    }, [onChange]);

    return <fieldset>
        <legend>Feature</legend>
        <Select options={options} value={options.find(o => feature === o.value)} onChange={handleChange} />
    </fieldset>
}

import React from 'react';
import Select from 'react-select';
import { useKeyedListOptions } from '../../hooks/context';

export function DimensionType({type = 'minecraft:overworld'}) {
    const options = useKeyedListOptions('dimension_types');

    return <div className="form-group">
        <label htmlFor="dimension-type">Dimension type</label>
        <Select name="dimension-type" options={options} defaultValue={options.find(o => o.value === type) || options[0]} />
    </div>;
}

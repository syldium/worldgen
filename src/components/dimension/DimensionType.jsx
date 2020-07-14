import React from 'react';
import Select from 'react-select';

export function DimensionType({type = 'minecraft:overworld'}) {
    const options = [
        { value: 'minecraft:overworld', label: 'Overworld' },
        { value: 'minecraft:overworld_cave', label: 'Overworld caves' },
        { value: 'minecraft:the_nether', label: 'The Nether' },
        { value: 'minecraft:the_end', label: 'The End' },
    ];

    return <div className="form-group">
        <label htmlFor="dimension-type">Dimension type</label>
        <Select name="dimension-type" options={options} defaultValue={options.find(o => o.value === type)} />
    </div>;
}
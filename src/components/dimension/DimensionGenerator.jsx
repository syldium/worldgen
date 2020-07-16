import React, { useState, useCallback, useEffect } from 'react';
import { BiomeSource } from './BiomeSource';
import { FIXED_GENERATOR } from './DimensionDefaults';
import { hashCode } from './../../utils/hash';
import Select from 'react-select';

export function DimensionGenerator({generator = FIXED_GENERATOR, onChange}) {

    const [data, setData] = useState(generator);

    const handleSeedChange = useCallback(function(seed) {
        setData(data => {
            data.seed = seed;
            return data;
        });
        onChange(data);
    }, [data, onChange]);

    const handleSettingsChange = useCallback(function(settings) {
        setData(data => {
            data.settings = settings;
            return data;
        });
        onChange(data);
    }, [data, onChange]);

    const handleBiomeSourceChange = useCallback(function(biome_source) {
        setData(data => {
            data.biome_source = biome_source;
            return data;
        });
        onChange(data);
    }, [data, onChange]);

    useEffect(function () {
        onChange(data);
    }, [data, onChange]);

    return <fieldset>
        <legend>Noise dimension generator</legend>
        <div className="form-group">
            <SeedField value={data.seed} onChange={handleSeedChange} />
            <Settings settings={data.settings} onChange={handleSettingsChange} />
            <BiomeSource biome_source={data.biome_source} onChange={handleBiomeSourceChange} />
        </div>
    </fieldset>;
}

export const SeedField = React.memo(function({onChange, value = '286956243'}) {
    const [text, setText] = useState(value);

    const handleChange = function(e) {
        const value = e.target.value;
        setText(value);
        onChange(isNaN(value) ? hashCode(value) : value);
    };

    return <div className="form-group">
        <label>Seed</label> : <input type="text" value={text} onChange={handleChange} />
    </div>
});

const Settings = React.memo(function({onChange, settings = 'minecraft:overworld'}) {
    const handleChange = useCallback(function(option) {
        onChange(option.value);
    }, [onChange]);

    const options = [
        { value: 'minecraft:overworld', label: 'Overworld' },
        { value: 'minecraft:nether', label: 'Nether' },
        { value: 'minecraft:end', label: 'End' },
        { value: 'minecraft:amplified', label: 'Amplified' },
        { value: 'minecraft:caves', label: 'Caves' },
        { value: 'minecraft:floating_islands', label: 'Floating islands' }
    ];

    return <div className="form-group">
        <label htmlFor="settings">Settings</label><Select options={options} defaultValue={options.find(o => o.value === settings)} onChange={handleChange} />
    </div>;
});
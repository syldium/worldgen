import React, { useState, useCallback, useEffect } from 'react';
import { BiomeSource } from './BiomeSource';
import { hashCode } from './../../utils/hash';
import Select from '../../ui/Select';
import { useKeyedListOptions } from '../../hooks/context';
import { ConfInput } from '../../ui/Input';

export function DimensionGenerator({generator, onChange}) {
    
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
        if (data !== generator) {
            onChange(data);
        }
    }, [data, generator, onChange]);

    return <fieldset>
        <legend>Noise dimension generator</legend>
        <div className="form-group">
            <SeedField value={data.seed} onChange={handleSeedChange} />
            <Settings settings={data.settings} onChange={handleSettingsChange} />
            <BiomeSource biome_source={data.biome_source} onChange={handleBiomeSourceChange} />
        </div>
    </fieldset>;
}

export const SeedField = React.memo(function({onChange, value = 286956243}) {
    const [text, setText] = useState(value);

    const handleChange = function(e) {
        const value = e.target.value;
        setText(value);
        onChange(isNaN(value) ? hashCode(value) : parseInt(value));
    };

    return <div className="form-group">
        <ConfInput type="text" id="seed" value={text} onChange={handleChange}>Seed</ConfInput>
    </div>
});

const Settings = React.memo(function({onChange, settings = 'minecraft:overworld'}) {
    const handleChange = useCallback(function(option) {
        onChange(option.value);
    }, [onChange]);

    const options = useKeyedListOptions('noises');

    return <div className="form-group">
        <label htmlFor="settings">Noise settings</label><Select options={options} value={options.find(o => o.value === settings)} onChange={handleChange} inputId="settings" />
    </div>;
});
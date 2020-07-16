import React, { useCallback, useState, useEffect } from 'react';
import Select from 'react-select';
import { FEATURES } from './BiomeDefaults';
import { useKeyedListOptions } from '../../hooks/context';

export default function GenFeatures({ onChange, features = FEATURES }) {

    const [levels, setLevels] = useState(features);

    const handleLevelChange = useCallback(function(priority, list) {
        setLevels(levels => {
            levels[priority] = list;
            return levels;
        })
        onChange(levels);
    }, [levels, onChange]);

    useEffect(function() {
        onChange(levels);
    }, [levels, onChange]);

    const elements = [];
    levels.forEach((level, i) => {
        elements.push(<li key={i}><GenFeaturesLevel value={level} onChange={handleLevelChange} priority={i} /></li>);
    });
    return <div className="form-group">
        <label>Features</label>
        <p className="help"><small className="text-muted">Each generation feature is associated with a priority. The higher the priority, the later the feature will be applied.</small></p>
        <ol>{elements}</ol>
    </div>;
}

function GenFeaturesLevel({ onChange, priority, value }) {
    const options = useKeyedListOptions('features');
    const features = value;

    const handleChange = useCallback(function(selectedOptions) {
        onChange(priority, selectedOptions === null ? [] : selectedOptions.map(option => option.value));
    }, [onChange, priority]);

    return <Select isMulti options={options} onChange={handleChange} defaultValue={options.filter(o => features.includes(o.value))} />;
}
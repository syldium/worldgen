import React, { useCallback } from 'react';

import { FEATURES } from './BiomeDefaults';
import { useJsonEffect } from '../../hooks/form';
import { useKeyedListOptions } from '../../hooks/context';
import Select from '../../ui/Select';

export const GenFeatures = React.memo(function({ onChange, features }) {

    const handleLevelChange = useCallback(function(priority, list) {
        onChange(features.map((level, p) => priority === p ? list : level));
    }, [features, onChange]);
    useJsonEffect(features || FEATURES, features, onChange);

    return <div className="form-group">
        <label>Features</label>
        <p className="help"><small className="text-muted">Each generation feature is associated with a priority. The higher the priority, the later the feature will be applied.</small></p>
        <ol>
            {features.map((level, i) =>
                <li key={i}><GenFeaturesLevel value={level} onChange={handleLevelChange} priority={i} /></li>
            )}
        </ol>
    </div>;
});

export const GenFeaturesLevel = React.memo(function({ onChange, priority, value }) {
    const options = useKeyedListOptions('features');

    const handleChange = useCallback(function(selectedOptions) {
        onChange(priority, selectedOptions === null ? [] : selectedOptions.map(option => option.value));
    }, [onChange, priority]);

    return <Select isMulti options={options} onChange={handleChange} defaultValue={options.filter(o => value.includes(o.value))} />;
});

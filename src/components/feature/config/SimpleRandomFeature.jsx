import React, { useCallback } from 'react';

import { Button } from '../../../ui/Button';
import { FeatureField } from '../InlineFeature';
import { useCrudPreset } from '../../../hooks/form';
import { useKeyedListOptions } from '../../../hooks/context';
import Select from '../../../ui/Select';

export function SimpleRandomFeature({ configuration, onChange }) {

    const options = useKeyedListOptions('features');
    const [features, handleAdd, handleChange, handleRemove] = useCrudPreset(features => onChange({ features }), configuration.features, (features) => 
        (options.find(o => !features.some(f => f.feature === o.value)) || { value: 'minecraft:oak' }).value
    );

    const handleFeaturesChange = useCallback(function (options) {
        onChange({ features: options === null ? [] : options.map(o => o.value) });
    }, [onChange]);

    const hasInline = configuration.features.some(feature => typeof feature === 'object');

    return <>
        <fieldset>
            <legend>Features {hasInline && <Button onClick={handleAdd}>Add feature</Button>}</legend>
            {hasInline && features.map((feature, i) => {
                const filter = o => feature.feature === o.value || !features.some(f => f.feature === o.value);
                return <FeatureField feature={feature} key={JSON.stringify(feature) + i} filter={filter} onChange={handleChange}><Button cat="danger mlm" onClick={e => handleRemove(e, feature)}>Remove</Button></FeatureField>
            })}
            {!hasInline && <Select isMulti options={options} value={options.filter(o => configuration.features.includes(o.value))} onChange={handleFeaturesChange} />}
        </fieldset>
    </>
}

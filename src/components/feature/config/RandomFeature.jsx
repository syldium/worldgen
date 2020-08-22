import React, { useCallback } from 'react';

import { Button } from '../../../ui/Button';
import { FeatureField } from '../InlineFeature';
import { NumberInput } from '../../../ui/Input';
import { useCrudPreset } from '../../../hooks/form';
import { useKeyedListOptions } from '../../../hooks/context';

export function RandomFeature({ configuration, onChange }) {

    const options = useKeyedListOptions('features');
    const [features, handleAdd, handleChange, handleRemove] = useCrudPreset(features => onChange({ ...configuration, features }), configuration.features, (features) => ({
        feature: (options.find(o => !features.some(f => f.feature === o.value)) || { value: 'minecraft:oak' }).value,
        chance: 0.2
    }));

    const handleChanceChange = useCallback(function (chance, feature) {
        handleChange({ feature: feature.feature, chance }, feature);
    }, [handleChange]);
    const handleDefaultChange = useCallback(function (default_) {
        onChange({ ...configuration, default: default_ });
    }, [configuration, onChange]);
    const handleFeatureChange = useCallback(function (feature, previous) {
        handleChange({ ...previous, feature }, previous);
    }, [handleChange]);

    return <>
        <fieldset>
            <legend>Features <Button onClick={handleAdd}>Add feature</Button></legend>
            {features.map((feature, index) => {
                const filter = o => feature.feature === o.value || !features.some(f => f.feature === o.value);
                return <FeatureField feature={feature.feature} key={JSON.stringify(feature) + index} filter={filter} onChange={f => handleFeatureChange(f, feature)}>
                    <NumberInput id="chance" className="mls" value={feature.chance} max={1} step={0.05} onChange={chance => handleChanceChange(chance, feature)}>Chance</NumberInput>
                    <Button cat="danger mlm" onClick={e => handleRemove(e, feature)}>Remove</Button>
                </FeatureField>
            })}
        </fieldset>
        <fieldset>
            <legend>Default</legend>
            <FeatureField feature={configuration.default} onChange={handleDefaultChange} />
        </fieldset>
    </>
}

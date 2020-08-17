import React, { useCallback } from 'react';
import { BlockPredicate } from '../../state/BlockPredicate';
import { BlockState } from '../../state/BlockState';
import { NumberInput } from '../../../ui/Input';
import { ORE_FEATURE_CONFIG } from "./FeatureConfigDefaults";
import { useJsonEffect } from '../../../hooks/form';

export function OreFeature({configuration, onChange}) {
    const handlePredicateChange = useCallback(function(target) {
        onChange({ ...configuration, target });
    }, [configuration, onChange]);
    const handleBlockChange = useCallback(function(state) {
        onChange({ ...configuration, state });
    }, [configuration, onChange]);
    const handleValueChange = useCallback(function(value) {
        onChange({ ...configuration, ...value });
    }, [configuration, onChange]);
    const config = useJsonEffect(configuration || ORE_FEATURE_CONFIG, configuration, onChange);

    return <div>
        <fieldset>
            <legend>Target</legend>
            <BlockPredicate target={config.target} onChange={handlePredicateChange} />
        </fieldset>
        <fieldset>
            <legend>State</legend>
            <BlockState block={config.state} onChange={handleBlockChange} />
        </fieldset>
        <fieldset>
            <legend>Settings</legend>
            <NumberInput id="size" value={config.size} upChange={handleValueChange}>Size</NumberInput>
        </fieldset>
    </div>;
}
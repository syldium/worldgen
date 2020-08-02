import React, { useCallback } from 'react';
import { ORE_FEATURE_CONFIG } from "./FeatureDefaults";
import { BlockPredicate } from '../state/BlockPredicate';
import { BlockState } from '../state/BlockState';
import { useJsonEffect } from '../../hooks/form';
import { NumberInput } from '../../ui/Input';

export function OreFeatureConfig({configuration, onChange}) {
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
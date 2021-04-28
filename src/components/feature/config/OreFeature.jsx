import { BlockPredicate } from '../../state/BlockPredicate';
import { BlockState } from '../../state/BlockState';
import { NumberInput } from '../../../ui/Input';
import React, { useCallback } from 'react';

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

    return <div>
        <fieldset>
            <legend>Target</legend>
            <BlockPredicate target={configuration.target} onChange={handlePredicateChange} />
        </fieldset>
        <fieldset>
            <legend>State</legend>
            <BlockState block={configuration.state} onChange={handleBlockChange} />
        </fieldset>
        <fieldset>
            <legend>Settings</legend>
            <NumberInput id="size" value={configuration.size} max={64} upChange={handleValueChange}>Size</NumberInput>
        </fieldset>
    </div>
}

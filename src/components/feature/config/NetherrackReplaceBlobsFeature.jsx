import { BlockState } from '../../state/BlockState';
import { INT_MAX_VALUE } from '../../../utils/math';
import { NumberInput } from '../../../ui/Input';
import { UniformInt } from '../../utils/UniformInt';
import React, { useCallback } from 'react';

export function NetherrackReplaceBlobsFeature({ configuration, onChange }) {

    const handleChange = useCallback(function (value) {
        onChange({ ...configuration, ...value });
    }, [configuration, onChange]);
    const handleStateChange = useCallback(function (state) {
        onChange({ ...configuration, state });
    }, [configuration, onChange]);
    const handleTargetChange = useCallback(function (target) {
        onChange({ ...configuration, target });
    }, [configuration, onChange]);

    return <fieldset>
        <legend>Config</legend>
        <BlockState block={configuration.state} onChange={handleStateChange} />
        <div className="form-group form-row">
            <UniformInt id="radius" value={configuration.radius} maxBase={INT_MAX_VALUE} maxSpread={INT_MAX_VALUE} upChange={handleChange}>Radius</UniformInt>
            <NumberInput id="half_height" value={configuration.half_height} upChange={handleChange}>Half height</NumberInput>
        </div>
        <fieldset>
            <legend>Target</legend>
            <BlockState block={configuration.target} onChange={handleTargetChange} />
        </fieldset>
    </fieldset>
}

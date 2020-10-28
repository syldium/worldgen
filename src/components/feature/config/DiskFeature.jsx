import { BlockState, BlocksList } from '../../state/BlockState';
import React, { useCallback } from 'react';

import { NumberInput } from '../../../ui/Input';
import { UniformInt } from '../../utils/UniformInt';

export function DiskFeature({ configuration, onChange, type }) {

    const handleChange = useCallback(function (value) {
        onChange({ ...configuration, ...value });
    }, [configuration, onChange]);
    const handleStateChange = useCallback(function (state) {
        onChange({ ...configuration, state });
    }, [configuration, onChange]);
    const handleTargetsChange = useCallback(function (targets) {
        onChange({ ...configuration, targets });
    }, [configuration, onChange]);

    return <div>
        <p className="help text-muted">A <code>{type}</code> feature need to be { type === 'minecraft:disk' ? 'underwater' : 'in snow blocks' } to be generated.</p>
        <fieldset>
            <legend>Config</legend>
            <BlockState block={configuration.state} onChange={handleStateChange} />
            <div className="form-group form-row">
                <UniformInt id="radius" value={configuration.radius} upChange={handleChange}>Radius</UniformInt>
                <NumberInput id="half_height" value={configuration.half_height} upChange={handleChange}>Half height</NumberInput>
            </div>
            <fieldset>
                <legend>Targets</legend>
                <BlocksList list={configuration.targets} onChange={handleTargetsChange} />
            </fieldset>
        </fieldset>
    </div>
}

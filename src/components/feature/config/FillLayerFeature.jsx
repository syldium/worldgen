import { BlockState } from '../../state/BlockState';
import { NumberInput } from '../../../ui/Input';
import React, { useCallback } from 'react';

export function FillLayerFeature({ configuration, onChange }) {

    const handleChange = useCallback(function (state) {
        onChange({ ...configuration, state });
    }, [configuration, onChange]);
    const handleHeightChange = useCallback(function (height) {
        onChange({ ...configuration, height });
    }, [configuration, onChange]);

    return <fieldset>
        <legend>Config</legend>
        <div className="form-group">
            <NumberInput id="height" value={configuration.height} max={255} onChange={handleHeightChange}>Height</NumberInput>
        </div>
        <BlockState block={configuration.state} onChange={handleChange} />
    </fieldset>
}

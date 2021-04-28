import { BlockState } from '../../state/BlockState';
import React, { useCallback } from 'react';

export function EmeraldOreFeature({ configuration, onChange }) {

    const handleStateChange = useCallback(function (state) {
        onChange({ ...configuration, state });
    }, [configuration, onChange]);
    const handleTargetChange = useCallback(function (target) {
        onChange({ ...configuration, target });
    }, [configuration, onChange]);

    return <fieldset>
        <legend>Config</legend>
        <label>State</label>
        <BlockState block={configuration.state} className="" onChange={handleStateChange} />
        <label>Target</label>
        <BlockState block={configuration.target} className="" onChange={handleTargetChange} />
    </fieldset>
}

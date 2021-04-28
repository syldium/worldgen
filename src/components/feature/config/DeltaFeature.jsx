import { BlockState } from '../../state/BlockState';
import { UniformInt } from '../../utils/UniformInt';
import React, { useCallback } from 'react';

export function DeltaFeature({ configuration, onChange }) {

    const handleChange = useCallback(function (value) {
        onChange({ ...configuration, ...value });
    }, [configuration, onChange]);
    const handleContentsChange = useCallback(function (contents) {
        onChange({ ...configuration, contents });
    }, [configuration, onChange]);
    const handleRimChange = useCallback(function (rim) {
        onChange({ ...configuration, rim });
    }, [configuration, onChange]);

    return <fieldset>
        <legend>Config</legend>
        <BlockState block={configuration.contents} onChange={handleContentsChange} />
        <BlockState block={configuration.rim} onChange={handleRimChange} />
        <div className="form-group form-row">
            <UniformInt id="size" value={configuration.size} maxBase={8} maxSpread={8} upChange={handleChange}>Size</UniformInt>
            <UniformInt id="rim_size" value={configuration.rim_size} maxBase={8} maxSpread={8} upChange={handleChange}>Rim size</UniformInt>
        </div>
    </fieldset>
}

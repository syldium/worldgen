import React, { useCallback } from 'react';

import { UniformInt } from '../../utils/UniformInt';

export function BasaltColumnsFeature({ configuration, onChange }) {

    const handleHeightChange = useCallback(function (height) {
        onChange({ ...configuration, height });
    }, [configuration, onChange]);
    const handleReachChange = useCallback(function (reach) {
        onChange({ ...configuration, reach });
    }, [configuration, onChange]);

    return <fieldset>
        <legend>Config</legend>
        <div className="form-group form-row">
            <UniformInt id="reach" value={configuration.reach} maxBase={2} maxSpread={2} onChange={handleReachChange}>Reach</UniformInt>
            <UniformInt id="height" value={configuration.height} minBase={1} maxBase={5} maxSpread={5} onChange={handleHeightChange}>Height</UniformInt>
        </div>
    </fieldset>
}

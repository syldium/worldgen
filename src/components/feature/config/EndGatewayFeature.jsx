import React, { useCallback } from 'react';

import { BlockPosition } from '../../utils/BlockPosition';
import { ConfInput } from '../../../ui/Input';

export function EndGatewayFeature({ configuration, onChange }) {

    const handleExitChange = useCallback(function (exit) {
        if (exit === null) {
            onChange((({ exit, ...config }) => config)(configuration));
        } else {
            onChange({ ...configuration, exit });
        }
    }, [configuration, onChange]);
    const handleExactChange = useCallback(function (e) {
        onChange({ ...configuration, exact: e.target.checked });
    }, [configuration, onChange]);

    return <fieldset>
        <legend>Settings</legend>
        <div className="form-group form-row">
            <ConfInput id="exact" checked={configuration.exact} onChange={handleExactChange}>Exact</ConfInput>
            <BlockPosition id="exit" position={configuration.exit} optional onChange={handleExitChange}>Exit : </BlockPosition>
        </div>
    </fieldset>
}

import React, { useCallback } from 'react';
import { BlockState } from '../../state/BlockState';

export function SingleStateFeature({ configuration, onChange }) {

    const handleChange = useCallback(function (state) {
        onChange({ state });
    }, [onChange]);

    return <fieldset>
        <legend>Block state</legend>
        <BlockState block={configuration.state} onChange={handleChange} />
    </fieldset>
}

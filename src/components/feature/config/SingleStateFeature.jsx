import { BlockState } from '../../state/BlockState';
import React, { useCallback } from 'react';

export function SingleStateFeature({ configuration, onChange }) {

    const handleChange = useCallback(function (state) {
        onChange({ state });
    }, [onChange]);

    return <fieldset>
        <legend>Block state</legend>
        <BlockState block={configuration.state} onChange={handleChange} />
    </fieldset>
}

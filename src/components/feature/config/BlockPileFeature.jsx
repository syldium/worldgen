import React, { useCallback } from 'react';

import { BLOCK_PILE_FEATURE_CONFIG } from './FeatureConfigDefaults';
import { BlockStateProvider } from '../../state/BlockStateProvider';

export function BlockPileFeature({ configuration = BLOCK_PILE_FEATURE_CONFIG, onChange }) {

    const handleChange = useCallback(function (state_provider) {
        onChange({ state_provider });
    }, [onChange]);

    return <fieldset>
        <legend>Block state provider</legend>
        <BlockStateProvider block={configuration.state_provider} onChange={handleChange} />
    </fieldset>
}

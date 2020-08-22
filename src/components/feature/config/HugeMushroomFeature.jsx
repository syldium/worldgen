import React, { useCallback } from 'react';

import { BlockStateProvider } from '../../state/BlockStateProvider';
import { NumberInput } from '../../../ui/Input';

export function HugeMushroomFeature({ configuration, onChange }) {

    const handleCapProviderChange = useCallback(function (cap_provider) {
        onChange({ ...configuration, cap_provider });
    }, [configuration, onChange]);
    const handleFoliageRadiusChange = useCallback(function (foliage_radius) {
        onChange({ ...configuration, foliage_radius });
    }, [configuration, onChange]);
    const handleStemProviderChange = useCallback(function (stem_provider) {
        onChange({ ...configuration, stem_provider });
    }, [configuration, onChange]);

    return <>
        <fieldset>
            <legend>Cap provider</legend>
            <BlockStateProvider block={configuration.cap_provider} className="" onChange={handleCapProviderChange} />
        </fieldset>
        <fieldset>
            <legend>Stem provider</legend>
            <BlockStateProvider block={configuration.stem_provider} className="" onChange={handleStemProviderChange} />
        </fieldset>
        <fieldset>
            <legend>Settings</legend>
            <div className="form-group">
                <NumberInput value={configuration.foliage_radius} defaultValue={2} required={false} onChange={handleFoliageRadiusChange}>Foliage radius</NumberInput>
            </div>
        </fieldset>
    </>
}

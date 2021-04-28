import { BlockState } from '../../state/BlockState';
import { ConfInput } from '../../../ui/Input';
import { HUGE_FUNGUS_FEATURE_CONFIG } from './FeatureConfigDefaults';
import { useJsonEffect } from '../../../hooks/form';
import React, { useCallback } from 'react';

export function HugeFungusFeature({ configuration = HUGE_FUNGUS_FEATURE_CONFIG, onChange }) {

    const handleDecorStateChange = useCallback(function (decor_state) {
        onChange({ ...configuration, decor_state });
    }, [configuration, onChange]);
    const handleHatStateChange = useCallback(function (hat_state) {
        onChange({ ...configuration, hat_state });
    }, [configuration, onChange]);
    const handlePlantedChange = useCallback(function (e) {
        const planted = e.target.checked;
        onChange({ ...configuration, planted });
    }, [configuration, onChange]);
    const handleStemStateChange = useCallback(function (stem_state) {
        onChange({ ...configuration, stem_state });
    }, [configuration, onChange]);
    const handleValidBaseBlockChange = useCallback(function (valid_base_block) {
        onChange({ ...configuration, valid_base_block });
    }, [configuration, onChange]);
    useJsonEffect(configuration || HUGE_FUNGUS_FEATURE_CONFIG, configuration, onChange);

    return <div>
        <fieldset>
            <legend>Composition</legend>
            <label htmlFor="stem_state">Stem</label>
            <BlockState block={configuration.stem_state} className="" inputId="stem_state" onChange={handleStemStateChange} />
            <label htmlFor="hat_state">Hat</label>
            <BlockState block={configuration.hat_state} className="" inputId="hat_state" onChange={handleHatStateChange} />
            <label htmlFor="decor_state">Decor</label>
            <BlockState block={configuration.decor_state} className="" inputId="decor_state" onChange={handleDecorStateChange} />
        </fieldset>
        <fieldset>
            <legend>Configuration</legend>
            <label htmlFor="valid_base_block">Valid base block</label>
            <BlockState block={configuration.valid_base_block} className="" inputId="valid_base_block" onChange={handleValidBaseBlockChange} />
            <ConfInput id="planted" checked={configuration.planted} onChange={handlePlantedChange}>Planted</ConfInput>
        </fieldset>
    </div>;
}

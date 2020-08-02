import React, { useCallback, useState } from 'react';
import { HUGE_FUNGUS_FEATURE_CONFIG } from './FeatureDefaults';
import { useJsonEffect } from '../../hooks/form';
import {  ConfInput } from '../../ui/Input';
import { BlockState } from '../state/BlockState';

export function HugeFungusFeature({ configuration = HUGE_FUNGUS_FEATURE_CONFIG, onChange }) {

    const [config, setConfig] = useState(configuration);

    const handleDecorStateChange = useCallback(function (decor_state) {
        setConfig(config => ({ ...config, decor_state }));
    }, []);
    const handleHatStateChange = useCallback(function (hat_state) {
        setConfig(config => ({ ...config, hat_state }));
    }, []);
    const handlePlantedChange = useCallback(function (e) {
        const planted = e.target.checked;
        setConfig(config => ({ ...config, planted }));
    }, []);
    const handleStemStateChange = useCallback(function (stem_state) {
        setConfig(config => ({ ...config, stem_state }));
    }, []);
    const handleValidBaseBlockChange = useCallback(function (valid_base_block) {
        setConfig(config => ({ ...config, valid_base_block }));
    }, []);
    useJsonEffect(config, configuration, onChange);

    return <div>
        <fieldset>
            <legend>Composition</legend>
            <label htmlFor="stem_state">Stem</label>
            <BlockState block={config.stem_state} className="" inputId="stem_state" onChange={handleStemStateChange} />
            <label htmlFor="hat_state">Hat</label>
            <BlockState block={config.hat_state} className="" inputId="hat_state" onChange={handleHatStateChange} />
            <label htmlFor="decor_state">Decor</label>
            <BlockState block={config.decor_state} className="" inputId="decor_state" onChange={handleDecorStateChange} />
        </fieldset>
        <fieldset>
            <legend>Configuration</legend>
            <label htmlFor="valid_base_block">Valid base block</label>
            <BlockState block={config.valid_base_block} className="" inputId="valid_base_block" onChange={handleValidBaseBlockChange} />
            <ConfInput id="planted" checked={config.planted} onChange={handlePlantedChange}>Planted</ConfInput>
        </fieldset>
    </div>;
}

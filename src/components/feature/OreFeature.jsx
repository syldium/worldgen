import React, { useCallback, useState } from 'react';
import { ORE_FEATURE_CONFIG } from "./FeatureDefaults";
import { BlockPredicate } from '../state/BlockPredicate';
import { BlockState } from '../state/BlockState';
import { useJsonEffect } from '../../hooks/form';

export function OreFeatureConfig({configuration = ORE_FEATURE_CONFIG, onChange}) {
    const [config, setConfig] = useState(configuration);

    const handlePredicateChange = useCallback(function(target) {
        setConfig(config => ({ ...config, target }));
    }, []);
    const handleBlockChange = useCallback(function(state) {
        setConfig(config => ({ ...config, state }));
    }, []);
    const handleValueChange = useCallback(function(e) {
        const name = e.target.id;
        const value = parseInt(e.target.value);
        setConfig(config => ({ ...config, [name]: value }));
    }, []);
    useJsonEffect(config, configuration, onChange);

    return <div>
        <fieldset>
            <legend>Target</legend>
            <BlockPredicate target={config.target} onChange={handlePredicateChange} />
        </fieldset>
        <fieldset>
            <legend>State</legend>
            <BlockState block={config.state} onChange={handleBlockChange} />
        </fieldset>
        <fieldset>
            <legend>Settings</legend>
            <div className="form-group">
                <label htmlFor="size">Size</label> : <input type="number" id="size" value={config.size} onChange={handleValueChange} />
            </div>
        </fieldset>
    </div>;
}
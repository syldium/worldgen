import React, { useCallback } from 'react';
import { BlocksList } from '../state/BlockState';
import { RANDOM_PATCH_FEATURE_CONFIG } from './FeatureDefaults';
import { useJsonEffect } from '../../hooks/form';
import { BlockStateProvider } from '../state/BlockStateProvider';
import { NumberInput } from '../../ui/Input';

export function RandomPatchFeature({configuration, onChange}) {

    const config = useJsonEffect(configuration || RANDOM_PATCH_FEATURE_CONFIG, configuration, onChange);
    const handleStateProviderChange = useCallback(function(state_provider) {
        onChange({ ...config, state_provider });
    }, [config, onChange]);
    const handleWhitelistChange = useCallback(function(whitelist) {
        onChange({ ...config, whitelist });
    }, [config, onChange]);
    const handleBlacklistChange = useCallback(function(blacklist) {
        onChange({ ...config, blacklist });
    }, [config, onChange]);
    const handleValueChange = useCallback(function(value) {
        onChange({ ...config, ...value });
    }, [config, onChange]);
    const handleCheckboxChange = useCallback(function(e) {
        const name = e.target.id;
        const value = e.target.checked;
        onChange({ ...config, [name]: value });
    }, [config, onChange]);

    return <div>
        <fieldset>
            <legend>State provider</legend>
            <BlockStateProvider block={config.state_provider} onChange={handleStateProviderChange} />
        </fieldset>
        <fieldset>
            <legend>Whitelist</legend>
            <BlocksList list={config.whitelist} onChange={handleWhitelistChange} />
        </fieldset>
        <fieldset>
            <legend>Blacklist</legend>
            <BlocksList list={config.blacklist} onChange={handleBlacklistChange} />
        </fieldset>
        <fieldset>
            <legend>Settings</legend>
            <div className="form-group form-row">
                <NumberInput id="xspread" value={config.xspread} onChange={handleValueChange}>X spread</NumberInput>
                <NumberInput id="yspread" value={config.yspread} onChange={handleValueChange}>Y spread</NumberInput>
                <NumberInput id="zspread" value={config.zspread} onChange={handleValueChange}>Z spread</NumberInput>
                <NumberInput id="tries" value={config.tries} onChange={handleValueChange}>Tries</NumberInput>
            </div>
            <div className="form-group form-row">
                <div><label htmlFor="need_water">Need water</label> : <input type="checkbox" className="checkbox" id="need_water" checked={config.need_water} onChange={handleCheckboxChange} /></div>
                <div><label htmlFor="project">Project</label> : <input type="checkbox" className="checkbox" id="project" checked={config.project} onChange={handleCheckboxChange} /></div>
                <div><label htmlFor="can_replace">Can replace</label> : <input type="checkbox" className="checkbox" id="can_replace" checked={config.can_replace} onChange={handleCheckboxChange} /></div>
            </div>
        </fieldset>
    </div>;
}
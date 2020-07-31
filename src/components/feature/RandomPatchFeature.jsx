import React, { useCallback, useState } from 'react';
import { BlocksList, BlockStateProvider } from '../state/BlockState';
import { RANDOM_PATCH_FEATURE_CONFIG } from './FeatureDefaults';
import { useJsonEffect } from '../../hooks/form';

export function RandomPatchFeature({configuration = RANDOM_PATCH_FEATURE_CONFIG, onChange}) {

    const [config, setConfig] = useState(configuration);

    const handleStateProviderChange = useCallback(function(state_provider) {
        setConfig(config => ({ ...config, state_provider }));
    }, []);
    const handleWhitelistChange = useCallback(function(whitelist) {
        setConfig(config => ({ ...config, whitelist }));
    }, []);
    const handleBlacklistChange = useCallback(function(blacklist) {
        setConfig(config => ({ ...config, blacklist }));
    }, []);
    const handleValueChange = useCallback(function(e) {
        const name = e.target.id;
        const value = parseInt(e.target.value);
        setConfig(config => ({ ...config, [name]: value }));
    }, []);
    const handleCheckboxChange = useCallback(function(e) {
        const name = e.target.id;
        const value = e.target.checked;
        setConfig(config => ({ ...config, [name]: value }));
    }, []);
    useJsonEffect(config, configuration, onChange);

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
                <div><label htmlFor="xspread">X spread</label> : <input type="number" id="xspread" value={config.xspread} onChange={handleValueChange} /></div>
                <div><label htmlFor="yspread">Y spread</label> : <input type="number" id="yspread" value={config.yspread} onChange={handleValueChange} /></div>
                <div><label htmlFor="zspread">Z spread</label> : <input type="number" id="zspread" value={config.zspread} onChange={handleValueChange} /></div>
                <div><label htmlFor="tries">Tries</label> : <input type="number" id="tries" value={config.tries} onChange={handleValueChange} /></div>
            </div>
            <div className="form-group form-row">
                <div><label htmlFor="need_water">Need water</label> : <input type="checkbox" className="checkbox" id="need_water" checked={config.need_water} onChange={handleCheckboxChange} /></div>
                <div><label htmlFor="project">Project</label> : <input type="checkbox" className="checkbox" id="project" checked={config.project} onChange={handleCheckboxChange} /></div>
                <div><label htmlFor="can_replace">Can replace</label> : <input type="checkbox" className="checkbox" id="can_replace" checked={config.can_replace} onChange={handleCheckboxChange} /></div>
            </div>
        </fieldset>
    </div>;
}
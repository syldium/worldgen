import React, { useCallback } from 'react';
import { ConfInput, NumberInput } from '../../../ui/Input';
import { BlockStateProvider } from '../../state/BlockStateProvider';
import { BlocksList } from '../../state/BlockState';
import { RANDOM_PATCH_FEATURE_CONFIG } from './FeatureConfigDefaults';
import { useJsonEffect } from '../../../hooks/form';

export function RandomPatchFeature({ configuration, onChange }) {

    const config = useJsonEffect(configuration || RANDOM_PATCH_FEATURE_CONFIG, configuration, onChange);
    const handleStateProviderChange = useCallback(function (state_provider) {
        onChange({ ...config, state_provider });
    }, [config, onChange]);
    const handleWhitelistChange = useCallback(function (whitelist) {
        onChange({ ...config, whitelist });
    }, [config, onChange]);
    const handleBlacklistChange = useCallback(function (blacklist) {
        onChange({ ...config, blacklist });
    }, [config, onChange]);
    const handleValueChange = useCallback(function (value) {
        onChange({ ...config, ...value });
    }, [config, onChange]);
    const handleCheckboxChange = useCallback(function (e) {
        onChange({ ...config, [e.target.dataset.name]: e.target.checked });
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
                <NumberInput id="xspread" value={config.xspread} upChange={handleValueChange}>X spread</NumberInput>
                <NumberInput id="yspread" value={config.yspread} upChange={handleValueChange}>Y spread</NumberInput>
                <NumberInput id="zspread" value={config.zspread} upChange={handleValueChange}>Z spread</NumberInput>
                <NumberInput id="tries" value={config.tries} upChange={handleValueChange}>Tries</NumberInput>
            </div>
            <div className="form-group form-row">
                <ConfInput id="need_water" checked={config.need_water} onChange={handleCheckboxChange}>Need water</ConfInput>
                <ConfInput id="project" checked={config.project} onChange={handleCheckboxChange}>Project</ConfInput>
                <ConfInput id="can_replace" checked={config.can_replace} onChange={handleCheckboxChange}>Can replace</ConfInput>
            </div>
        </fieldset>
    </div>;
}
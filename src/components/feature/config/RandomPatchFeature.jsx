import { ConfInput, NumberInput } from '../../../ui/Input';
import {useBlocks} from "../../../hooks/context";
import {useJsonEffect} from '../../../hooks/form';
import React, { useCallback, useMemo } from 'react';

import { BlockStateProvider } from '../../state/BlockStateProvider';
import { BlocksList } from '../../state/BlockState';
import { RANDOM_PATCH_FEATURE_CONFIG } from './FeatureConfigDefaults';
import Select from '../../../ui/Select';

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
    const handleBlockPlacerChange = useCallback(function (option) {
        const block_placer = { type: option.value };
        if (option.value === 'minecraft:column_placer') {
            block_placer.min_size = 1;
            block_placer.extra_size = 2;
        }
        onChange({ ...config, block_placer });
    }, [config, onChange]);
    const handleBlockPlacerValueChange = useCallback(function (value) {
        onChange({ ...config, block_placer: { ...config.block_placer, ...value } });
    }, [config, onChange]);
    const handleValueChange = useCallback(function (value) {
        onChange({ ...config, ...value });
    }, [config, onChange]);
    const handleCheckboxChange = useCallback(function (e) {
        onChange({ ...config, [e.target.dataset.name]: e.target.checked });
    }, [config, onChange]);

    const blocks = useBlocks();
    const filteredBlocks = useMemo(function () {
        return config.block_placer.type.endsWith('double_plant_placer') ?
            blocks.filter(b => b.states.some(state => state.name === 'half') && (b.material === 'plant' || b.name === 'peony'))
            : blocks;
    }, [blocks, config.block_placer.type]);
    const filter = useMemo(function () {
        return config.block_placer.type.endsWith('double_plant_placer') ?
            o => ['minecraft:simple_state_provider', 'minecraft:weighted_state_provider'].includes(o.value)
            : null;
    }, [config.block_placer.type]);

    const blockPlacers = useMemo(function () {
        return [
            { value: 'minecraft:simple_block_placer', label: 'Simple block placer' },
            { value: 'minecraft:double_plant_placer', label: 'Double plant placer' },
            { value: 'minecraft:column_placer', label: 'Column placer' }
        ];
    }, []);

    return <div>
        <fieldset>
            <legend>State provider</legend>
            <BlockStateProvider block={config.state_provider} onChange={handleStateProviderChange} filter={filter} blocks={filteredBlocks} />
            <div className="form-group">
                <label>Block placer</label>
                <Select options={blockPlacers} value={blockPlacers.find(o => o.value === config.block_placer.type)} onChange={handleBlockPlacerChange} />
                {config.block_placer.type === 'minecraft:column_placer' && <div className="form-group form-row">
                    <NumberInput id="min_size" value={config.block_placer.min_size} upChange={handleBlockPlacerValueChange}>Min size</NumberInput>
                    <NumberInput id="extra_size" value={config.block_placer.extra_size} upChange={handleBlockPlacerValueChange}>Extra size</NumberInput>
                </div>}
            </div>
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
                <NumberInput id="xspread" value={config.xspread} defaultValue={7} required={false} upChange={handleValueChange}>X spread</NumberInput>
                <NumberInput id="yspread" value={config.yspread} defaultValue={3} required={false} upChange={handleValueChange}>Y spread</NumberInput>
                <NumberInput id="zspread" value={config.zspread} defaultValue={7} required={false} upChange={handleValueChange}>Z spread</NumberInput>
                <NumberInput id="tries" value={config.tries} defaultValue={128} required={false} upChange={handleValueChange}>Tries</NumberInput>
            </div>
            <div className="form-group form-row">
                <ConfInput id="need_water" checked={config.need_water || false} onChange={handleCheckboxChange}>Need water</ConfInput>
                <ConfInput id="project" checked={typeof config.project === 'boolean' ? config.project : true} onChange={handleCheckboxChange}>Project</ConfInput>
                <ConfInput id="can_replace" checked={config.can_replace || false} onChange={handleCheckboxChange}>Can replace</ConfInput>
            </div>
        </fieldset>
    </div>
}

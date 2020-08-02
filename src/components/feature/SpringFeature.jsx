import React, { useCallback, useState, useMemo } from 'react';
import { HUGE_FUNGUS_FEATURE_CONFIG } from './FeatureDefaults';
import { useJsonEffect, useBlocksOptions } from '../../hooks/form';
import {  ConfInput, NumberInput } from '../../ui/Input';
import { BlocksNamesList } from '../state/BlockState';
import { BlockSelect } from '../state/BlockPredicate';

export function SpringFeature({ configuration = HUGE_FUNGUS_FEATURE_CONFIG, onChange }) {

    const [config, setConfig] = useState(configuration);

    const handlRequiresBlockBelowChange = useCallback(function (e) {
        const requires_block_below = e.target.checked;
        setConfig(config => ({ ...config, requires_block_below }));
    }, []);
    const handleStateChange = useCallback(function (option) {
        setConfig(config => ({ ...config, state: { Name: option.value, Properties: { falling: 'true' } } }));
    }, []);
    const handleValidBlocksChange = useCallback(function (valid_blocks) {
        setConfig(config => ({ ...config, valid_blocks }));
    }, []);
    const handleValueChange = useCallback(function (value) {
        setConfig(config => ({ ...config, ...value }));
    }, []);
    useJsonEffect(config, configuration, onChange);

    const blocks = useBlocksOptions(false);
    const filteredBlocks = useMemo(function () {
        return blocks.filter(b => b.name === 'lava' || b.name === 'water')
            .map(block => ({ value: 'minecraft:' + block.name, label: block.displayName }));
    }, [blocks]);

    return <div>
        <fieldset>
            <legend>Fluid</legend>
            <div className="form-group"><BlockSelect block={config.state.Name} onChange={handleStateChange} options={filteredBlocks} /></div>
        </fieldset>
        <fieldset>
            <legend>Valid blocks</legend>
            <BlocksNamesList list={config.valid_blocks} onChange={handleValidBlocksChange} />
        </fieldset>
        <fieldset>
            <legend>Configuration</legend>
            <NumberInput id="rock_count" value={config.rock_count} upChange={handleValueChange}>Rock count</NumberInput>
            <NumberInput id="hole_count" value={config.hole_count} upChange={handleValueChange}>Hole count</NumberInput>
            <ConfInput id="requires_block_below" checked={config.requires_block_below} onChange={handlRequiresBlockBelowChange}>Requires block below</ConfInput>
        </fieldset>
    </div>;
}

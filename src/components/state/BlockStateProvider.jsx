import React, { useState, useCallback, useMemo } from "react";
import Select from "../../ui/Select";
import { Button } from '../../ui/Button';
import { NumberInput } from '../../ui/Input';
import { useEffect } from "react";
import { useJsonEffect, useCrudPreset, useBlocksOptions } from "../../hooks/form";
import { BlockState } from "./BlockState";

export const BlockStateProvider = React.memo(function({block = { type: 'minecraft:simple_state_provider' }, onChange}) {
    const [provider, setProvider] = useState(block);

    const options = useMemo(function() {
        return [
            { value: 'minecraft:forest_flower_provider', label: 'Forest flower provider' },
            { value: 'minecraft:plain_flower_provider', label: 'Plain flower provider' },
            { value: 'minecraft:simple_state_provider', label: 'Simple state provider' },
            { value: 'minecraft:rotated_block_provider', label: 'Rotated block provider' },
            { value: 'minecraft:weighted_state_provider', label: 'Weighted state provider' }
        ];
    }, []);

    const handleTypeChange = useCallback(function(option) {
        const similarities = ['minecraft:simple_state_provider', 'minecraft:rotated_block_provider'];
        if (similarities.includes(provider.type) && similarities.includes(option.value)) {
            setProvider({ ...provider, type: option.value });
        } else {
            setProvider({ type: option.value });
        }
    }, [provider]);

    const handleSimpleStateChange = useCallback(function(state) {
        setProvider(provider => ({ ...provider, state }));
    }, []);

    const handleWeighestStateChange = useCallback(function(entries) {
        setProvider(provider => ({ ...provider, entries }));
    }, []);

    useJsonEffect(provider, block, onChange);

    const blocks = useBlocksOptions(false);
    const filteredBlocks = useMemo(function () {
        const filtered = provider.type === 'minecraft:rotated_block_provider' ?
            blocks.filter(b => b.states.some(state => state.name === 'axis')) : blocks;
        return filtered.map(block => ({ value: 'minecraft:' + block.name, label: block.displayName }));
    }, [blocks, provider.type]);

    return <div>
        <label>Provider type</label>
        <Select options={options} value={options.find(o => o.value === provider.type)} onChange={handleTypeChange} />
        {(provider.type === 'minecraft:simple_state_provider' || provider.type === 'minecraft:rotated_block_provider') && <BlockState block={provider.state} options={filteredBlocks} onChange={handleSimpleStateChange} />}
        {provider.type === 'minecraft:weighted_state_provider' && <WeightedStateProvider entries={provider.entries} onChange={handleWeighestStateChange} />}
    </div>
});


const WeightedStateProvider = React.memo(function({entries = [], onChange}) {
    const options = useBlocksOptions();

    const [blocks, handleAdd, handleChange, handleRemove] = useCrudPreset(entries, function(blocks) {
        // Get the first non taken block name
        return { data: { Name: (options.find(o => !blocks.some(b => b.data.Name === o.value)) || { value: 'minecraft:stone' }).value } };
    });

    const handleStateChange = useCallback(function(state, i) {
        handleChange({ ...blocks[i], data: state }, blocks[i]);
    }, [blocks, handleChange]);
    const handleWeightChange = useCallback(function(weight, i) {
        if (weight === 1) {
            handleChange({ data: blocks[i].data }, blocks[i]);
        } else {
            handleChange({ weight, data: blocks[i].data }, blocks[i]);
        }
    }, [blocks, handleChange]);

    useEffect(() => {
        if (blocks !== entries) {
            onChange(blocks);
        }
    }, [blocks, entries, onChange]);

    return <div className="form-group">
        {blocks.map((block, i) => {
            const filteredOptions = options.filter(o => o.value === block.data.Name || !blocks.some(d => d.data.Name === o.value));
            return <BlockState block={block.data} options={filteredOptions} key={JSON.stringify(block)} onChange={state => handleStateChange(state, i)}>
                <NumberInput id="weight" value={block.weight || 1} min="1" onChange={weight => handleWeightChange(weight, i)} className="mlm">Weight</NumberInput>
                <Button cat="danger mlm" onClick={(e) => handleRemove(e, i)}>Remove</Button>
            </BlockState>
        })}
        <Button onClick={handleAdd}>Add block</Button>
    </div>;
});
import {defaultNamespace} from "../../utils/data";
import {useBlocks} from "../../hooks/context";
import { useBlocksOptions, useCrudPreset } from "../../hooks/form";
import React, { useCallback, useMemo } from "react";

import { BlockState } from "./BlockState";
import { Button } from '../../ui/Button';
import { NumberInput } from '../../ui/Input';
import { useEffect } from "react";
import Select from "../../ui/Select";

export const BlockStateProvider = React.memo(function({block = { type: 'minecraft:simple_state_provider' }, filter, onChange, blocks}) {
    const options = useMemo(function() {
        const options = [
            { value: 'minecraft:forest_flower_provider', label: 'Forest flower provider' },
            { value: 'minecraft:plain_flower_provider', label: 'Plain flower provider' },
            { value: 'minecraft:simple_state_provider', label: 'Simple state provider' },
            { value: 'minecraft:rotated_block_provider', label: 'Rotated block provider' },
            { value: 'minecraft:weighted_state_provider', label: 'Weighted state provider' }
        ];
        return typeof filter === 'function' ? options.filter(filter) : options;
    }, [filter]);

    const handleTypeChange = useCallback(function(option) {
        const similarities = ['minecraft:simple_state_provider', 'minecraft:rotated_block_provider'];
        if (similarities.includes(block.type) && similarities.includes(option.value)) {
            onChange({ ...block, type: option.value }, block);
        } else {
            onChange({ type: option.value }, block);
        }
    }, [block, onChange]);

    const handleSimpleStateChange = useCallback(function(state) {
        onChange({ ...block, state }, block);
    }, [block, onChange]);

    const handleWeighestStateChange = useCallback(function(entries) {
        onChange({ ...block, entries }, block);
    }, [block, onChange]);

    const defaultOptions = useBlocks();
    blocks = blocks || defaultOptions;
    const filteredBlocks = useMemo(function () {
        const filtered = block.type === 'minecraft:rotated_block_provider' ?
            blocks.filter(b => b.states && b.states.some(state => state.name === 'axis')) : blocks;
        return filtered.map(block => ({ value: defaultNamespace(block.name), label: block.displayName }));
    }, [blocks, block.type]);

    return <div>
        <label>Provider type</label>
        <Select options={options} value={options.find(o => o.value === block.type)} onChange={handleTypeChange} />
        {(block.type === 'minecraft:simple_state_provider' || block.type === 'minecraft:rotated_block_provider') && <BlockState block={block.state} options={filteredBlocks} onChange={handleSimpleStateChange} />}
        {block.type === 'minecraft:weighted_state_provider' && <WeightedStateProvider entries={block.entries} options={filteredBlocks} onChange={handleWeighestStateChange} />}
    </div>
});


const WeightedStateProvider = React.memo(function({entries = [], onChange, options}) {
    const defaultOptions = useBlocksOptions();
    options = options || defaultOptions;

    const [blocks, handleAdd, handleChange, handleRemove] = useCrudPreset(onChange, entries, function(blocks) {
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
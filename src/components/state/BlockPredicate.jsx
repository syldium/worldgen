import {DataContext} from "../../context/DataContext";
import {isValidModKey} from "../../utils/data";
import {useBlocksOptions} from "../../hooks/form";
import React, {useCallback, useContext, useMemo} from "react";

import { BlockState } from "./BlockState";
import { NumberInput } from "../../ui/Input";
import { TAGS_OPTIONS } from "./Tags";
import Select, {CreatableSelect} from "../../ui/Select";

export const BlockPredicate = React.memo(function({target, onChange}) {
    const options = useMemo(function() {
        return [
            { value: 'minecraft:always_true', label: 'Always true' },
            { value: 'minecraft:block_match', label: 'Block match' },
            { value: 'minecraft:blockstate_match', label: 'Block state match' },
            { value: 'minecraft:random_block_match', label: 'Random block match' },
            { value: 'minecraft:random_blockstate_match', label: 'Random block state match' },
            { value: 'minecraft:tag_match', label: 'Tag match' }
        ];
    }, []);

    const handleTypeChange = useCallback(function(option) {
        onChange({ predicate_type: option.value });
    }, [onChange]);
    const handleBlockChange = useCallback(function(option) {
        onChange({ ...target, block: option.value });
    }, [target, onChange]);
    const handleBlockStateChange = useCallback(function(block_state) {
        onChange({ ...target, block_state });
    }, [target, onChange]);
    const handleTagChange = useCallback(function(option) {
        onChange({ ...target, tag: option.value });
    }, [target, onChange]);
    const handleChange = useCallback(function(content) {
        onChange({ ...target, ...content });
    }, [target, onChange]);

    const type = target.predicate_type;

    return <div>
        <label>Predicate type</label>
        <Select options={options} value={options.find(o => o.value === type)} onChange={handleTypeChange} />
        {type === 'minecraft:block_match' && <BlockSelect block={target.block} onChange={handleBlockChange} />}
        {type === 'minecraft:blockstate_match' && <BlockState block={target.block_state} onChange={handleBlockStateChange} />}
        {(type === 'minecraft:random_block_match' || type === 'minecraft:random_blockstate_match') &&
            <RandomBlockMatch block={target.block} probability={target.probability} onChange={handleChange} type={type} />
        }
        {type === 'minecraft:tag_match' && <Select options={TAGS_OPTIONS} value={TAGS_OPTIONS.find(t => t.value === target.tag)} onChange={handleTagChange} />}
    </div>;
});

const RandomBlockMatch = React.memo(function({block, onChange, type, probability}) {
    const handleBlockChange = useCallback(function(option) {
        onChange({ block: option.value });
    }, [onChange]);
    const handleBlockStateChange = useCallback(function(block_state) {
        onChange({ block_state });
    }, [onChange]);

    return <div className="form-group form-row">
        <div style={{ flexGrow: 1 }}>
        {type === 'minecraft:random_block_match' && <BlockSelect block={block} onChange={handleBlockChange} />}
        {type === 'minecraft:random_blockstate_match' && <BlockState block={block} onChange={handleBlockStateChange} />}
        </div>
        <NumberInput id="probability" value={probability} defaultValue="0.1"
            step="0.01" min="0" max="1" className="mlm" upChange={onChange}>
                Probability
        </NumberInput>
    </div>
});

export const BlockSelect = React.memo(function({block, inputId, onChange, options}) {
    const blocks = useBlocksOptions(options);
    const context = useContext(DataContext);

    const handleValidNewOption = useCallback(function (string) {
        return isValidModKey(string) && !blocks.some(o => o.value === string);
    }, [blocks]);
    const handleOptionCreation = useCallback(function (string) {
        context.custom.addBlock(string);
        onChange({ value: string, label: string });
    }, [context.custom, onChange]);

    return <CreatableSelect isValidNewOption={handleValidNewOption} onCreateOption={handleOptionCreation} options={blocks} value={blocks.find(b => b.value === block)} onChange={onChange} inputId={inputId} />;
});

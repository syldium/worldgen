import React, { useState, useCallback, useMemo, useEffect, useContext } from "react";
import Select from "../../ui/Select";
import { TAGS_OPTIONS } from "./Tags";
import { BlockState } from "./BlockState";
import { NumberInput } from "../../ui/Input";
import { DataContext } from "../../context/DataContext";

export const BlockPredicate = React.memo(function({target, onChange}) {
    const [predicate, setPredicate] = useState(target);

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
        setPredicate({ predicate_type: option.value });
    }, []);
    const handleBlockChange = useCallback(function(option) {
        setPredicate(predicate => ({ ...predicate, block: option.value }));
    }, []);
    const handleBlockStateChange = useCallback(function(block_state) {
        setPredicate(predicate => ({ ...predicate, block_state }));
    }, []);
    const handleTagChange = useCallback(function(option) {
        setPredicate(predicate => ({ ...predicate, tag: option.value }));
    }, []);
    const handleChange = useCallback(function(content) {
        setPredicate(predicate => ({ ...predicate, ...content }));
    }, []);
    useEffect(() => {
        if (predicate !== target) {
            onChange(predicate, target);
        }
    }, [onChange, predicate, target]);

    const type = predicate.predicate_type;

    return <div>
        <label>Predicate type</label>
        <Select options={options} value={options.find(o => o.value === predicate.predicate_type)} onChange={handleTypeChange} />
        {type === 'minecraft:block_match' && <BlockSelect block={predicate.block} onChange={handleBlockChange} />}
        {type === 'minecraft:blockstate_match' && <BlockState block={predicate.block_state} onChange={handleBlockStateChange} />}
        {(type === 'minecraft:random_block_match' || type === 'minecraft:random_blockstate_match') &&
            <RandomBlockMatch block={predicate.block} probability={predicate.probability} onChange={handleChange} type={type} />
        }
        {type === 'minecraft:tag_match' && <Select options={TAGS_OPTIONS} value={TAGS_OPTIONS.find(t => t.value === predicate.tag)} onChange={handleTagChange} />}
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
    const context = useContext(DataContext);
    const blocks = useMemo(function () {
        if (typeof options === 'undefined') {
            return context.vanilla.blocks.map(block => ({ value: 'minecraft:' + block.name, label: block.displayName }));
        }
        return options;
    }, [context.vanilla.blocks, options]);
    return <Select options={blocks} value={blocks.find(b => b.value === block)} onChange={onChange} inputId={inputId} />;
});

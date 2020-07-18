import React, { useState, useCallback, useMemo, useContext, useEffect } from "react";
import Select from "react-select";
import { DataContext } from "../../context/DataContext";
import { TAGS_OPTIONS } from "../feature/FeatureDefaults";

export const BlockPredicate = React.memo(function({target, onChange}) {
    const [predicate, setPredicate] = useState(target);

    const options = useMemo(function() {
        return [
            { value: 'minecraft:block_match', label: 'Block match' },
            { value: 'minecraft:tag_match', label: 'Tag match' }
        ];
    }, []);

    const handleTypeChange = useCallback(function(option) {
        setPredicate({ predicate_type: option.value });
    }, []);
    const handleBlockChange = useCallback(function(option) {
        setPredicate(predicate => ({ ...predicate, block: option.value }));
    }, []);
    const handleTagChange = useCallback(function(option) {
        setPredicate(predicate => ({ ...predicate, tag: option.value }));
    }, []);
    useEffect(() => onChange(predicate), [onChange, predicate]);

    const context = useContext(DataContext);
    const blocks = useMemo(function() {
        return context.vanilla.blocks.map(block => ({ value: 'minecraft:' + block.name, label: block.displayName }));
    }, [context.vanilla.blocks]);

    return <div>
        <label>Predicate type</label>
        <Select options={options} value={options.find(o => o.value === predicate.predicate_type)} onChange={handleTypeChange} />
        {(predicate.predicate_type === 'minecraft:block_match') && <Select options={blocks} value={blocks.find(b => b.value === predicate.block)} onChange={handleBlockChange} />}
        {(predicate.predicate_type === 'minecraft:tag_match') && <Select options={TAGS_OPTIONS} value={TAGS_OPTIONS.find(t => t.value.trim() === predicate.tag.trim())} onChange={handleTagChange} />}
    </div>;
});
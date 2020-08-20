import { BlockState, BlocksList } from "../state/BlockState";
import { CRUD, useCrudPreset, useCrudState, useJsonEffect } from "../../hooks/form";
import { PROCESSORS_OPTIONS, PROCESSOR_RULE_DEFAULTS } from './ProcessorDefaults';
import React, { useCallback, useContext } from "react";

import { BlockPredicate } from "../state/BlockPredicate";
import { Button } from "../../ui/Button";
import { DataContext } from "../../context/DataContext";
import { JsonViewer } from "../../ui/JsonViewer";
import { NamespacedKey } from "../NamespacedKey";
import { NumberInput } from "../../ui/Input";
import { PositionPredicate } from './PositionPredicate';
import Select from "../../ui/Select";

export function ProcessorList({ data = { processors: [] }, onSave }) {

    const [processors, dispatch] = useCrudState(data.processors, function (processors) {
        if (processors.length < 1) {
            return { processor_type: 'minecraft:rule' };
        }
        // Get the first non taken processor
        return { processor_type: (PROCESSORS_OPTIONS.filter(o => !processors.some(d => d.processor_type === o.value))[0] || { value: 'minecraft:rule' }).value };
    });

    const handleAdd = useCallback(function (e) {
        e.preventDefault();
        let processor_type = 'minecraft:rule';
        if (processors.length > 0) {
            processor_type = (PROCESSORS_OPTIONS.filter(o => !processors.some(d => d.processor_type === o.value))[0] || { value: 'minecraft:rule' }).value;
        }
        dispatch({ type: CRUD.ADD, payload: { processor_type } });
    }, [dispatch, processors]);
    const handleChange = useCallback(function (processor, previous) {
        dispatch({ type: CRUD.UPDATE, target: previous, payload: processor });
    }, [dispatch]);
    const handleRemove = useCallback(function (e, processor) {
        e.preventDefault();
        dispatch({ type: CRUD.REMOVE, payload: processor });
    }, [dispatch]);

    const handleVanillaSelect = useCallback(function (processor_list) {
        dispatch({ type: CRUD.REPLACE, payload: processor_list.processors });
    }, [dispatch]);

    const handleSubmit = useCallback(function (e) {
        e.preventDefault();
        onSave({
            processors,
            ...Object.fromEntries(new FormData(e.target))
        }, data);
    }, [data, onSave, processors]);

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="concretify" type="processors" value={data.key} expectBreakage={typeof data.key !== 'undefined'} defaultReplace={true} onSelectLoad={handleVanillaSelect}>
            processors list
            <JsonViewer data={{ processors }} />
            {(processors.length > 0 && PROCESSORS_OPTIONS.length > processors.length) && <Button onClick={handleAdd}>Add processor</Button>}
        </NamespacedKey>
        <div className="mtm mbm">
            {processors.map(processor => {
                const options = PROCESSORS_OPTIONS.filter(o => processor.processor_type === o.value || !processors.some(p => p.processor_type === o.value));
                return <StructureProcessor onChange={handleChange} processor={processor} options={options} key={JSON.stringify(processor)}>
                    <Button cat="danger mls" onClick={e => handleRemove(e, processor)}>Remove</Button>
                </StructureProcessor>
            })}
            {processors.length < 1 && <p className="pts mll text-muted">To begin, <a href="#add-processor" onClick={handleAdd} style={{ color: 'inherit' }}>add a processor</a>...</p>}
        </div>
        {processors.length > 0 && <Button type="submit">Save</Button>}
    </form>
}

const StructureProcessor = React.memo(function ({ children, processor = { processor_type: 'minecraft:block_age' }, onChange, options }) {

    const handleSelectChange = useCallback(function (option) {
        onChange({ processor_type: option.value }, processor);
    }, [processor, onChange]);
    const handleChange = useCallback(function (config) {
        onChange({ ...processor, ...config }, processor);
    }, [processor, onChange]);

    const blocks = useContext(DataContext).vanilla.blocks;
    const handleAddBlockClick = useCallback(function (e) {
        e.preventDefault();
        onChange({ ...processor, blocks: [...(processor.blocks || []), { Name: 'minecraft:' + (blocks.find(o => !(processor.blocks || []).some(b => b.Name.substr(10) === o.name)) || { name: 'stone' }).name }] }, processor);
    }, [blocks, onChange, processor]);
    const handleAddProcessorClick = useCallback(function (e) {
        e.preventDefault();
        onChange({ ...processor, rules: [...(processor.rules || []), PROCESSOR_RULE_DEFAULTS] }, processor);
    }, [onChange, processor]);

    const type = processor.processor_type;
    const CustomTag = ['minecraft:jigsaw_replacement', 'minecraft:nop', 'minecraft:blackstone_replace', 'minecraft:lava_submerged_block'].includes(type) ? ({ children }) => <li style={{ marginTop: '1.5rem', marginLeft: '1.6rem' }}>{children}</li> : 'fieldset';
    return <CustomTag>
        <legend style={{ fontWeight: 'normal', fontSize: '1rem' }}>
            <div className="inbl" style={{ width: '28ch' }}><Select options={options} value={options.find(o => type === o.value)} onChange={handleSelectChange} /></div>
            {type === 'minecraft:block_ignore' && <Button cat="primary mls" onClick={handleAddBlockClick}>Add block</Button>}
            {type === 'minecraft:rule' && <Button cat="primary mls" onClick={handleAddProcessorClick}>Add processor</Button>}
            {children}
        </legend>
        {type === 'minecraft:block_age' && <BlockAgeProcessor onChange={handleChange} processor={processor} />}
        {type === 'minecraft:block_ignore' && <BlockIgnoreProcessor onChange={handleChange} processor={processor} />}
        {type === 'minecraft:block_rot' && <BlockRotProcessor onChange={handleChange} processor={processor} />}
        {type === 'minecraft:gravity' && <BlockGravityProcessor onChange={handleChange} processor={processor} />}
        {type === 'minecraft:rule' && <RuleProcessor onChange={handleChange} processor={processor} />}
    </CustomTag>;
});

// BlackstoneReplacementProcessor: empty config

const BlockAgeProcessor = React.memo(function ({ onChange, processor }) {
    return <NumberInput id="mossiness" value={processor.mossiness} defaultValue={0.05} step={0.05} upChange={onChange}>Mossiness</NumberInput>
});

const BlockIgnoreProcessor = React.memo(function ({ onChange, processor }) {
    const handleChange = useCallback(blocks => onChange({ blocks }), [onChange])

    return <BlocksList addButton={false} list={processor.blocks} onChange={handleChange} />
});

const BlockRotProcessor = React.memo(function ({ onChange, processor }) {
    return <NumberInput id="integrity" value={processor.integrity} defaultValue={0.05} step={0.05} upChange={onChange}>Integrity</NumberInput>
});

const BlockGravityProcessor = React.memo(function ({ onChange, processor }) {
    // @todo heightmap
    return <NumberInput id="offset" value={processor.offset} upChange={onChange}>Offset</NumberInput>
});

// JigsawReplacementProcessor: empty config
// LavaSubmergedBlockProcessor: empty config
// NopProcessor: empty config

const RuleProcessor = React.memo(function ({ onChange, processor }) {
    const [rules, , handleChange, handleRemove] = useCrudPreset(rules => onChange({ rules }), processor.rules, PROCESSOR_RULE_DEFAULTS);

    return <div>
        {rules.map((rule, index) =>
            <ProcessorRule rule={rule} key={index} onChange={handleChange}>
                <Button cat="danger" onClick={e => handleRemove(e, index)}>Remove</Button>
            </ProcessorRule>)}
    </div>
});

const ProcessorRule = React.memo(function ({ children, onChange, rule }) {
    rule = useJsonEffect(rule || PROCESSOR_RULE_DEFAULTS, rule, onChange);

    const handleInputPredicate = useCallback(function (input_predicate) {
        onChange({ ...rule, input_predicate }, rule);
    }, [onChange, rule]);
    const handleLocationPredicate = useCallback(function (location_predicate) {
        onChange({ ...rule, location_predicate }, rule);
    }, [onChange, rule]);
    const handlePositionPredicate = useCallback(function (position_predicate) {
        onChange({ ...rule, position_predicate }, rule);
    }, [onChange, rule]);
    const handleOutputState = useCallback(function (output_state) {
        onChange({ ...rule, output_state }, rule);
    }, [onChange, rule]);

    return <fieldset>
        <legend>{children}</legend>
        <fieldset>
            <legend>Input predicate</legend>
            <BlockPredicate target={rule.input_predicate} onChange={handleInputPredicate} />
        </fieldset>
        <div className="grid-2-small-1 has-gutter mbm">
            <fieldset>
                <legend>Location predicate</legend>
                <BlockPredicate target={rule.location_predicate} onChange={handleLocationPredicate} />
            </fieldset>
            <fieldset>
                <legend>Position predicate</legend>
                <PositionPredicate predicate={rule.position_predicate} className="" onChange={handlePositionPredicate} />
            </fieldset>
        </div>
        <fieldset>
            <legend>Output state</legend>
            <BlockState block={rule.output_state} onChange={handleOutputState} />
        </fieldset>
    </fieldset>
});

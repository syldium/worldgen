import React, { useCallback, useContext, useEffect, useMemo } from "react";
import Select from "../../ui/Select";
import { BlockSelect } from "./BlockPredicate";
import { DataContext } from "../../context/DataContext";
import { Button } from '../../ui/Button';
import { getStateValue } from "../../utils/data";
import { useCrudPreset, useBlocksOptions } from "../../hooks/form";
import { ConfInput, NumberInput } from "../../ui/Input";

export const BlockState = React.memo(function ({ block = {}, children, className = 'form-group', inputId, name, onChange, options }) {
    const context = useContext(DataContext);

    const handleTypeChange = useCallback(function (option) {
        const Name = option.value;
        const Properties = {};
        (context.vanilla.blocks.find(b => 'minecraft:' + b.name === Name) || { states: [] }).states.forEach(state => {
            Properties[state.name] = getStateValue(state);
        })
        delete block.Properties;
        if (Object.keys(Properties).length > 0) {
            onChange({ ...block, Name, Properties });
        } else {
            onChange({ ...block, Name });
        }
    }, [block, context.vanilla.blocks, onChange]);
    const handlePropertiesChange = useCallback(function (properties) {
        onChange({ ...block, Properties: { ...block.Properties, ...properties } });
    }, [block, onChange]);

    const blocks = useMemo(function () {
        if (typeof options === 'undefined') {
            return context.vanilla.blocks.map(block => ({ value: 'minecraft:' + block.name, label: block.displayName }));
        }
        return options;
    }, [context.vanilla.blocks, options]);

    const selected = useMemo(function () {
        return blocks.find(o => o.value === block.Name);
    }, [blocks, block.Name]);

    return <div className={className}>
        <div className="form-row">
            <div style={{ flexGrow: 1 }}><Select options={blocks} value={selected} name={name} onChange={handleTypeChange} inputId={inputId} /></div>
            {children}
        </div>
        <BlockStateProperties block={block.Name} properties={block.Properties} onChange={handlePropertiesChange} />
    </div>;
});

export const BlocksList = React.memo(function ({ list, onChange }) {
    const options = useBlocksOptions();

    const [blocks, handleAdd, handleChange, handleRemove] = useCrudPreset(list, function (blocks) {
        // Get the first non taken block name
        return { Name: (options.find(o => !blocks.some(b => b.Name === o.value)) || { value: 'minecraft:stone' }).value };
    });

    const handleStateChange = useCallback(function (state, i) {
        handleChange(state, blocks[i]);
    }, [blocks, handleChange]);

    useEffect(() => {
        if (blocks !== list) {
            onChange(blocks);
        }
    }, [blocks, list, onChange]);

    return <div className="form-group">
        {blocks.map((block, i) => {
            const filteredOptions = options.filter(o => o.value === block.Name || !blocks.some(d => d.Name === o.value));
            return <BlockState block={block} options={filteredOptions} key={block.Name} onChange={state => handleStateChange(state, i)}>
                <Button cat="danger mlm" onClick={(e) => handleRemove(e, i)}>Remove</Button>
            </BlockState>
        })}
        <Button onClick={handleAdd}>Add block</Button>
    </div>;
});

export const BlocksNamesList = React.memo(function ({ list, onChange }) {
    const options = useBlocksOptions();

    const [blocks, handleAdd, handleChange, handleRemove] = useCrudPreset(list, function (blocks) {
        // Get the first non taken block name
        return (options.find(o => !blocks.some(b => b === o.value)) || { value: 'minecraft:stone' }).value;
    });

    useEffect(() => {
        if (blocks !== list) {
            onChange(blocks);
        }
    }, [blocks, list, onChange]);

    return <div className="form-group">
        {blocks.map((block, i) => {
            const filteredOptions = options.filter(o => o.value === block || !blocks.some(d => d === o.value));
            return <div className="form-group form-row" key={block}>
                <div style={{ flexGrow: 1 }}><BlockSelect block={block} options={filteredOptions} onChange={o => handleChange(o.value, block)} /></div>
                <Button cat="danger mlm" onClick={(e) => handleRemove(e, i)}>Remove</Button>
            </div>
        })}
        <Button cat="primary mts" onClick={handleAdd}>Add block</Button>
    </div>;
});

function BlockStateProperties({ block, children, onChange, properties = {} }) {
    const states = (useContext(DataContext).vanilla.blocks.find(b => 'minecraft:' + b.name === block) || { states: [] }).states;

    const handlePropertyChange = useCallback(function (option) {
        onChange({ ...properties, [option.name]: option.value });
    }, [onChange, properties]);
    const handleCheckboxChange = useCallback(function (e) {
        const value = e.target.checked.toString();
        onChange({ ...properties, [e.target.dataset.name]: value });
    }, [onChange, properties]);

    const selects = [];
    states.forEach(possible => {
        switch (possible.type) {
            case 'bool':
                selects.push(
                    <ConfInput key={possible.name} id={possible.name}
                        checked={properties[possible.name] === 'true'}
                        onChange={handleCheckboxChange}>
                        {possible.name}
                    </ConfInput>
                );
                break;
            case 'int':
                selects.push(
                    <NumberInput key={possible.name} id={possible.name}
                        value={properties[possible.name] || 0} upChange={onChange}
                        min="0" max={possible.num_values - 1}>
                        {possible.name}
                    </NumberInput>
                );
                break;
            default:
                const options = possible.values.map(value => ({ value, name: possible.name, label: value }));
                const defaultValue = options.find(o => o.value === properties[possible.name]) || options[0];
                selects.push(<div key={possible.name}>
                    <label>{possible.name}</label> : <div className="inbl">
                        <Select options={options} value={defaultValue} onChange={handlePropertyChange} />
                    </div>
                </div>);
        }
    });
    return <div className="form-group form-row">
        {selects}{children}
    </div>;
}
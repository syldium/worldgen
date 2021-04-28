import { ConfInput, NumberInput } from "../../ui/Input";
import { getStateValue, isValidModKey } from "../../utils/data";
import { useBlocksOptions, useCrudPreset } from "../../hooks/form";
import React, { useCallback, useContext } from "react";
import Select, { CreatableSelect } from "../../ui/Select";


import { BlockSelect } from "./BlockPredicate";
import { Button } from '../../ui/Button';
import { DataContext } from "../../context/DataContext";

export const BlockState = React.memo(function ({ block = {}, children, className = 'form-group', inputId, name, onChange, options }) {
    const context = useContext(DataContext);

    const blocks = useBlocksOptions(options);
    const handleTypeChange = useCallback(function (option) {
        const Name = option.value;
        const Properties = {};
        (context.vanilla.blocks.find(b => 'minecraft:' + b.name === Name) || { states: [] }).states.forEach(state => {
            Properties[state.name] = getStateValue(state, block.Properties);
        })
        delete block.Properties;
        if (Object.keys(Properties).length > 0) {
            onChange({ ...block, Name, Properties }, block);
        } else {
            onChange({ ...block, Name }, block);
        }
    }, [block, context.vanilla.blocks, onChange]);
    const handleValidNewOption = useCallback(function (string) {
        return isValidModKey(string) && !blocks.some(o => o.value === string);
    }, [blocks]);
    const handleOptionCreation = useCallback(function (string) {
        context.custom.addBlock(string);
        onChange({ ...block, Name: string }, block);
    }, [block, context.custom, onChange]);
    const handlePropertiesChange = useCallback(function (properties) {
        onChange({ ...block, Properties: { ...block.Properties, ...properties } }, block);
    }, [block, onChange]);


    return <div className={className}>
        <div className="form-row">
            <div style={{ flexGrow: 1 }}><CreatableSelect isValidNewOption={handleValidNewOption} onCreateOption={handleOptionCreation} options={blocks} value={blocks.find(o => o.value === block.Name) || null} name={name} onChange={handleTypeChange} inputId={inputId} /></div>
            {children}
        </div>
        <BlockStateProperties block={block.Name} properties={block.Properties} onChange={handlePropertiesChange} />
    </div>;
});

export const BlocksList = React.memo(function ({ addButton = true, list, onChange }) {
    const options = useBlocksOptions();

    const [blocks, handleAdd, handleChange, handleRemove] = useCrudPreset(onChange, list, function (blocks) {
        // Get the first non taken block name
        return { Name: (options.find(o => !blocks.some(b => b.Name === o.value)) || { value: 'minecraft:stone' }).value };
    });

    return <div className="form-group">
        {blocks.map((block, i) => {
            const filteredOptions = options.filter(o => o.value === block.Name || !blocks.some(d => d.Name === o.value));
            return <BlockState block={block} options={filteredOptions} key={block.Name} onChange={handleChange}>
                <Button cat="danger mlm" onClick={e => handleRemove(e, i)}>Remove</Button>
            </BlockState>
        })}
        {addButton && <Button onClick={handleAdd}>Add block</Button>}
    </div>;
});

export const BlocksNamesList = React.memo(function ({ list, onChange }) {
    const options = useBlocksOptions();

    const [blocks, handleAdd, handleChange, handleRemove] = useCrudPreset(onChange, list, function (blocks) {
        // Get the first non taken block name
        return (options.find(o => !blocks.some(b => b === o.value)) || { value: 'minecraft:stone' }).value;
    });

    return <div className="form-group">
        {blocks.map((block, i) => {
            const filteredOptions = options.filter(o => o.value === block || !blocks.some(d => d === o.value));
            return <div className="form-group form-row" key={block}>
                <div style={{ flexGrow: 1 }}><BlockSelect block={block} options={filteredOptions} onChange={o => handleChange(o.value, block)} /></div>
                <Button cat="danger mlm" onClick={e => handleRemove(e, i)}>Remove</Button>
            </div>
        })}
        <Button cat="primary mts" onClick={handleAdd}>Add block</Button>
    </div>;
});

function BlockStateProperties({ block, children, onChange, properties = {} }) {
    const states = (useContext(DataContext).vanilla.blocks.find(b => 'minecraft:' + b.name === block) || { states: [] }).states;

    const handlePropertyChange = useCallback(function (option) {
        onChange({ ...properties, [option.name]: option.value.toLowerCase() });
    }, [onChange, properties]);
    const handleCheckboxChange = useCallback(function (e) {
        const value = e.target.checked.toString();
        onChange({ ...properties, [e.target.dataset.name]: value });
    }, [onChange, properties]);
    const handleNumberChange = useCallback(function (value) {
        const key = Object.keys(value)[0];
        onChange({ ...properties, [key]: value[key].toString() });
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
                let min = possible.name === 'distance' ? 1 : 0;
                let max = possible.num_values;
                if (possible.name !== 'distance') {
                    max -= 1;
                }
                selects.push(
                    <NumberInput key={possible.name} id={possible.name}
                        value={properties[possible.name] || 0} upChange={handleNumberChange}
                        min={min} max={max}>
                        {possible.name}
                    </NumberInput>
                );
                break;
            default:
                const options = possible.values.map(value => ({ value, name: possible.name, label: value }));
                const defaultValue = options.find(o => o.value.toLowerCase() === properties[possible.name]) || options[0];
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

import React, { useState, useCallback, useContext, useMemo } from "react";
import Select from "react-select";
import { DataContext } from "../../context/DataContext";
import { Button } from '../../ui/Button';
import { getStateValue } from "../../utils/data";
import { useEffect } from "react";
import { CRUD, useCrud } from "../../hooks/form";

export const BlockStateProvider = React.memo(function({block = { type: 'minecraft:simple_state_provider' }, onChange}) {
    const [provider, setProvider] = useState(block);

    const options = useMemo(function() {
        return [
            { value: 'minecraft:simple_state_provider', label: 'Simple state provider' },
            { value: 'minecraft:weighted_state_provider', label: 'Weighted state provider' }
        ];
    }, []);

    const handleTypeChange = useCallback(function(option) {
        setProvider({ type: option.value });
    }, []);

    const handleSimpleStateChange = useCallback(function(state) {
        setProvider(provider => ({ ...provider, state }));
    }, []);

    const handleWeighestStateChange = useCallback(function(entries) {
        setProvider(provider => ({ ...provider, entries }));
    }, []);

    useEffect(() => onChange(provider), [onChange, provider]);

    return <div>
        <label>Type</label>
        <Select options={options} value={options.find(o => o.value === provider.type)} onChange={handleTypeChange} />
        {(provider.type === 'minecraft:simple_state_provider' || provider.type === 'minecraft:rotated_block_provider') && <BlockState block={provider.state} onChange={handleSimpleStateChange} />}
        {provider.type === 'minecraft:weighted_state_provider' && <WeightedStateProvider entries={(provider.entries || []).map(entry => entry.data)} onChange={handleWeighestStateChange} />}
    </div>
});

export const BlockState = React.memo(function({block = {}, children, name, onChange}) {
    const context = useContext(DataContext);
    const [data, setData] = useState(block);

    const handleTypeChange = useCallback(function(option) {
        const Name = option.value;
        const Properties = {};
        (context.vanilla.blocks.find(b => 'minecraft:' + b.name === Name) || { states: [] }).states.forEach(state => {
            Properties[state.name] = getStateValue(state);
        })
        if (Object.keys(Properties).length > 0) {
            setData({ Name, Properties });
        } else {
            setData({ Name });
        }
    }, [context.vanilla.blocks]);
    const handlePropertiesChange = useCallback(function(Properties) {
        setData(data => ({ ...data, Properties }))
    }, []);
    useEffect(() => {
        if (data !== block) {
            onChange(data, block);
        }
    }, [onChange, data, block]);

    const options = useMemo(function() {
        return context.vanilla.blocks.map(block => ({ value: 'minecraft:' + block.name, label: block.displayName }));
    }, [context.vanilla.blocks]);

    const selected = useMemo(function() {
        return options.find(o => o.value === data.Name);
    }, [options, data.Name]);

    return <div className="form-group">
        <Select options={options} value={selected} name={name} onChange={handleTypeChange} />
        <BlockStateProperties block={data.Name} Properties={block.Properties} onChange={handlePropertiesChange}>{children}</BlockStateProperties>
    </div>;
});

export const BlocksList = React.memo(function({list, onChange}) {
    const [blocks, dispatch] = useCrud(list);

    const handleAddClick = useCallback(function(e) {
        e.preventDefault();
        dispatch({ type: CRUD.ADD, payload: { Name: 'minecraft:stone', Properties: {} } });
    }, [dispatch]);
    const handleChange = useCallback(function(state, previous) {
        dispatch({ type: CRUD.UPDATE, target: previous, payload: state });
    }, [dispatch]);
    const handleDeleteClick = useCallback(function(e, index) {
        e.preventDefault();
        dispatch({ type: CRUD.REMOVE, payload: blocks[index] });
    }, [blocks, dispatch]);

    useEffect(() => onChange(blocks), [blocks, onChange]);

    const values = [];
    blocks.forEach((entry, i) => {
        const key = i;
        values.push(<BlockState block={entry} key={key} onChange={handleChange}><Button cat="danger" onClick={(e) => handleDeleteClick(e, i)}>Delete</Button></BlockState>);
    });

    return <div className="form-group">{values}<Button onClick={handleAddClick}>Add</Button></div>;
});

const WeightedStateProvider = React.memo(function({entries = [], onChange}) {

    const handleChange = useCallback(function(blocks) {
        onChange(blocks.map(data => ({ data })));
    }, [onChange]);

    return <BlocksList list={entries} onChange={handleChange} />;
});

function BlockStateProperties({block, children, onChange, Properties = {}}) {
    const states = (useContext(DataContext).vanilla.blocks.find(b => 'minecraft:' + b.name === block) || { states: [] }).states;
    const [properties, setProperties] = useState(Properties);

    const handlePropertyChange = useCallback(function(option) {
        setProperties(properties => ({ ...properties, [option.name]: option.value }));
    }, []);
    const handleCheckboxChange = useCallback(function(e) {
        const value = e.target.checked.toString();
        setProperties(properties => ({ ...properties, [e.target.id]: value }));
    }, []);
    const handleNumberChange = useCallback(function(e) {
        const value = e.target.value;
        setProperties(properties => ({ ...properties, [e.target.id]: value }));
    }, []);
    useEffect(() => onChange(properties), [onChange, properties]);

    const selects = [];
    states.forEach(possible => {
        switch(possible.type) {
            case 'bool':
                selects.push(<div key={possible.name}>
                    <label>{possible.name}</label> : <input type="checkbox" id={possible.name} className="checkbox" checked={Properties[possible.name] === 'true'} onChange={handleCheckboxChange} />
                </div>);
                break;
            case 'int':
                selects.push(<div key={possible.name}>
                    <label>{possible.name}</label> : <input type="number" id={possible.name} value={Properties[possible.name] || 0} onChange={handleNumberChange} min="0" max={possible.num_values - 1} />
                </div>);
                break;
            default:
                const options = possible.values.map(value => ({ value, name: possible.name, label: value }));
                const defaultValue = options.find(o => o.value === Properties[possible.name]) || options[0];
                selects.push(<div key={possible.name}>
                    <label>{possible.name}</label> : <div className="inbl"><Select options={options} value={defaultValue} onChange={handlePropertyChange} /></div>
                </div>);
        }
    });
    return <div className="form-group form-row">
        {selects}{children}
    </div>;
}
import React, { useCallback, useState, useMemo } from 'react';
import { useCrud, CRUD, useJsonEffect } from '../../hooks/form';
import { Button } from '../../ui/Button';
import Select from 'react-select';
import { DECORATORS_OPTIONS, DECORATOR_EXTRA_COUNT_DEFAULTS, DECORATOR_DECORATED_DEFAULTS, DECORATOR_RANGE_DEFAULTS } from './FeatureDefaults';
import { ConfInput } from '../../ui/Input';

export const DecoratorsList = React.memo(function({data, onChange}) {
    const [decorators, dispatch] = useCrud(data);

    const handleAddClick = useCallback(function(e) {
        e.preventDefault();
        const type = (DECORATORS_OPTIONS.filter(o => !decorators.some(d => d.type === o.value))[0] || { value: 'minecraft:count' }).value;
        dispatch({ type: CRUD.ADD, payload: { type }, unshift: true });
    }, [decorators, dispatch]);
    const handleChange = useCallback(function(state, previous) {
        dispatch({ type: CRUD.UPDATE, target: previous, payload: state });
    }, [dispatch]);
    const handleDeleteClick = useCallback(function(e, index) {
        e.preventDefault();
        dispatch({ type: CRUD.REMOVE, payload: decorators[index] });
    }, [decorators, dispatch]);
    useJsonEffect(decorators, data, onChange);

    const values = [];
    decorators.forEach((decorator, i) => {
        const key = decorator.type + '-' + i;
        values.push(<Decorator data={decorator} key={key} onChange={handleChange}><Button cat="danger" onClick={(e) => handleDeleteClick(e, i)}>Delete</Button></Decorator>);
    });
    return <fieldset>
        <legend>Decorators wrappers</legend>
        {values}
        <Button onClick={handleAddClick}>Add decorator</Button>
    </fieldset>
});

const Decorator = React.memo(function({children, data = { type: 'minecraft:count' }, onChange}) {
    const [decorator, setDecorator] = useState(data);

    const handleSelectChange = useCallback(function(option) {
        setDecorator({ type: option.value });
    }, []);
    const handleConfigChange = useCallback(function(config) {
        setDecorator(decorator => ({ type: decorator.type, config }));
    }, []);
    useJsonEffect(decorator, data, onChange);

    const selected = useMemo(function() {
        return DECORATORS_OPTIONS.find(o => o.value === decorator.type);
    }, [decorator.type]);
    return <div>
        <div className="form-group">
            <label>Type</label>
            <Select options={DECORATORS_OPTIONS} value={selected} onChange={handleSelectChange} />
        </div>
        <div className="form-group form-row">
            {decorator.type === 'minecraft:chance' && <ChanceDecorator config={decorator.config} onChange={handleConfigChange} />}
            {(decorator.type === 'minecraft:count' || decorator.type === 'minecraft:fire' || decorator.type === 'minecraft:count_multilayer') && <CountDecorator config={decorator.config} onChange={handleConfigChange} />}
            {decorator.type === 'minecraft:count_extra' && <ExtraCountDecorator config={decorator.config} onChange={handleConfigChange} />}
            {(decorator.type === 'minecraft:decorated' || decorator.type === 'minecraft:square') && <DecoratedDecorator config={decorator.config} onChange={handleConfigChange} />}
            {(decorator.type === 'minecraft:range' || decorator.type === 'minecraft:range_very_biased') && <RangeDecorator config={decorator.config} onChange={handleConfigChange} />}
            {children}
        </div>
    </div>;
});

const ChanceDecorator = React.memo(function({config = {}, onChange}) {
    const handleChanceChange = useCallback(function(e) {
        const value = e.target.value;
        if (value !== '' && !isNaN(value)) {
            onChange({ chance: parseInt(value) });
        }
    }, [onChange]);

    return <ConfInput id="chance" value={config.chance || 32} onChange={handleChanceChange}>Chance</ConfInput>
});

const CountDecorator = React.memo(function({config = {}, onChange}) {
    const handleCountChange = useCallback(function(e) {
        const value = e.target.value;
        if (value !== '' && !isNaN(value)) {
            onChange({ count: parseInt(value) });
        }
    }, [onChange]);

    return <ConfInput id="count" value={config.count || 25} onChange={handleCountChange}>Count</ConfInput>
});

const ExtraCountDecorator = React.memo(function({config = DECORATOR_EXTRA_COUNT_DEFAULTS, onChange}) {
    const [configured, setConfig] = useState(config);

    const handleNumberChange = useCallback(function(e) {
        const value = e.target.value;
        if (value !== '' && !isNaN(value)) {
            setConfig(configured => ({ ...configured, [e.target.dataset.name]: parseFloat(value) }));
        }
    }, []);
    useJsonEffect(configured, config, onChange);

    return <>
        <ConfInput id="count" value={configured.count} onChange={handleNumberChange}>Count</ConfInput>
        <ConfInput id="extra_chance" value={configured.extra_chance} onChange={handleNumberChange} step="0.05">Extra chance</ConfInput>
        <ConfInput id="extra_count" value={configured.extra_count} onChange={handleNumberChange}>Extra count</ConfInput>
    </>
});

const DecoratedDecorator = React.memo(function({config = DECORATOR_DECORATED_DEFAULTS, onChange}) {

    useJsonEffect(DECORATOR_DECORATED_DEFAULTS, config, onChange);
    return <div></div>;
});

const RangeDecorator = React.memo(function({config = DECORATOR_RANGE_DEFAULTS, onChange}) {
    const [configured, setConfig] = useState(config);

    const handleNumberChange = useCallback(function(e) {
        const value = e.target.value;
        if (value !== '' && !isNaN(value)) {
            setConfig(configured => ({ ...configured, [e.target.dataset.name]: parseInt(value) }));
        }
    }, []);
    useJsonEffect(configured, config, onChange);

    return <>
        <ConfInput id="bottom_offset" value={configured.bottom_offset} onChange={handleNumberChange}>Bottom offset</ConfInput>
        <ConfInput id="top_offset" value={configured.top_offset} onChange={handleNumberChange}>Top offset</ConfInput>
        <ConfInput id="maximum" value={configured.maximum} onChange={handleNumberChange}>Y maximum</ConfInput>
    </>
});
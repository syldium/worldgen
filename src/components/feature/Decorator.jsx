import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { useCrudPreset, useJsonEffect } from '../../hooks/form';
import { Button } from '../../ui/Button';
import Select from 'react-select';
import { DECORATORS_OPTIONS, DECORATOR_EXTRA_COUNT_DEFAULTS, DECORATOR_DECORATED_DEFAULTS, DECORATOR_RANGE_DEFAULTS } from './FeatureDefaults';
import { ConfInput } from '../../ui/Input';

export const DecoratorsList = React.memo(function({data, onChange}) {
    const [decorators, handleAdd, handleChange, handleRemove] = useCrudPreset(data, function(decorators) {
        // Get the first non taken decorator
        return { type: (DECORATORS_OPTIONS.filter(o => !decorators.some(d => d.type === o.value))[0] || { value: 'minecraft:count' }).value };
    });
    useJsonEffect(decorators, data, onChange);

    const shouldCancelStart = useCallback(function(e) {
        return !e.target.parentNode.classList.contains('sortable-item');
    }, []);
    
    return <fieldset>
        <legend>Decorators wrappers {DECORATORS_OPTIONS.length > decorators.length && <Button onClick={handleAdd}>Add decorator</Button>}</legend>
        <SortableDecoratorsList decorators={decorators} handleChange={handleChange} handleRemove={handleRemove}
            onSortEnd={handleChange} shouldCancelStart={shouldCancelStart} />
    </fieldset>
});

const SortableDecoratorsList = SortableContainer(function({decorators, handleChange, handleRemove}) {
    return <ol className="sortable-container">
        {decorators.map((decorator, index) => {
            const options = DECORATORS_OPTIONS.filter(o => decorator.type === o.value || !decorators.some(d => d.type === o.value));
            return <Decorator key={decorator.type} data={decorator} index={index} onChange={handleChange} options={options}>
                <Button cat="danger mlm" onClick={(e) => handleRemove(e, index)}>Remove</Button>
            </Decorator>
        })}
    </ol>
});

const Decorator = React.memo(SortableElement(function({children, data = { type: 'minecraft:count' }, onChange, options}) {
    const [decorator, setDecorator] = useState(data);

    const handleSelectChange = useCallback(function(option) {
        setDecorator({ type: option.value });
    }, []);
    const handleConfigChange = useCallback(function(config) {
        setDecorator(decorator => ({ type: decorator.type, config }));
    }, []);
    useJsonEffect(decorator, data, onChange);

    const selected = useMemo(function() {
        return options.find(o => o.value === decorator.type);
    }, [decorator.type, options]);
    return <li className="sortable-item">
        <div className="form-group form-row">
            <div style={{ flexGrow: 1 }}><Select options={options} value={selected} onChange={handleSelectChange} /></div>
            {children}
        </div>
        <div className="form-group form-row">
            {decorator.type === 'minecraft:chance' && <ChanceDecorator config={decorator.config} onChange={handleConfigChange} />}
            {(decorator.type === 'minecraft:count' || decorator.type === 'minecraft:fire' || decorator.type === 'minecraft:count_multilayer') && <CountDecorator config={decorator.config} onChange={handleConfigChange} />}
            {decorator.type === 'minecraft:count_extra' && <ExtraCountDecorator config={decorator.config} onChange={handleConfigChange} />}
            {(decorator.type === 'minecraft:decorated' || decorator.type === 'minecraft:square') && <DecoratedDecorator config={decorator.config} onChange={handleConfigChange} />}
            {(decorator.type === 'minecraft:range' || decorator.type === 'minecraft:range_very_biased') && <RangeDecorator config={decorator.config} onChange={handleConfigChange} />}
        </div>
    </li>;
}));

const ChanceDecorator = React.memo(function({config = {}, onChange}) {
    const handleChanceChange = useCallback(function(e) {
        const value = e.target.value;
        if (value !== '' && !isNaN(value)) {
            onChange({ chance: parseInt(value) });
        }
    }, [onChange]);
    useEffect(() => {
        if (typeof data === 'undefined') {
            onChange({ chance: 32 });
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
    useEffect(() => {
        if (typeof data === 'undefined') {
            onChange({ count: 25 });
        }
    }, [onChange]);

    return <ConfInput id="count" value={config.count || 25} onChange={handleCountChange}>Count</ConfInput>
});

const ExtraCountDecorator = React.memo(function({config, onChange}) {
    const [configured, setConfig] = useState(config || DECORATOR_EXTRA_COUNT_DEFAULTS);

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

const DecoratedDecorator = React.memo(function({config, onChange}) {
    useEffect(() => {
        if (typeof config === 'undefined') {
            onChange(DECORATOR_DECORATED_DEFAULTS);
        }
    }, [config, onChange]);
    return <div></div>;
});

const RangeDecorator = React.memo(function({config, onChange}) {
    const [configured, setConfig] = useState(config || DECORATOR_RANGE_DEFAULTS);

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
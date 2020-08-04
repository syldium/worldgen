import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { useCrudPreset, useJsonEffect } from '../../hooks/form';
import { Button } from '../../ui/Button';
import Select from '../../ui/Select';
import { DECORATORS_OPTIONS, DECORATOR_EXTRA_COUNT_DEFAULTS, DECORATOR_DECORATED_DEFAULTS, DECORATOR_RANGE_DEFAULTS } from './FeatureDefaults';
import { NumberInput } from '../../ui/Input';

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
        setDecorator(decorator => ({ type: decorator.type, config: { ...decorator.config, ...config }}));
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
            {(decorator.type === 'minecraft:range' || decorator.type === 'minecraft:range_biased' || decorator.type === 'minecraft:range_very_biased') && <RangeDecorator config={decorator.config} onChange={handleConfigChange} />}
        </div>
    </li>;
}));

const ChanceDecorator = React.memo(function({config = {}, onChange}) {
    return <NumberInput id="chance" value={config.chance} defaultValue="32" upChange={onChange}>Chance</NumberInput>
});

const CountDecorator = React.memo(function({config = {}, onChange}) {
    return <NumberInput id="count" value={config.count} defaultValue="25" upChange={onChange}>Count</NumberInput>
});

const ExtraCountDecorator = React.memo(function({config, onChange}) {
    config = useJsonEffect(config || DECORATOR_EXTRA_COUNT_DEFAULTS, config, onChange);

    return <>
        <NumberInput id="count" value={config.count} upChange={onChange}>Count</NumberInput>
        <NumberInput id="extra_chance" value={config.extra_chance} upChange={onChange} step="0.05">Extra chance</NumberInput>
        <NumberInput id="extra_count" value={config.extra_count} upChange={onChange}>Extra count</NumberInput>
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
    config = useJsonEffect(config || DECORATOR_RANGE_DEFAULTS, config, onChange);

    return <>
        <NumberInput id="bottom_offset" value={config.bottom_offset} upChange={onChange}>Bottom offset</NumberInput>
        <NumberInput id="top_offset" value={config.top_offset} upChange={onChange}>Top offset</NumberInput>
        <NumberInput id="maximum" value={config.maximum} upChange={onChange}>Y maximum</NumberInput>
    </>
});
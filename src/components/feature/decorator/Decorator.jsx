import { CARVERS_OPTIONS, DECORATORS_OPTIONS, DECORATOR_CARVING_MASK_DEFAULTS, DECORATOR_DECORATED_DEFAULTS, DECORATOR_EXTRA_COUNT_DEFAULTS, DECORATOR_RANGE_DEFAULTS } from './DecoratorDefaults';
import React, { useCallback, useEffect, useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { useCrudPreset, useJsonEffect } from '../../../hooks/form';

import { Button } from '../../../ui/Button';
import { NumberInput } from '../../../ui/Input';
import Select from '../../../ui/Select';
import { UniformInt } from '../../utils/UniformInt';

export const DecoratorsList = React.memo(function({data, onChange}) {
    const [decorators, handleAdd, handleChange, handleRemove] = useCrudPreset(onChange, data, function(decorators) {
        // Get the first non taken decorator
        return { type: (DECORATORS_OPTIONS.filter(o => !decorators.some(d => d.type === o.value))[0] || { value: 'minecraft:count' }).value };
    });

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

    return <li className="sortable-item">
        <div className="form-group form-row">
            <div style={{ flexGrow: 1 }}><Select options={options} value={options.find(o => o.value === decorator.type)} onChange={handleSelectChange} /></div>
            {children}
        </div>
        <div className="form-group form-row">
            {decorator.type === 'minecraft:carving_mask' && <CarvingMaskDecorator config={decorator.config} onChange={handleConfigChange} />}
            {(decorator.type === 'minecraft:chance' || decorator.type === 'minecraft:lava_lake' || decorator.type === 'minecraft:water_lake') && <ChanceDecorator config={decorator.config} onChange={handleConfigChange} />}
            {(decorator.type === 'minecraft:count' || decorator.type === 'minecraft:fire' || decorator.type === 'minecraft:count_multilayer') && <CountDecorator config={decorator.config} onChange={handleConfigChange} />}
            {decorator.type === 'minecraft:count_extra' && <ExtraCountDecorator config={decorator.config} onChange={handleConfigChange} />}
            {decorator.type === 'minecraft:count_noise' && <NoiseCountDecorator config={decorator.config} onChange={handleConfigChange} />}
            {decorator.type === 'minecraft:count_noise_biased' && <NoiseBiasedCountDecorator config={decorator.config} onChange={handleConfigChange} />}
            {(decorator.type === 'minecraft:decorated' || decorator.type === 'minecraft:square') && <DecoratedDecorator config={decorator.config} onChange={handleConfigChange} />}
            {(decorator.type === 'minecraft:range' || decorator.type === 'minecraft:range_biased' || decorator.type === 'minecraft:range_very_biased') && <RangeDecorator config={decorator.config} onChange={handleConfigChange} />}
        </div>
    </li>;
}));

const CarvingMaskDecorator = React.memo(function({config, onChange}) {
    config = useJsonEffect(config || DECORATOR_CARVING_MASK_DEFAULTS, config, onChange);

    const handleStepChange = useCallback(function (option) {
        onChange({ probability: config.probability, step: option.value });
    }, [config.probability, onChange]);

    return <>
        <div className="inbl"><Select options={CARVERS_OPTIONS} value={CARVERS_OPTIONS.find(o => o.value === config.step)} onChange={handleStepChange} /></div>
        <NumberInput id="probability" value={config.probability} upChange={onChange} step="0.05">Probability</NumberInput>
    </>
});

const ChanceDecorator = React.memo(function({config = {}, onChange}) {
    return <NumberInput id="chance" value={config.chance} defaultValue={32} upChange={onChange}>Chance</NumberInput>
});

const CountDecorator = React.memo(function({config = {}, onChange}) {
    return <UniformInt id="count" value={config.count} minBase={-10} maxBase={128} maxSpread={128} defaultValue={25} upChange={onChange}>Count</UniformInt>
});

const ExtraCountDecorator = React.memo(function({config, onChange}) {
    config = useJsonEffect(config || DECORATOR_EXTRA_COUNT_DEFAULTS, config, onChange);

    return <>
        <NumberInput id="count" value={config.count} upChange={onChange}>Count</NumberInput>
        <NumberInput id="extra_chance" value={config.extra_chance} upChange={onChange} step="0.05">Extra chance</NumberInput>
        <NumberInput id="extra_count" value={config.extra_count} upChange={onChange}>Extra count</NumberInput>
    </>
});

const NoiseCountDecorator = React.memo(function({config, onChange}) {
    config = useJsonEffect(config || {
        noise_level: -0.8,
        below_noise: 15,
        above_noise: 4
    }, config, onChange);

    return <>
        <NumberInput id="noise_level" value={config.noise_level} upChange={onChange}>Noise level</NumberInput>
        <NumberInput id="below_noise" value={config.below_noise} upChange={onChange}>Below noise</NumberInput>
        <NumberInput id="above_noise" value={config.above_noise} upChange={onChange}>Above noise</NumberInput>
    </>
});

const NoiseBiasedCountDecorator = React.memo(function({config, onChange}) {
    config = useJsonEffect(config || {
        noise_to_count_ratio: 160,
        noise_factor: 80.0,
        noise_offset: 0.3
    }, config, onChange);

    return <>
        <NumberInput id="noise_to_count_ratio" value={config.noise_to_count_ratio} upChange={onChange}>Noise to count ratio</NumberInput>
        <NumberInput id="noise_factor" value={config.noise_factor} upChange={onChange} step="0.05">Noise factor</NumberInput>
        <NumberInput id="noise_offset" value={config.noise_offset} upChange={onChange} step="0.05">Noise factor</NumberInput>
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
import { CarvingMaskDecorator, ChanceDecorator, CountDecorator, CountExtraDecorator, CountNoiseBiasedDecorator, CountNoiseDecorator, DecoratedDecorator, DepthAverageDecorator, RangeDecorator } from './DecoratorConfig';
import { DECORATOR_CARVING_MASK, DECORATOR_COUNT_NOISE, DECORATOR_COUNT_NOISE_BIASED, DECORATOR_DECORATED, DECORATOR_DEPTH_AVERAGE, DECORATOR_EXTRA_COUNT, DECORATOR_RANGE } from './DecoratorDefaults';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import React, { useCallback } from 'react';

import { Button } from '../../../ui/Button';
import { capitalize } from '../../../utils/data';
import { useCrudPreset } from '../../../hooks/form';
import Select from '../../../ui/Select';

const DECORATORS = [
    { type: 'carving_mask', default: DECORATOR_CARVING_MASK, config: CarvingMaskDecorator },
    { type: 'chance', default: { chance: 32 }, config: ChanceDecorator },
    { type: 'count', default: { count: 25 }, config: CountDecorator },
    { type: 'count_extra', default: DECORATOR_EXTRA_COUNT, config: CountExtraDecorator },
    { type: 'count_multilayer', default: { count: 6 }, config: CountDecorator },
    { type: 'count_noise', default: DECORATOR_COUNT_NOISE, config: CountNoiseDecorator },
    { type: 'count_noise_biased', default: DECORATOR_COUNT_NOISE_BIASED, config: CountNoiseBiasedDecorator },
    { type: 'dark_oak_tree' },
    { type: 'decorated', default: DECORATOR_DECORATED, config: DecoratedDecorator },
    { type: 'depth_average', default: DECORATOR_DEPTH_AVERAGE, config: DepthAverageDecorator },
    { type: 'emerald_ore' },
    { type: 'end_gateway' },
    { type: 'end_island' },
    { type: 'fire', default: { count: 10 }, config: CountDecorator },
    { type: 'glowstone', default: { count: 10 }, config: CountDecorator },
    { type: 'heightmap' },
    { type: 'heightmap_spread_double' },
    { type: 'heightmap_world_surface' },
    { type: 'iceberg' },
    { type: 'lava_lake', default: { chance: 80 }, config: ChanceDecorator },
    { type: 'magma' },
    { type: 'nope' },
    { type: 'range', default: DECORATOR_RANGE, config: RangeDecorator },
    { type: 'range_biased', default: DECORATOR_RANGE, config: RangeDecorator },
    { type: 'range_very_biased', default: DECORATOR_RANGE, config: RangeDecorator },
    { type: 'spread_32_above' },
    { type: 'square' },
    { type: 'top_solid_heightmap' },
    { type: 'water_lake', default: { chance: 4 }, config: ChanceDecorator }
].map(decorator => {
    decorator.default = decorator.default || {};
    decorator.type = 'minecraft:' + decorator.type;
    return decorator;
});

export const DECORATORS_OPTIONS = DECORATORS
    .map(decorator => ({ value: decorator.type, label: capitalize(decorator.type.substr(10).replace(/_/g, ' ')) }));

export const DecoratorsList = React.memo(function ({ data, onChange }) {
    const [decorators, handleAdd, handleChange, handleRemove] = useCrudPreset(onChange, data, function (decorators) {
        // Get the first non taken decorator
        const type = (DECORATORS_OPTIONS.filter(o => !decorators.some(d => d.type === o.value))[0] || { value: 'minecraft:count' }).value;
        return { config: DECORATORS.find(d => type === d.type).default || {}, type };
    });

    const shouldCancelStart = useCallback(function (e) {
        return !e.target.parentNode.classList.contains('sortable-item');
    }, []);

    return <fieldset>
        <legend>Decorators wrappers {DECORATORS_OPTIONS.length > decorators.length && <Button onClick={handleAdd}>Add decorator</Button>}</legend>
        <SortableDecoratorsList decorators={decorators} handleChange={handleChange} handleRemove={handleRemove}
            onSortEnd={handleChange} shouldCancelStart={shouldCancelStart} />
    </fieldset>
});

const SortableDecoratorsList = SortableContainer(function ({ decorators, handleChange, handleRemove }) {
    return <ol className="sortable-container">
        {decorators.map((decorator, index) => {
            const options = DECORATORS_OPTIONS.filter(o => decorator.type === o.value || !decorators.some(d => d.type === o.value));
            return <SortableDecorator key={decorator.type + index} decorator={decorator} index={index} onChange={handleChange} options={options}>
                <Button cat="danger mlm" onClick={(e) => handleRemove(e, index)}>Remove</Button>
            </SortableDecorator>
        })}
    </ol>
});

export const Decorator = React.memo(function ({ children, className = "form-group form-row", decorator = { config: {}, type: 'minecraft:heightmap' }, onChange, options }) {

    const handleSelectChange = useCallback(function (option) {
        onChange({
            type: option.value,
            config: DECORATORS.find(decorator => option.value === decorator.type).default
        }, decorator);
    }, [decorator, onChange]);
    const handleConfigChange = useCallback(function (config) {
        onChange({ type: decorator.type, config: { ...decorator.config, ...config } }, decorator);
    }, [decorator, onChange]);
    const DecoratorConfig = (DECORATORS.find(d => decorator.type === d.type) || { config: 'p' }).config || (() => <div></div>);

    return <>
        <div className={className}>
            <div className="flex-grow"><Select options={options} value={options.find(o => o.value === decorator.type)} onChange={handleSelectChange} /></div>
            {children}
        </div>
        <div className="form-group form-row">
            <DecoratorConfig config={decorator.config} onChange={handleConfigChange}>Currently not supported (<code>{decorator.type}</code>).</DecoratorConfig>
        </div>
    </>;
});

const SortableDecorator = SortableElement(({ index, ...props }) =>
    <li className="sortable-item" index={index}><Decorator {...props} /></li>
);

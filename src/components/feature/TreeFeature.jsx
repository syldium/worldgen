import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { BlockStateProvider } from '../state/BlockStateProvider';
import Select from 'react-select';
import { TREE_DECORATORS_OPTIONS, TREE_FEATURE_CONFIG } from './FeatureDefaults';
import { useJsonEffect, useCrud, CRUD } from '../../hooks/form';
import { NumberInput } from '../../ui/Input';
import { Button } from '../../ui/Button';

export function TreeFeatureConfig({configuration = TREE_FEATURE_CONFIG, onChange}) {

    const [config, setConfig] = useState(configuration);

    const handleTrunkProviderChange = useCallback(function(trunk_provider) {
        setConfig(config => ({ ...config, trunk_provider }));
    }, []);
    const handleLeavesProviderChange = useCallback(function(leaves_provider) {
        setConfig(config => ({ ...config, leaves_provider }));
    }, []);
    const handleFoliagePlacerChange = useCallback(function(foliage_placer) {
        setConfig(config => ({ ...config, foliage_placer: { ...config.foliage_placer, ...foliage_placer } }));
    }, []);
    const handleTrunkPlacerChange = useCallback(function(trunk_placer) {
        setConfig(config => ({ ...config, trunk_placer: { ...config.trunk_placer, ...trunk_placer } }));
    }, []);
    const handleDecoratorsChange = useCallback(function(decorators) {
        setConfig(config => ({ ...config, decorators }));
    }, []);
    useJsonEffect(config, configuration, onChange);

    return <div>
        <fieldset>
            <legend>Trunk provider</legend>
            <BlockStateProvider block={config.trunk_provider} onChange={handleTrunkProviderChange} />
        </fieldset>
        <fieldset>
            <legend>Leaves provider</legend>
            <BlockStateProvider block={config.leaves_provider} onChange={handleLeavesProviderChange} />
        </fieldset>
        <FoliagePlacer placer={config.foliage_placer} onChange={handleFoliagePlacerChange} />
        <TrunkPlacer placer={config.trunk_placer} onChange={handleTrunkPlacerChange} />
        <TreeDecorators data={configuration.decorators} onChange={handleDecoratorsChange}></TreeDecorators>
    </div>;
}

const FoliagePlacer = React.memo(function({placer, onChange}) {
    const options = useMemo(function() {
        return [
            { value: 'blob_foliage_placer', label: 'Blob foliage placer' },
            { value: 'fancy_foliage_placer', label: 'Fancy foliage placer' }
        ].map(o => {
            o.value = 'minecraft:' + o.value;
            return o;
        });
    }, []);

    const handleTypeChange = useCallback(function(option) {
        onChange({ type: option.value });
    }, [onChange]);

    const selected = useMemo(function() {
        return options.find(o => o.value === placer.type) || options[0];
    }, [options, placer.type]);

    return <fieldset>
        <legend>Foliage placer</legend>
        <div className="form-group">
            <label htmlFor="foliage_placer_type">Type</label>
            <Select options={options} name="foliage_placer_type" value={selected} onChange={handleTypeChange} />
        </div>
        <div className="form-group form-row">
            <NumberInput id="radius" value={placer.radius} upChange={onChange} max="8">Radius</NumberInput>
            <NumberInput id="offset" value={placer.offset} upChange={onChange} max="8">Offset</NumberInput>
            {(placer.type === 'minecraft:blob_foliage_placer' ||
                placer.type === 'minecraft:bush_foliage_placer' ||
                placer.type === 'minecraft:fancy_foliage_placer' ||
                placer.type === 'minecraft:jungle_foliage_placer'
            ) && <NumberInput id="height" value={placer.height} upChange={onChange} max="16" defaultValue="3">Height</NumberInput>}
        </div>
    </fieldset>
});

const TrunkPlacer = React.memo(function({placer, onChange}) {
    const options = useMemo(function() {
        return [
            { value: 'straight_trunk_placer', label: 'Straight trunk placer' },
            { value: 'forking_trunk_placer', label: 'Forking trunk placer' },
            { value: 'giant_trunk_placer', label: 'Giant trunk placer' },
            { value: 'mega_jungle_trunk_placer', label: 'Mega jungle trunk placer' },
            { value: 'dark_oak_trunk_placer', label: 'Dark oak trunk placer' },
            { value: 'fancy_trunk_placer', label: 'Fancy trunk placer' }
        ].map(o => {
            o.value = 'minecraft:' + o.value;
            return o;
        });
    }, []);

    const handleTypeChange = useCallback(function(option) {
        onChange({ type: option.value });
    }, [onChange]);

    const selected = useMemo(function() {
        return options.find(o => o.value === placer.type) || options[0];
    }, [placer.type, options]);

    return <fieldset>
        <legend>Trunk placer</legend>
        <div className="form-group">
            <label htmlFor="foliage_placer_type">Type</label>
            <Select options={options} name="foliage_placer_type" defaultValue={selected} onChange={handleTypeChange} />
        </div>
        <div className="form-group form-row">
            <NumberInput id="base_height" value={placer.base_height} upChange={onChange} max="32">Base height</NumberInput>
            <NumberInput id="height_rand_a" value={placer.height_rand_a} upChange={onChange} max="24">First height rand</NumberInput>
            <NumberInput id="height_rand_b" value={placer.height_rand_b} upChange={onChange} max="24">Second height rand</NumberInput>
        </div>
    </fieldset>
});

const TreeDecorators = React.memo(function({data, onChange}) {
    const [decorators, dispatch] = useCrud(data);

    const handleAddClick = useCallback(function(e) {
        e.preventDefault();
        const decorator = TREE_DECORATORS_OPTIONS.find(o => !decorators.some(d => d.type === o.value));
        if (typeof decorator !== 'undefined') {
            dispatch({ type: CRUD.ADD, payload: { type: decorator.value } });
        }
    }, [decorators, dispatch]);
    const handleChange = useCallback(function(decorator, previous) {
        dispatch({ type: CRUD.UPDATE, target: previous, payload: decorator });
    }, [dispatch]);
    const handleDeleteClick = useCallback(function(e, index) {
        e.preventDefault();
        dispatch({ type: CRUD.REMOVE, payload: decorators[index] });
    }, [decorators, dispatch]);
    useJsonEffect(decorators.map(decorator => {
        delete decorator.index;
        return decorator;
    }), data, onChange);
    
    return <fieldset>
        <legend>Tree decorators {decorators.length < 5 && <Button onClick={handleAddClick}>Add decorator</Button>}</legend>
        {decorators.map((decorator, i) => {
            const options = TREE_DECORATORS_OPTIONS.filter(o => o.value === decorator.type || !decorators.some(d => d.type === o.value));
            return <TreeDecorator data={decorator }key={decorator.type} onChange={handleChange} options={options}>
                <Button cat="danger mlm" onClick={(e) => handleDeleteClick(e, i)}>Remove</Button>
            </TreeDecorator>
        })}
    </fieldset>
});

const TreeDecorator = React.memo(function({children, data, options, onChange}) {
    const [decorator, setDecorator] = useState(data);

    const handleSelectChange = useCallback(function(option) {
        setDecorator({ type: option.value, ...option.default });
    }, []);
    const handleAlterGroundChange = useCallback(function(provider) {
        setDecorator(decorator => ({ type: decorator.type, provider }));
    }, []);
    const handleProbabilityChange = useCallback(function(probability) {
        setDecorator(decorator => ({ type: decorator.type, probability }));
    }, []);
    useEffect(() => {
        if (decorator !== data) {
            onChange(decorator, data);
        }
    }, [data, decorator, onChange]);

    const CustomTag = ['minecraft:leave_vine', 'minecraft:trunk_vine'].indexOf(decorator.type) < 0 ? 'fieldset' : 'div';

    const selected = useMemo(function() {
        return options.find(o => o.value === decorator.type);
    }, [decorator.type, options]);
    return <CustomTag>
        <legend style={{ fontWeight: 'normal', fontSize: 'inherit' }}>
            <div style={{ width: '200px', display: 'inline-block' }}><Select options={options} value={selected} onChange={handleSelectChange} /></div>
            {children}
        </legend>
        <div className="form-group">
            {decorator.type === 'minecraft:alter_ground' && <BlockStateProvider block={decorator.provider} onChange={handleAlterGroundChange} />}
            {(decorator.type === 'minecraft:beehive' || decorator.type === 'minecraft:cocoa') && <NumberInput id="probability" value={decorator.probability} onChange={handleProbabilityChange} max="1" step="0.05" defaultValue="0.05">Probability</NumberInput>}
        </div>
    </CustomTag>
});
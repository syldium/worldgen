import {ConfInput, NumberInput} from '../../../ui/Input';
import React, { useCallback, useMemo } from 'react';

import { BlockStateProvider } from '../../state/BlockStateProvider';
import { Button } from '../../../ui/Button';
import {Heightmap} from "../Heightmap";
import { TREE_DECORATORS_OPTIONS } from './FeatureConfigDefaults';
import { UniformInt } from '../../utils/UniformInt';
import { useCrudPreset } from '../../../hooks/form';
import Select from '../../../ui/Select';

export function TreeFeature({configuration, onChange}) {

    const handleTrunkProviderChange = useCallback(function(trunk_provider) {
        onChange({ ...configuration, trunk_provider });
    }, [configuration, onChange]);
    const handleLeavesProviderChange = useCallback(function(leaves_provider) {
        onChange({ ...configuration, leaves_provider });
    }, [configuration, onChange]);
    const handleFoliagePlacerChange = useCallback(function(foliage_placer) {
        onChange({ ...configuration, foliage_placer });
    }, [configuration, onChange]);
    const handleTrunkPlacerChange = useCallback(function(trunk_placer) {
        onChange({ ...configuration, trunk_placer: { ...configuration.trunk_placer, ...trunk_placer } });
    }, [configuration, onChange]);
    const handleDecoratorsChange = useCallback(function(decorators) {
        onChange({ ...configuration, decorators });
    }, [configuration, onChange]);
    const handleConfigChange = useCallback(function(config) {
        onChange({ ...configuration, ...config });
    }, [configuration, onChange]);
    const handleIgnoreVinesChange = useCallback(function(e) {
        onChange({ ...configuration, ignore_vines: e.target.checked });
    }, [configuration, onChange]);
    const handleHeightmapChange = useCallback(function(option) {
        onChange({ ...configuration, heightmap: option.value });
    }, [configuration, onChange]);

    return <div>
        <p className="help text-muted">A tree necessarily needs <span title="Dirt, grass block, podzol, coarse dirt or mycelium">a soil block</span> or a farmland block underneath to be generated.</p>
        <fieldset>
            <legend>Trunk provider</legend>
            <BlockStateProvider block={configuration.trunk_provider} onChange={handleTrunkProviderChange} />
        </fieldset>
        <fieldset>
            <legend>Leaves provider</legend>
            <BlockStateProvider block={configuration.leaves_provider} onChange={handleLeavesProviderChange} />
        </fieldset>
        <FoliagePlacer placer={configuration.foliage_placer} onChange={handleFoliagePlacerChange} />
        <TrunkPlacer placer={configuration.trunk_placer} onChange={handleTrunkPlacerChange} />
        <TreeDecorators data={configuration.decorators} onChange={handleDecoratorsChange}></TreeDecorators>
        <fieldset>
            <legend>Config</legend>
            <Heightmap heightmap={configuration.heightmap} onChange={handleHeightmapChange} />
            <div className="form-group form-row">
                <ConfInput id="ignore_vines" checked={configuration.ignore_vines || false} onChange={handleIgnoreVinesChange}>Ignore vines</ConfInput>
                <NumberInput id="max_water_depth" value={configuration.max_water_depth} required={false} upChange={handleConfigChange}>Max water depth</NumberInput>
            </div>
        </fieldset>
    </div>;
}

const FoliagePlacer = React.memo(function({placer, onChange}) {
    const options = useMemo(function() {
        return [
            { value: 'acacia_foliage_placer', label: 'Acacia foliage placer' },
            { value: 'blob_foliage_placer', label: 'Blob foliage placer' },
            { value: 'bush_foliage_placer', label: 'Bush foliage placer' },
            { value: 'dark_oak_foliage_placer', label: 'Dark oak foliage placer' },
            { value: 'fancy_foliage_placer', label: 'Fancy foliage placer' },
            { value: 'jungle_foliage_placer', label: 'Jungle foliage placer' },
            { value: 'mega_pine_foliage_placer', label: 'Mega pine foliage placer' },
            { value: 'pine_foliage_placer', label: 'Pine foliage placer' },
            { value: 'spruce_foliage_placer', label: 'Spruce foliage placer' }
        ].map(o => {
            o.value = 'minecraft:' + o.value;
            return o;
        });
    }, []);

    const handleTypeChange = useCallback(function(option) {
        const type = option.value;
        if (type === 'minecraft:acacia_foliage_placer' || type === 'minecraft:mega_pine_foliage_placer') {
            delete placer.height;
        } else if (type !== 'minecraft:acacia_foliage_placer') {
            delete placer.crown_height;
        }
        onChange({ ...placer, type });
    }, [onChange, placer]);
    const handleChange = useCallback(function(value) {
        onChange({ ...placer, ...value })
    }, [onChange, placer]);

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
            <UniformInt id="radius" value={placer.radius} maxBase={8} maxSpread={8} upChange={handleChange}>Radius</UniformInt>
            <UniformInt id="offset" value={placer.offset} maxBase={8} maxSpread={8} upChange={handleChange}>Offset</UniformInt>
            {(placer.type === 'minecraft:blob_foliage_placer' ||
                placer.type === 'minecraft:bush_foliage_placer' ||
                placer.type === 'minecraft:fancy_foliage_placer' ||
                placer.type === 'minecraft:jungle_foliage_placer'
            ) && <NumberInput id="height" value={placer.height} upChange={handleChange} max={16} defaultValue={3}>Height</NumberInput>}
            
            {placer.type === 'minecraft:mega_pine_foliage_placer' && <UniformInt id="crown_height" value={placer.crown_height} maxBase={16} maxSpread={8} upChange={handleChange}>Crown height</UniformInt>}
            {placer.type === 'minecraft:pine_foliage_placer' && <UniformInt id="height" value={placer.height} maxBase={16} maxSpread={8} upChange={handleChange}>Height</UniformInt>}
            {placer.type === 'minecraft:spruce_foliage_placer' && <UniformInt id="trunk_height" value={placer.trunk_height} maxBase={16} maxSpread={8} upChange={handleChange}>Trunk height</UniformInt>}
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
    const [decorators, handleAdd, handleChange, handleRemove] = useCrudPreset(onChange, data, function(decorators) {
        // Get the first non taken decorator
        return { type: (TREE_DECORATORS_OPTIONS.filter(o => !decorators.some(d => d.type === o.value))[0] || { value: 'minecraft:alter_ground' }).value };
    });
    
    return <fieldset>
        <legend>Tree decorators {decorators.length < 5 && <Button onClick={handleAdd}>Add decorator</Button>}</legend>
        {decorators.map((decorator, i) => {
            const options = TREE_DECORATORS_OPTIONS.filter(o => o.value === decorator.type || !decorators.some(d => d.type === o.value));
            return <TreeDecorator data={decorator} key={decorator.type} onChange={handleChange} options={options}>
                <Button cat="danger mlm" onClick={e => handleRemove(e, i)}>Remove</Button>
            </TreeDecorator>
        })}
    </fieldset>
});

const TreeDecorator = React.memo(function({children, data, options, onChange}) {
    const handleSelectChange = useCallback(function(option) {
        onChange({ type: option.value, ...option.default }, data);
    }, [data, onChange]);
    const handleAlterGroundChange = useCallback(function(provider) {
        onChange({ type: data.type, provider }, data);
    }, [data, onChange]);
    const handleProbabilityChange = useCallback(function(probability) {
        onChange({ type: data.type, probability }, data);
    }, [data, onChange]);

    const CustomTag = ['minecraft:leave_vine', 'minecraft:trunk_vine'].indexOf(data.type) < 0 ? 'fieldset' : 'div';

    const selected = useMemo(function() {
        return options.find(o => o.value === data.type);
    }, [data.type, options]);
    return <CustomTag>
        <legend style={{ fontWeight: 'normal', fontSize: 'inherit' }}>
            <div style={{ width: '200px', display: 'inline-block' }}><Select options={options} value={selected} onChange={handleSelectChange} /></div>
            {children}
        </legend>
        <div className="form-group">
            {data.type === 'minecraft:alter_ground' && <BlockStateProvider block={data.provider} onChange={handleAlterGroundChange} />}
            {(data.type === 'minecraft:beehive' || data.type === 'minecraft:cocoa') && <NumberInput id="probability" value={data.probability} onChange={handleProbabilityChange} max="1" step="0.05" defaultValue="0.05">Probability</NumberInput>}
        </div>
    </CustomTag>
});
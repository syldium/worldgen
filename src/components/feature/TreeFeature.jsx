import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { BlockStateProvider } from '../state/BlockState';
import Select from 'react-select';
import { TREE_FEATURE_CONFIG } from './FeatureDefaults';

export function TreeFeatureConfig({configuration = TREE_FEATURE_CONFIG, onChange}) {

    const [config, setConfig] = useState(configuration);

    const handleTrunkProviderChange = useCallback(function(trunk_provider) {
        setConfig(config => ({ ...config, trunk_provider }));
    }, []);
    const handleLeavesProviderChange = useCallback(function(leaves_provider) {
        setConfig(config => ({ ...config, leaves_provider }));
    }, []);
    const handleFoliagePlacerChange = useCallback(function(foliage_placer) {
        setConfig(config => ({ ...config, foliage_placer }));
    }, []);
    const handleTrunkPlacerChange = useCallback(function(trunk_placer) {
        setConfig(config => ({ ...config, trunk_placer }));
    }, []);

    useEffect(function() {
        onChange(config);
    }, [config, onChange]);

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
    </div>;
}

const FoliagePlacer = React.memo(function({placer, onChange}) {
    const [data, setData] = useState(placer);

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
        const type = option.value;
        setData(data => ({ ...data, type }));
    }, []);

    const handleValueChange = useCallback(function(e) {
        const name = e.target.id;
        const value = parseInt(e.target.value);
        setData(data => {
            const n = { ...data, [name]: value };
            onChange(n);
            return n;
        });
    }, [onChange]);

    const selected = useMemo(function() {
        return options.find(o => o.value === data.type) || options[0];
    }, [options, data.type]);

    return <fieldset>
        <legend>Foliage placer</legend>
        <div className="form-group">
            <label htmlFor="foliage_placer_type">Type</label>
            <Select options={options} name="foliage_placer_type" value={selected} onChange={handleTypeChange} />
        </div>
        <div className="form-group form-row">
            <div><label htmlFor="radius">Radius</label> : <input type="number" id="radius" value={data.radius} onChange={handleValueChange} /></div>
            <div><label htmlFor="offset">Offset</label> : <input type="number" id="offset" value={data.offset} onChange={handleValueChange} /></div>
            {(data.type === 'minecraft:blob_foliage_placer' ||
                data.type === 'minecraft:bush_foliage_placer' ||
                data.type === 'minecraft:fancy_foliage_placer' ||
                data.type === 'minecraft:jungle_foliage_placer'
            ) && <div><label htmlFor="height">Height</label> : <input type="number" id="height" value={data.height} onChange={handleValueChange} /></div>}
        </div>
    </fieldset>
});

const TrunkPlacer = React.memo(function({placer, onChange}) {
    const [data, setData] = useState(placer);

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
        const type = option.value;
        setData(data => ({ ...data, type }));
    }, []);

    const handleValueChange = useCallback(function(e) {
        const name = e.target.id;
        const value = parseInt(e.target.value);
        setData(data => {
            const n = { ...data, [name]: value };
            onChange(n);
            return n;
        });
    }, [onChange]);

    const selected = useMemo(function() {
        return options.find(o => o.value === data.type) || options[0];
    }, [data.type, options]);

    return <fieldset>
        <legend>Trunk placer</legend>
        <div className="form-group">
            <label htmlFor="foliage_placer_type">Type</label>
            <Select options={options} name="foliage_placer_type" defaultValue={selected} onChange={handleTypeChange} />
        </div>
        <div className="form-group form-row">
            <div><label htmlFor="base_height">Base height</label> : <input type="number" id="base_height" min="0" max="32" value={placer.base_height} onChange={handleValueChange} /></div>
            <div><label htmlFor="height_rand_a">First height rand</label> : <input type="number" id="height_rand_a" min="0" max="24" value={placer.height_rand_a} onChange={handleValueChange} /></div>
            <div><label htmlFor="height_rand_b">Second height rand</label> : <input type="number" id="height_rand_b" min="0" max="24" value={placer.height_rand_b} onChange={handleValueChange} /></div>
        </div>
    </fieldset>
});
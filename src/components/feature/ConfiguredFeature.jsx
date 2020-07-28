import React, { useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useState } from 'react';
import { TreeFeatureConfig } from './TreeFeature';
import { Button } from '../../ui/Button';
import { DecoratorsList } from './Decorator';
import { buildDecorated, findDecorators } from '../../utils/data';
import { DECORATED_TREE_CONFIG, DECORATED_RANDOM_PATCH_CONFIG, DECORATED_ORE_FEATURE_CONFIG } from './FeatureDefaults';
import { RandomPatchFeature } from './RandomPatchFeature';
import { OreFeatureConfig } from './OreFeature';

export function RawConfiguredFeature({data = DECORATED_TREE_CONFIG, onSave}) {
    const [state, setState] = useState(data);

    const [decorators, feature, type] = useMemo(function() {
        const a = findDecorators(state);
        return [...a, a[1].type];
    }, [state]);

    const handleSelectChange = useCallback(function(option) {
        setState({...option.default});
    }, []);
    const handleSave = useCallback(function(feature, decorators) {
        const name = document.getElementById('name').value;
        const data = buildDecorated(feature, decorators, name);
        if (data.key === '') {
            alert('You must specify a key!')
            return;
        }
        onSave(data);
    }, [onSave]);

    const options = useMemo(function() {
        return [
            { value: 'ore', label: 'Ore', default: DECORATED_ORE_FEATURE_CONFIG },
            { value: 'random_patch', label: 'Random patch', default: DECORATED_RANDOM_PATCH_CONFIG },
            { value: 'tree', label: 'Tree', default: DECORATED_TREE_CONFIG }
        ].map(o => {
            o.value = 'minecraft:' + o.value;
            return o;
        });
    }, []);

    return <div>
        <h3>Edit configured feature</h3>
        <div className="form-group">
            <label htmlFor="name">Name</label> : <input type="text" name="name" id="name" required pattern="[a-z0-9._-]+" placeholder="Ex. : prismarine-tree" defaultValue={(data || {}).key} />
        </div>
        <div className="form-group">
            <label htmlFor="type">Type</label>
            <Select options={options} value={options.find(o => o.value === type)} onChange={handleSelectChange} />
        </div>
        <hr />
        <ConfiguredFeature key={type} feature={feature} deco={decorators} onSave={handleSave} />
    </div>
}

function ConfiguredFeature({feature, deco, onSave}) {
    const [configuration, configure] = useState(feature);
    const [decorators, setDecorators] = useState(deco);

    const handleConfigurationChange = useCallback(function(config) {
        configure(configuration => ({ ...configuration, config }));
    }, []);
    const handleDecoratorsChange = useCallback(function(decorators) {
        setDecorators(decorators);
    }, []);

    const handleSaveClick = useCallback(function(e) {
        e.preventDefault();
        onSave(configuration, decorators)
    }, [configuration, decorators, onSave]);

    return <>
        {feature.type === 'minecraft:ore' && <OreFeatureConfig configuration={configuration.config} onChange={handleConfigurationChange} />}
        {feature.type === 'minecraft:random_patch' && <RandomPatchFeature configuration={configuration.config} onChange={handleConfigurationChange} />}
        {feature.type === 'minecraft:tree' && <TreeFeatureConfig configuration={configuration.config} onChange={handleConfigurationChange} />}
        <DecoratorsList data={decorators} onChange={handleDecoratorsChange} />
        <div className="form-group mlm mbm">
            <Button type="submit" onClick={handleSaveClick}>Save</Button>
        </div>
    </>;
}
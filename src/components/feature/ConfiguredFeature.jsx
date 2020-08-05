import React, { useCallback, useMemo, useState } from 'react';
import Select from '../../ui/Select';
import { TreeFeatureConfig } from './TreeFeature';
import { Button } from '../../ui/Button';
import { DecoratorsList } from './Decorator';
import { buildDecorated, findDecorators } from '../../utils/data';
import { DECORATED_TREE_CONFIG, DECORATED_RANDOM_PATCH_CONFIG, DECORATED_ORE_FEATURE_CONFIG, DECORATED_HUGE_FUNGUS_CONFIG, DECORATED_SPRING_FEATURE_CONFIG } from './FeatureDefaults';
import { RandomPatchFeature } from './RandomPatchFeature';
import { OreFeatureConfig } from './OreFeature';
import { NamespacedKey } from '../NamespacedKey';
import { HugeFungusFeature } from './HugeFungusFeature';
import { SpringFeature } from './SpringFeature';

export function RawConfiguredFeature({data = DECORATED_TREE_CONFIG, onSave}) {

    const [decorators_, feature_] = useMemo(() => findDecorators(data), [data]);

    const [feature, setFeature] = useState(feature_);
    const [decorators, setDecorators] = useState(decorators_);

    const handleSelectChange = useCallback(function(option) {
        const [decorators, feature] = findDecorators({ ...option.default });
        setFeature(feature);
        setDecorators(decorators);
    }, []);

    const handleFeatureChange = useCallback(function (config) {
        setFeature(feature => ({ ...feature, config }));
    }, []);

    const handleDecoratorsChange = useCallback(function (decorators) {
        setDecorators(decorators);
    }, []);

    const handleSubmit = useCallback(function(e) {
        e.preventDefault();
        const decorated = buildDecorated(feature, decorators, new FormData(e.target).get('key'));
        decorated.index = data.index;
        onSave(decorated);
    }, [data.index, decorators, feature, onSave]);

    const options = useMemo(function() {
        return [
            { value: 'huge_fungus', label: 'Huge fungus', default: DECORATED_HUGE_FUNGUS_CONFIG },
            { value: 'ore', label: 'Ore', default: DECORATED_ORE_FEATURE_CONFIG },
            { value: 'spring_feature', label: 'Spring', default: DECORATED_SPRING_FEATURE_CONFIG },
            { value: 'random_patch', label: 'Random patch', default: DECORATED_RANDOM_PATCH_CONFIG },
            { value: 'tree', label: 'Tree', default: DECORATED_TREE_CONFIG }
        ].map(o => {
            o.value = 'minecraft:' + o.value;
            return o;
        });
    }, []);

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="concrete_tree" type="features" value={data.key} expectBreakage={typeof data.key !== 'undefined'}>configured feature</NamespacedKey>
        <div className="form-group">
            <label htmlFor="type">Type</label>
            <Select options={options} value={options.find(o => o.value === feature.type)} onChange={handleSelectChange} inputId="type" />
        </div>
        <hr />
        {feature.type === 'minecraft:huge_fungus' && <HugeFungusFeature configuration={feature.config} onChange={handleFeatureChange} />}
        {feature.type === 'minecraft:ore' && <OreFeatureConfig configuration={feature.config} onChange={handleFeatureChange} />}
        {feature.type === 'minecraft:spring_feature' && <SpringFeature configuration={feature.config} onChange={handleFeatureChange} />}
        {feature.type === 'minecraft:random_patch' && <RandomPatchFeature configuration={feature.config} onChange={handleFeatureChange} />}
        {feature.type === 'minecraft:tree' && <TreeFeatureConfig configuration={feature.config} onChange={handleFeatureChange} />}
        <DecoratorsList data={decorators} key={feature.type} onChange={handleDecoratorsChange} />
        <Button type="submit">Save</Button>
    </form>
}

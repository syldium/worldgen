import { DECORATED_BAMBOO_CONFIG, DECORATED_BLOCK_PILE_CONFIG, DECORATED_CHORUS_PLANT_CONFIG, DECORATED_DELTA_CONFIG, DECORATED_DESERT_WELL_CONFIG, DECORATED_DISK_CONFIG, DECORATED_FOREST_ROCK_CONFIG, DECORATED_FOSSIL_CONFIG, DECORATED_GLOWSTONE_BLOB_CONFIG, DECORATED_HUGE_FUNGUS_CONFIG, DECORATED_ICEBERG_CONFIG, DECORATED_ICE_PATCH_CONFIG, DECORATED_ICE_SPIKE_CONFIG, DECORATED_LAKE_CONFIG, DECORATED_NETHERRACK_REPLACE_BLOBS_CONFIG, DECORATED_ORE_FEATURE_CONFIG, DECORATED_RANDOM_PATCH_CONFIG, DECORATED_SEAGRASS_CONFIG, DECORATED_SIMPLE_BLOCK_CONFIG, DECORATED_SPRING_FEATURE_CONFIG, DECORATED_TREE_CONFIG, DECORATED_VOID_START_PLATFORM_CONFIG } from './DecoratedFeatureDefaults';
import React, { useCallback, useMemo, useState } from 'react';
import { buildDecorated, capitalize, findDecorators } from '../../utils/data';

import { BlockPileFeature } from './config/BlockPileFeature';
import { Button } from '../../ui/Button';
import { DecoratorsList } from './decorator/Decorator';
import { DeltaFeature } from './config/DeltaFeature';
import { DiskFeature } from './config/DiskFeature';
import { HugeFungusFeature } from './config/HugeFungusFeature';
import { JsonViewer } from '../../ui/JsonViewer';
import { NamespacedKey } from '../NamespacedKey';
import { NetherrackReplaceBlobsFeature } from './config/NetherrackReplaceBlobsFeature';
import { OreFeature } from './config/OreFeature';
import { ProbabilityFeature } from './config/ProbabilityFeature';
import { RandomPatchFeature } from './config/RandomPatchFeature';
import Select from '../../ui/Select';
import { SimpleBlockFeature } from './config/SimpleBlockFeature';
import { SingleStateFeature } from './config/SingleStateFeature';
import { SpringFeature } from './config/SpringFeature';
import { TreeFeature } from './config/TreeFeature';

const FEATURES = [
    { type: 'bamboo', default: DECORATED_BAMBOO_CONFIG, config: ProbabilityFeature },
    { type: 'block_pile', default: DECORATED_BLOCK_PILE_CONFIG, config: BlockPileFeature },
    { type: 'chorus_plant', default: DECORATED_CHORUS_PLANT_CONFIG },
    { type: 'delta_feature', default: DECORATED_DELTA_CONFIG, config: DeltaFeature },
    { type: 'desert_well', default: DECORATED_DESERT_WELL_CONFIG },
    { type: 'disk', default: DECORATED_DISK_CONFIG, config: DiskFeature },
    { type: 'forest_rock', default: DECORATED_FOREST_ROCK_CONFIG, config: SingleStateFeature },
    { type: 'fossil', default: DECORATED_FOSSIL_CONFIG },
    { type: 'glowstone_blob', default: DECORATED_GLOWSTONE_BLOB_CONFIG },
    { type: 'huge_fungus', default: DECORATED_HUGE_FUNGUS_CONFIG, config: HugeFungusFeature },
    { type: 'iceberg', default: DECORATED_ICEBERG_CONFIG, config: SingleStateFeature },
    { type: 'ice_patch', default: DECORATED_ICE_PATCH_CONFIG, config: DiskFeature },
    { type: 'ice_spike', default: DECORATED_ICE_SPIKE_CONFIG },
    { type: 'lake', default: DECORATED_LAKE_CONFIG, config: SingleStateFeature },
    { type: 'netherrack_replace_blobs', default: DECORATED_NETHERRACK_REPLACE_BLOBS_CONFIG, config: NetherrackReplaceBlobsFeature },
    { type: 'ore', default: DECORATED_ORE_FEATURE_CONFIG, config: OreFeature },
    { type: 'simple_block', default: DECORATED_SIMPLE_BLOCK_CONFIG, config: SimpleBlockFeature },
    { type: 'seagrass', default: DECORATED_SEAGRASS_CONFIG, config: ProbabilityFeature },
    { type: 'spring_feature', default: DECORATED_SPRING_FEATURE_CONFIG, config: SpringFeature },
    { type: 'random_patch', default: DECORATED_RANDOM_PATCH_CONFIG, config: RandomPatchFeature },
    { type: 'tree', default: DECORATED_TREE_CONFIG, config: TreeFeature },
    { type: 'void_start_platform', default: DECORATED_VOID_START_PLATFORM_CONFIG }
].map(feature => {
    feature.type = 'minecraft:' + feature.type;
    return feature;
});

const OPTIONS = FEATURES
    .map(feature => ({ value: feature.type, label: capitalize(feature.type.substr(10).replace(/_/g, ' ')) }));

export function RawConfiguredFeature({ data = DECORATED_TREE_CONFIG, onSave }) {

    const [decorators_, feature_] = useMemo(() => findDecorators(data), [data]);

    const [feature, setFeature] = useState(feature_);
    const [decorators, setDecorators] = useState(decorators_);

    const handleSelectChange = useCallback(function (option) {
        const [decorators, feature] = findDecorators(FEATURES.find(feature => option.value === feature.type).default);
        setFeature(feature);
        setDecorators(decorators);
    }, []);

    const handleFeatureChange = useCallback(function (config) {
        setFeature(feature => ({ ...feature, config }));
    }, []);

    const handleDecoratorsChange = useCallback(function (decorators) {
        setDecorators(decorators);
    }, []);

    const handleVanillaSelect = useCallback(function (configured_feature) {
        const [decorators, feature] = findDecorators(configured_feature);
        setFeature(feature);
        setDecorators(decorators);
    }, []);

    const handleSubmit = useCallback(function (e) {
        e.preventDefault();
        const decorated = buildDecorated(feature, decorators, new FormData(e.target).get('key'));
        onSave(decorated);
    }, [decorators, feature, onSave]);

    const FeatureConfig = (FEATURES.find(f => feature.type === f.type) || { config: 'p' }).config || (() => <p className="text-muted">No config options</p>);

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="concrete_tree" type="features" value={data.key} expectBreakage={typeof data.key !== 'undefined'} onSelectLoad={handleVanillaSelect}>
            configured feature
            <JsonViewer data={() => buildDecorated(feature, decorators, data.key || 'feature')} />
        </NamespacedKey>
        <div className="form-group">
            <label htmlFor="type">Type</label>
            <Select options={OPTIONS} value={OPTIONS.find(o => o.value === feature.type)} onChange={handleSelectChange} inputId="type" />
        </div>
        <hr />
        <FeatureConfig configuration={feature.config} onChange={handleFeatureChange}>Currently not supported (<code>{feature.type}</code>).</FeatureConfig>
        <DecoratorsList data={decorators} key={feature.type} onChange={handleDecoratorsChange} />
        <Button type="submit">Save</Button>
    </form>
}

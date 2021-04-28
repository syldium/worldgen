import { DECORATED_BAMBOO, DECORATED_BASALT_COLUMNS, DECORATED_BASALT_PILLAR, DECORATED_BLOCK_PILE, DECORATED_BLUE_ICE, DECORATED_BONUS_CHEST, DECORATED_CHORUS_PLANT, DECORATED_CORAL_CLAW, DECORATED_CORAL_MUSHROOM, DECORATED_CORAL_TREE, DECORATED_DECORATED, DECORATED_DELTA_FEATURE, DECORATED_DESERT_WELL, DECORATED_DISK, DECORATED_EMERALD_ORE, DECORATED_END_GATEWAY, DECORATED_END_ISLAND, DECORATED_END_SPIKE, DECORATED_FILL_LAYER, DECORATED_FLOWER, DECORATED_FOREST_ROCK, DECORATED_FOSSIL, DECORATED_FREEZE_TOP_LAYER, DECORATED_GLOWSTONE_BLOB, DECORATED_HUGE_BROWN_MUSHROOM, DECORATED_HUGE_FUNGUS, DECORATED_HUGE_RED_MUSHROOM, DECORATED_ICEBERG, DECORATED_ICE_PATCH, DECORATED_ICE_SPIKE, DECORATED_KELP, DECORATED_LAKE, DECORATED_MONSTER_ROOM, DECORATED_NETHERRACK_REPLACE_BLOBS, DECORATED_NETHER_FOREST_VEGETATION, DECORATED_NO_BONEMEAL_FLOWER, DECORATED_NO_OP, DECORATED_NO_SURFACE_ORE, DECORATED_ORE, DECORATED_RANDOM_BOOLEAN_SELECTOR, DECORATED_RANDOM_PATCH, DECORATED_RANDOM_SELECTOR, DECORATED_SEAGRASS, DECORATED_SEA_PICKLE, DECORATED_SIMPLE_BLOCK, DECORATED_SIMPLE_RANDOM_SELECTOR, DECORATED_SPRING_FEATURE, DECORATED_TREE, DECORATED_TWISTING_VINES, DECORATED_VINES, DECORATED_VOID_START_PLATFORM, DECORATED_WEEPING_VINES } from './DecoratedFeatureDefaults';
import { buildDecorated, capitalize, findDecorators } from '../../utils/data';
import React, { useCallback, useMemo, useState } from 'react';

import { BasaltColumnsFeature } from './config/BasaltColumnsFeature';
import { BlockPileFeature } from './config/BlockPileFeature';
import { Button } from '../../ui/Button';
import { CountFeature } from './config/CountFeature';
import { DecoratedFeature } from './config/DecoratedFeature';
import { DecoratorsList } from './decorator/Decorator';
import { DeltaFeature } from './config/DeltaFeature';
import { DiskFeature } from './config/DiskFeature';
import { EmeraldOreFeature } from './config/EmeraldOreFeature';
import { EndGatewayFeature } from './config/EndGatewayFeature';
import { EndSpikeFeature } from './config/EndSpikeFeature';
import { FillLayerFeature } from './config/FillLayerFeature';
import { HugeFungusFeature } from './config/HugeFungusFeature';
import { HugeMushroomFeature } from './config/HugeMushroomFeature';
import { JsonViewer } from '../../ui/JsonViewer';
import { NamespacedKey } from '../NamespacedKey';
import { NetherrackReplaceBlobsFeature } from './config/NetherrackReplaceBlobsFeature';
import { OreFeature } from './config/OreFeature';
import { ProbabilityFeature } from './config/ProbabilityFeature';
import { RandomBooleanFeature } from './config/RandomBooleanFeature';
import { RandomFeature } from './config/RandomFeature';
import { RandomPatchFeature } from './config/RandomPatchFeature';
import { SimpleBlockFeature } from './config/SimpleBlockFeature';
import { SimpleRandomFeature } from './config/SimpleRandomFeature';
import { SingleStateFeature } from './config/SingleStateFeature';
import { SpringFeature } from './config/SpringFeature';
import { TreeFeature } from './config/TreeFeature';
import Select from '../../ui/Select';

export const FEATURES = [
    { type: 'bamboo', default: DECORATED_BAMBOO, config: ProbabilityFeature },
    { type: 'basalt_columns', default: DECORATED_BASALT_COLUMNS, config: BasaltColumnsFeature },
    { type: 'basalt_pillar', default: DECORATED_BASALT_PILLAR },
    { type: 'block_pile', default: DECORATED_BLOCK_PILE, config: BlockPileFeature },
    { type: 'blue_ice', default: DECORATED_BLUE_ICE },
    { type: 'bonus_chest', default: DECORATED_BONUS_CHEST },
    { type: 'chorus_plant', default: DECORATED_CHORUS_PLANT },
    { type: 'coral_claw', default: DECORATED_CORAL_CLAW },
    { type: 'coral_mushroom', default: DECORATED_CORAL_MUSHROOM },
    { type: 'coral_tree', default: DECORATED_CORAL_TREE },
    { type: 'delta_feature', default: DECORATED_DELTA_FEATURE, config: DeltaFeature },
    { type: 'desert_well', default: DECORATED_DESERT_WELL },
    { type: 'disk', default: DECORATED_DISK, config: DiskFeature },
    { type: 'emerald_ore', default: DECORATED_EMERALD_ORE, config: EmeraldOreFeature },
    { type: 'end_gateway', default: DECORATED_END_GATEWAY, config: EndGatewayFeature },
    { type: 'end_island', default: DECORATED_END_ISLAND },
    { type: 'end_spike', default: DECORATED_END_SPIKE, config: EndSpikeFeature },
    { type: 'fill_layer', default: DECORATED_FILL_LAYER, config: FillLayerFeature },
    { type: 'flower', default: DECORATED_FLOWER, config: RandomPatchFeature },
    { type: 'forest_rock', default: DECORATED_FOREST_ROCK, config: SingleStateFeature },
    { type: 'fossil', default: DECORATED_FOSSIL },
    { type: 'freeze_top_layer', default: DECORATED_FREEZE_TOP_LAYER },
    { type: 'glowstone_blob', default: DECORATED_GLOWSTONE_BLOB },
    { type: 'huge_brown_mushroom', default: DECORATED_HUGE_BROWN_MUSHROOM, config: HugeMushroomFeature },
    { type: 'huge_fungus', default: DECORATED_HUGE_FUNGUS, config: HugeFungusFeature },
    { type: 'huge_red_mushroom', default: DECORATED_HUGE_RED_MUSHROOM, config: HugeMushroomFeature },
    { type: 'ice_patch', default: DECORATED_ICE_PATCH, config: DiskFeature },
    { type: 'ice_spike', default: DECORATED_ICE_SPIKE },
    { type: 'iceberg', default: DECORATED_ICEBERG, config: SingleStateFeature },
    { type: 'kelp', default: DECORATED_KELP },
    { type: 'lake', default: DECORATED_LAKE, config: SingleStateFeature },
    { type: 'monster_room', default: DECORATED_MONSTER_ROOM },
    { type: 'nether_forest_vegetation', default: DECORATED_NETHER_FOREST_VEGETATION, config: BlockPileFeature },
    { type: 'netherrack_replace_blobs', default: DECORATED_NETHERRACK_REPLACE_BLOBS, config: NetherrackReplaceBlobsFeature },
    { type: 'no_bonemeal_flower', default: DECORATED_NO_BONEMEAL_FLOWER, config: RandomPatchFeature },
    { type: 'no_surface_ore', default: DECORATED_NO_SURFACE_ORE, config: OreFeature },
    { type: 'no_op', default: DECORATED_NO_OP },
    { type: 'ore', default: DECORATED_ORE, config: OreFeature },
    { type: 'random_boolean_selector', default: DECORATED_RANDOM_BOOLEAN_SELECTOR, config: RandomBooleanFeature },
    { type: 'random_patch', default: DECORATED_RANDOM_PATCH, config: RandomPatchFeature },
    { type: 'random_selector', default: DECORATED_RANDOM_SELECTOR, config: RandomFeature },
    { type: 'sea_pickle', default: DECORATED_SEA_PICKLE, config: CountFeature },
    { type: 'seagrass', default: DECORATED_SEAGRASS, config: ProbabilityFeature },
    { type: 'simple_block', default: DECORATED_SIMPLE_BLOCK, config: SimpleBlockFeature },
    { type: 'simple_random_selector', default: DECORATED_SIMPLE_RANDOM_SELECTOR, config: SimpleRandomFeature },
    { type: 'spring_feature', default: DECORATED_SPRING_FEATURE, config: SpringFeature },
    { type: 'tree', default: DECORATED_TREE, config: TreeFeature },
    { type: 'twisting_vines', default: DECORATED_TWISTING_VINES },
    { type: 'vines', default: DECORATED_VINES },
    { type: 'void_start_platform', default: DECORATED_VOID_START_PLATFORM },
    { type: 'weeping_vines', default: DECORATED_WEEPING_VINES }
].map(feature => {
    feature.type = 'minecraft:' + feature.type;
    return feature;
});

export const FEATURES_OPTIONS = FEATURES
    .map(feature => ({ value: feature.type, label: capitalize(feature.type.substr(10).replace(/_/g, ' ')) }));
FEATURES_OPTIONS.push({ value: 'minecraft:decorated', label: 'Decorated' });

export function FeatureConfig({ type, ...props }) {
    const Tag = (FEATURES.find(f => type === f.type) || { config: 'p' }).config || (() => <p className="text-muted">No config options</p>);
    return <Tag {...{type, ...props}}>Unknown feature type (<code>{type}</code>).</Tag>;
}

export function RawConfiguredFeature({ data = DECORATED_TREE, onSave }) {

    const [decorators_, feature_] = useMemo(() => findDecorators(data), [data]);

    const [feature, setFeature] = useState(feature_);
    const [decorators, setDecorators] = useState(decorators_);

    const handleSelectChange = useCallback(function (option) {
        let def = DECORATED_DECORATED;
        if (option.value !== 'minecraft:decorated') {
            def = FEATURES.find(feature => option.value === feature.type).default;
        }
        const [decorators, feature] = findDecorators(def);
        setFeature(feature);
        setDecorators(decorators);
    }, []);

    const handleFeatureChange = useCallback(function (config) {
        setFeature(feature => ({ ...feature, config }));
    }, []);
    const handleDecoratedChange = useCallback(function (feature) {
        setFeature(feature);
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

    let selected;
    if (typeof feature === 'string') {
        selected = FEATURES_OPTIONS.find(f => f.value === 'minecraft:decorated');
    } else {
        selected = FEATURES_OPTIONS.find(o => o.value === feature.type);
    }

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="concrete_tree" type="features" value={data.key} expectBreakage={typeof data.key !== 'undefined'} onSelectLoad={handleVanillaSelect}>
            configured feature
            <JsonViewer data={() => buildDecorated(feature, decorators, data.key || 'feature')} />
        </NamespacedKey>
        <div className="form-group">
            <label htmlFor="type">Type</label>
            <Select options={FEATURES_OPTIONS} value={selected || null} onChange={handleSelectChange} inputId="type" />
        </div>
        <hr />
        {typeof feature === 'string' ?
            <DecoratedFeature feature={feature} onChange={handleDecoratedChange} />
            : <FeatureConfig type={feature.type} configuration={feature.config} onChange={handleFeatureChange} />
        }
        <DecoratorsList data={decorators} key={feature.type} onChange={handleDecoratorsChange} />
        <Button type="submit">Save</Button>
    </form>
}

export default RawConfiguredFeature;

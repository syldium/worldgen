import { ConfInput, NumberInput } from '../../ui/Input';
import React, { useCallback, useState } from 'react';

import { BIOME_DEFAULTS } from './BiomeDefaults';
import { BiomeEffects } from './BiomeEffects';
import { BiomeSpawners } from './BiomeSpawners';
import { BiomeStarts } from './BiomeStarts';
import { Button } from '../../ui/Button';
import { ConfiguredCarver } from '../carver/ConfiguredCarver';
import { GenFeatures } from './Features';
import { INT_MIN_VALUE } from '../../utils/math';
import { JsonViewer } from '../../ui/JsonViewer';
import { NamespacedKey } from '../NamespacedKey';
import { useKeyedListOptions } from '../../hooks/context';
import Select from '../../ui/Select';

export function Biome({data = BIOME_DEFAULTS, onSave}) {

    const [state, setState] = useState(data);

    const handleCarversChange = useCallback(function(carvers) {
        setState(state => ({ ...state, carvers }));
    }, []);
    const handleStartsChange = useCallback(function(starts) {
        setState(state => ({ ...state, starts }));
    }, []);
    const handleEffectsChange = useCallback(function(effects) {
        setState(state => ({ ...state, effects }));
    }, []);
    const handleFeaturesChange = useCallback(function(features) {
        setState(state => ({ ...state, features }));
    }, []);
    const handleSpawnersChange = useCallback(function(spawners) {
        setState(state => ({ ...state, spawners }));
    }, []);
    const handleSurfaceBuilderChange = useCallback(function(option) {
        setState(state => ({ ...state, surface_builder: option.value }));
    }, []);
    const handlePrecipitationChange = useCallback(function(option) {
        setState(state => ({ ...state, precipitation: option.value }));
    }, []);
    const handleCategoryChange = useCallback(function(option) {
        setState(state => ({ ...state, category: option.value }));
    }, []);
    const handleChange = useCallback(function(value) {
        setState(state => ({ ...state, ...value }));
    }, []);
    const handleSpawnFriendlyChange = useCallback(function(e) {
        const player_spawn_friendly = e.target.checked;
        setState(state => ({ ...state, player_spawn_friendly }));
    }, []);

    const handleSubmit = useCallback(function(e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        onSave({ ...state, ...formData });
    }, [onSave, state]);

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="arctic" type="biomes" value={state.key} expectBreakage={typeof data.key !== 'undefined'} onSelectLoad={setState}>
            biome
            <JsonViewer data={state} />
        </NamespacedKey>

        <BiomeEffects effects={state.effects} onChange={handleEffectsChange} />

        <fieldset>
            <BiomeCategory category={state.category} onChange={handleCategoryChange} />
            <BiomePrecipitation value={state.precipitation} onChange={handlePrecipitationChange} />
        </fieldset>

        <fieldset>
            <legend>Generation</legend>
            <SurfaceBuilder value={state.surface_builder} onChange={handleSurfaceBuilderChange} />
            <BiomeStarts starts={state.starts} onChange={handleStartsChange} />
            <GenFeatures features={state.features} onChange={handleFeaturesChange} />
        </fieldset>

        <ConfiguredCarver carvers={state.carvers} onChange={handleCarversChange} />

        <fieldset>
            <legend>Creatures</legend>
            <BiomeSpawners data={state.spawners} onChange={handleSpawnersChange} />
        </fieldset>

        <fieldset>
            <legend>Settings</legend>
            <div className="form-group form-row">
                <ConfInput id="player_spawn_friendly" checked={typeof state.player_spawn_friendly === 'boolean' ? state.player_spawn_friendly : true} onChange={handleSpawnFriendlyChange}>Player spawn friendly</ConfInput>
                <NumberInput id="creature_spawn_probability" value={state.creature_spawn_probability} defaultValue={0.1} step={0.1} required={false} upChange={handleChange}>Creature spawn probability</NumberInput>
            </div>
            <div className="form-group form-row">
                <NumberInput id="scale" value={state.scale || 0.05} min={INT_MIN_VALUE} step={0.05} upChange={handleChange}>Scale</NumberInput>
                <NumberInput id="downfall" value={state.downfall || 0.4} min={INT_MIN_VALUE} step={0.1} upChange={handleChange}>Downfall</NumberInput>
                <NumberInput id="depth" value={state.depth || 0.12} min={INT_MIN_VALUE} step={0.01} upChange={handleChange}>Depth</NumberInput>
                <NumberInput id="temperature" value={state.temperature || 0.8} min={INT_MIN_VALUE} step={0.1} upChange={handleChange}>Temperature</NumberInput>
                <p className="mts"><small className="text-muted">The <em>scale</em> parameter defines terrain amplitude, <em>downfall</em> controls grass and foliage color, <em>depth</em> is the difference from sea level, <em>temperature</em> controls some gameplay features like whether snow golems take damage. The default values are those of the plains biome.</small></p>
            </div>
        </fieldset>
        <Button type="submit">Save</Button>
    </form>;
}

const BiomeCategory = React.memo(function({ category = 'plains', onChange }) {

    const options = [
        { value: 'beach', label: 'Beach' },
        { value: 'desert', label: 'Desert' },
        { value: 'extreme_hills', label: 'Extreme hills' },
        { value: 'forest', label: 'Forest' },
        { value: 'icy', label: 'Icy' },
        { value: 'jungle', label: 'Jungle' },
        { value: 'mesa', label: 'Mesa' },
        { value: 'nether', label: 'Nether' },
        { value: 'none', label: 'None' },
        { value: 'ocean', label: 'Ocean' },
        { value: 'plains', label: 'Plains' },
        { value: 'river', label: 'River' },
        { value: 'savanna', label: 'Savanna' },
        { value: 'swamp', label: 'Swamp' },
        { value: 'taiga', label: 'Taiga' },
        { value: 'the_end', label: 'The end' },
    ];

    return <div className="form-group">
        <label htmlFor="category">Category</label>
        <Select options={options} value={options.find(o => o.value === category)} onChange={onChange} />
    </div>;
});

const BiomePrecipitation = React.memo(function({ onChange, value = 'rain' }) {

    const options = [
        { value: 'none', label: 'None' },
        { value: 'rain', label: 'Rain' },
        { value: 'snow', label: 'Snow' }
    ];

    return <div className="form-group">
        <label htmlFor="precipitation">Precipitation</label>
        <Select options={options} value={options.find(o => o.value === value)} onChange={onChange} />
    </div>;
});

const SurfaceBuilder = React.memo(function({ onChange, value = 'minecraft:grass' }) {
    const options = useKeyedListOptions('surfaces');
    return <div className="form-group">
        <label htmlFor="surface_builder">Surface builder</label>
        <Select options={options} value={options.find(o => o.value === value)} onChange={onChange} />
    </div>;
});

export default Biome;

import React, { useCallback, useState } from 'react';
import Select from '../../ui/Select';
import { Button } from '../../ui/Button';
import { NamespacedKey } from '../NamespacedKey';
import { BiomeEffects } from './BiomeEffects';
import { BiomeSpawners } from './BiomeSpawners';
import { BiomeStarts } from './BiomeStarts';
import { GenFeatures } from './Features';
import { useKeyedListOptions } from '../../hooks/context';
import { ConfInput } from '../../ui/Input';
import { BIOME_DEFAULTS } from './BiomeDefaults';

export function Biome({data = BIOME_DEFAULTS, onSave}) {

    const [state, setState] = useState(data);

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

    const handleSubmit = useCallback(function(e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        const data = { ...state, ...formData };
        data.spawn_costs = {};
        Object.keys(formData).forEach(function(key) {
            if (!isNaN(formData[key])) {
                data[key] = parseFloat(formData[key]);
            }
        });
        onSave(data);
    }, [onSave, state]);

    return <form onSubmit={handleSubmit}>
        <h3>Edit biome</h3>
        <NamespacedKey example="arctic" type="biomes" value={state.key} expectBreakage={typeof data.key !== 'undefined'} />

        <BiomeEffects effects={state.effects} onChange={handleEffectsChange} />

        <fieldset>
            <BiomeCategory category={state.category} />
            <BiomePrecipitation value={state.precipitation} />
        </fieldset>

        <fieldset>
            <legend>Generation</legend>
            <SurfaceBuilder value={state.surface_builder} />
            <BiomeStarts onChange={handleStartsChange} starts={state.starts} />
            <GenFeatures features={state.features} onChange={handleFeaturesChange} />
        </fieldset>

        <fieldset>
            <legend>Creatures</legend>
            <BiomeSpawners data={state.spawners} onChange={handleSpawnersChange} />
        </fieldset>

        <fieldset>
            <legend>Settings</legend>
            <div className="form-group form-row">
                <ConfInput name="scale" defaultValue={data.scale || 0.05} step={0.05}>Scale</ConfInput>
                <ConfInput name="downfall" defaultValue={data.downfall || 0.4} step={0.1}>Downfall</ConfInput>
                <ConfInput name="depth" defaultValue={data.depth || 0.12} step={0.01}>Depth</ConfInput>
                <ConfInput name="temperature" defaultValue={data.temperature || 0.8} step={0.1}>Temperature</ConfInput>
                <p className="mts"><small className="text-muted">The <em>scale</em> parameter defines terrain amplitude, <em>downfall</em> controls grass and foliage color, <em>depth</em> is the difference from sea level, <em>temperature</em> controls some gameplay features like whether snow golems take damage. The default values are those of the plains biome.</small></p>
            </div>
        </fieldset>
        <Button type="submit">Save</Button>
    </form>;
}

const BiomeCategory = React.memo(function({category = 'plains'}) {

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
        <Select options={options} defaultValue={options.find(o => o.value === category)} name="category" />
    </div>;
});

const BiomePrecipitation = React.memo(function({value = 'rain'}) {

    const options = [
        { value: 'none', label: 'None' },
        { value: 'rain', label: 'Rain' },
        { value: 'snow', label: 'Snow' }
    ];

    return <div className="form-group">
        <label htmlFor="precipitation">Precipitation</label>
        <Select options={options} defaultValue={options.find(o => o.value === value)} name="precipitation" />
    </div>;
});

const SurfaceBuilder = React.memo(function({value = 'minecraft:grass'}) {
    const options = useKeyedListOptions('surfaces');
    return <div className="form-group">
        <label htmlFor="surface_builder">Surface builder</label>
        <Select options={options} defaultValue={options.find(o => o.value === value)} name="surface_builder" />
    </div>;
});

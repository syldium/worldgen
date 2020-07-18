import React, { useCallback, useState } from 'react';
import BiomeStarts from './BiomeStarts';
import Select from 'react-select';
import { Button } from '../../ui/Button';
import { BiomeSpawners } from './BiomeSpawners';
import { STARTS } from './BiomeDefaults';
import GenFeatures from './Features';
import { hexColorToInteger, integerColorToHex } from '../../utils/color';
import { BiomeEffects } from './BiomeEffects';
import { useKeyedListOptions } from '../../hooks/context';

export function Biome({data = {}, onSave}) {

    const [state, setState] = useState(data || { starts: STARTS, spawners: []});

    const handleStartsChange = useCallback(function(starts) {
        setState(state => {
            state.starts = starts;
            return state;
        });
    }, []);

    const handleEffectsChange = useCallback(function(effects) {
        setState(state => {
            state.effects = effects;
            return state;
        });
    }, []);

    const handleFeaturesChange = useCallback(function(features) {
        setState(state => {
            state.features = features;
            return state;
        });
    }, []);

    const handleSpawnersChange = useCallback(function(spawners) {
        setState(state => {
            state.spawners = spawners;
            return state;
        });
    }, []);

    const handleSubmit = useCallback(function(e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        const data = { ...formData, ...state };
        data.spawn_costs = {};
        data.carvers =  {
            air: [
              "minecraft:cave",
              "minecraft:canyon"
            ]
        }; // @todo
        data.sky_color = hexColorToInteger(formData.sky_color);
        Object.keys(formData).forEach(function(key) {
            if (!isNaN(formData[key])) {
                data[key] = parseFloat(formData[key]);
            }
        });
        onSave(data);
    }, [onSave, state]);

    return <form onSubmit={handleSubmit}>
        <h3>Edit biome</h3>
        <div className="form-group">
            <label htmlFor="key">Identifier</label> : <input type="text" name="key" id="key" required pattern="[a-z0-9._-]+" placeholder="Ex. : my-biome" defaultValue={data.key} />
        </div>

        <fieldset>
            <legend>Colors</legend>
            <div className="form-row">
                <div className="form-inline"><label htmlFor="sky_color">Sky color</label> : <input type="color" name="sky_color" required defaultValue={integerColorToHex(data.sky_color || 7907327)} /></div>
                <BiomeEffects effects={state.effects} onChange={handleEffectsChange} />
            </div>
        </fieldset>

        <fieldset>
            <BiomeCategory category={data.category} />
            <BiomePrecipitation value={data.precipitation} />
        </fieldset>

        <fieldset>
            <legend>Generation</legend>
            <SurfaceBuilder value={data.surface_builder} />
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
                <div><label htmlFor="scale">Scale</label> : <input type="number" name="scale" step="0.05" required defaultValue={data.scale || 0.05} /></div>
                <div><label htmlFor="downfall">Downfall</label> : <input type="number" name="downfall" step="0.1" required defaultValue={data.downfall || 0.4} /></div>
                <div><label htmlFor="depth">Depth</label> : <input type="number" name="depth" step="0.01" required defaultValue={data.depth || 0.12} /></div>
                <div><label htmlFor="temperature">Temperature</label> : <input type="number" name="temperature" step="0.1" required defaultValue={data.temperature || 0.8} /></div>
                <p className="mts"><small className="text-muted">The <em>scale</em> parameter defines terrain amplitude, <em>downfall</em> controls grass and foliage color, <em>depth</em> is the difference from sea level, <em>temperature</em> controls some gameplay features like whether snow golems take damage. The default values are those of the plains biome.</small></p>
            </div>
        </fieldset>
        <div className="form-group mlm mbm">
            <Button type="submit">Save</Button>
        </div>
    </form>;
}

function BiomeCategory({category = 'plains'}) {

    const options = [
        { value: 'beach', label: 'Beach' },
        { value: 'desert', label: 'Desert' },
        { value: 'extreme_hills', label: 'Extreme hills' },
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
}

function BiomePrecipitation({value = 'rain'}) {

    const options = [
        { value: 'none', label: 'None' },
        { value: 'rain', label: 'Rain' },
        { value: 'snow', label: 'Snow' }
    ];

    return <div className="form-group">
        <label htmlFor="precipitation">Precipitation</label>
        <Select options={options} defaultValue={options.find(o => o.value === value)} name="precipitation" />
    </div>;
}

function SurfaceBuilder({value = 'minecraft:grass'}) {
    const options = useKeyedListOptions('surfaces');
    return <div className="form-group">
        <label htmlFor="surface_builder">Surface builder</label>
        <Select options={options} defaultValue={options.find(o => o.value === value)} name="surface_builder" />
    </div>;
}
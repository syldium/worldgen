import React, { useContext, useState } from 'react';
import { DataContext } from '../../context/DataContext';
import Select from 'react-select';
import { SeedField } from './DimensionGenerator';

export function FixedBiomeSource({source, onChange}) {
    const context = useContext(DataContext);
    const options = context.custom.biomes.map(biome => ({ value: context.namespace + ':' + biome.key, label: '(Custom) ' + biome.key }));

    const [state, setState] = useState(source);

    context.vanilla.biomes.forEach(biome => {
        options.push({ value: 'minecraft:' + biome.name, label: biome.displayName });
    });

    const handleSeedChange = function(seed) {
        setState(s => {
            s.seed = seed;
            return s;
        });
        onChange(state);
    } 

    const handleBiomeChange = function(biome) {
        setState(s => {
            s.biome = biome.value;
            return s;
        });
        onChange(state);
    }
    
    return <div className="mtm">
        <h5>Fixed biome source</h5>
        <p className="help"><small className="text-muted">Note that there are other types of biome sources and generators, but this generator is still a WIP.</small></p>
        <SeedField value={state.seed} onChange={handleSeedChange} />
        <div className="form-group">
            <label htmlFor="fixed-biome">Biome</label><Select options={options} defaultValue={options.find(o => o.value === state.biome)} onChange={handleBiomeChange} />
        </div>
    </div>;
}
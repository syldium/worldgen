import React, { useState, useCallback, useContext, useEffect } from 'react';
import Select from 'react-select';
import { SeedField } from './DimensionGenerator';
import { useKeyedListOptions } from '../../hooks/context';
import { useMemo } from 'react';
import { useCrud, CRUD } from '../../hooks/form';
import { useToggle } from '../../hooks/ui';
import { DataContext } from '../../context/DataContext';
import { Button } from '../../ui/Button';
import { hasDuplicatedObjects } from '../../utils/data';

export function BiomeSource({biome_source = { type: 'minecraft:fixed' }, onChange}) {
    const [source, setSource] = useState(biome_source);

    const options = useMemo(function() {
        return [
            { value: 'minecraft:fixed', label: 'Fixed' },
            { value: 'minecraft:multi_noise', label: 'Multi noise' },
        ];
    }, []);

    const handleSeedChange = useCallback(function(seed) {
        setSource(source => ({ ...source, seed }));
    }, []);
    const handleTypeChange = useCallback(function(option) {
        setSource(source => ({ type: option.value, seed: source.seed }));
    }, []);
    const handleFixedSourceChange = useCallback(function(biome) {
        setSource(source => ({ ...source, biome }));
    }, []);
    const handleMultiSourceChange = useCallback(function(biomes) {
        setSource(source => ({ ...source, biomes }));
    }, []);

    useEffect(() => onChange(source), [onChange, source]);

    const selected = useMemo(function() {
        return options.find(o => o.value === source.type);
    }, [options, source.type]);

    return <fieldset>
        <legend>Biome source</legend>
        <div className="form-group">
            <label htmlFor="biome-source-type">Type</label><Select id="biome-source-type" options={options} value={selected} onChange={handleTypeChange} />
        </div>
        <SeedField value={source.seed} onChange={handleSeedChange} />
        <hr />
        {source.type === 'minecraft:fixed' && <FixedBiomeSource source={source.biome} onChange={handleFixedSourceChange} />}
        {source.type === 'minecraft:multi_noise' && <MultiNoiseBiomeSource source={source.biomes} onChange={handleMultiSourceChange} />}
    </fieldset>
}

const FixedBiomeSource = React.memo(function({source = 'minecraft:plains', onChange}) {
    const options = useKeyedListOptions('biomes');
    const [biome, setBiome] = useState(source);

    const handleBiomeChange = function(biome) {
        setBiome(biome.value);
    }
    useEffect(() => onChange(biome), [biome, onChange]);
    
    return <div className="form-group">
        <label htmlFor="fixed-biome">Biome</label><Select options={options} defaultValue={options.find(o => o.value === biome)} onChange={handleBiomeChange} />
    </div>;
});

const MultiNoiseBiomeSource = React.memo(function({source, onChange}) {
    const options = useKeyedListOptions('biomes');
    const [biomes, dispatch] = useCrud(source);
    const [parametersWarning, toggleWarningVisibility] = useToggle();

    const handleAddClick = useCallback(function(e) {
        e.preventDefault();
        dispatch({ type: CRUD.ADD, payload: { biome: 'minecraft:plains', parameters: {} } });
    }, [dispatch]);
    const handleChange = useCallback(function(state, previous) {
        dispatch({ type: CRUD.UPDATE, target: previous, payload: state });
    }, [dispatch]);
    const handleDeleteClick = useCallback(function(e, index) {
        e.preventDefault();
        dispatch({ type: CRUD.REMOVE, payload: biomes[index] });
    }, [biomes, dispatch]);

    const vanilla = useContext(DataContext).vanilla.biomes;
    const custom = useContext(DataContext).custom.biomes;
    const namespace = useContext(DataContext).namespace;
    useEffect(function() {
        const hasDuplicated = hasDuplicatedObjects(biomes.map(biome => biome.parameters));
        onChange(biomes);
        if (hasDuplicated && !parametersWarning) {
            toggleWarningVisibility();
        } else if (!hasDuplicated && parametersWarning) {
            toggleWarningVisibility();
        }
    }, [biomes, onChange, parametersWarning, toggleWarningVisibility]);

    const values = [];
    biomes.forEach((entry, i) => {
        const key = i;
        values.push(<BiomeSelection namespace={namespace} vanilla={vanilla} custom={custom} biomesOptions={options} entry={entry} key={key} onChange={handleChange}><Button cat="danger" onClick={(e) => handleDeleteClick(e, i)}>Delete</Button></BiomeSelection>);
    });
    return <div className="form-group">
        {values}
        <Button onClick={handleAddClick}>Add biome</Button>
        {parametersWarning && <p className="alert--warning">Warning: every biome must have a unique combination of parameters!</p>}
    </div>;
});

const BiomeSelection = React.memo(function({namespace, vanilla, custom, biomesOptions, entry, onChange, children}) {
    const [selection, setSelection] = useState(entry);

    const handleBiomeChange = useCallback(function(option) {
        const biome = option.value;
        const data = (vanilla.find(b => 'minecraft:' + b.name === biome) || custom.find(b => namespace + ':' + b.key === biome) || { rainfall: 0, temperature: 0 });
        setSelection(selection => {
            const parameters = {
                altitude: selection.parameters.altitude || 0,
                weirdness: selection.parameters.weirdness || 0,
                offset: selection.parameters.offset || 0,
                temperature: data.temperature,
                humidity: data.rainfall || 0
            };
            return { biome, parameters };
        });
    }, [custom, namespace, vanilla]);

    const handleParameterChange = useCallback(function(e) {
        const name = e.target.id;
        const value = e.target.value;
        setSelection(selection => {
            const parameters = { ...selection.parameters, [name]: parseFloat(value) };
            return { biome: selection.biome, parameters };
        });
    }, []);

    useEffect(() => onChange(selection, entry), [entry, onChange, selection]);

    const selected = useMemo(function() {
        return biomesOptions.find(o => o.value === selection.biome);
    }, [biomesOptions, selection.biome]);
    return <div className="form-group">
        <Select options={biomesOptions} value={selected} onChange={handleBiomeChange} />
        <div className="form-group form-row">
            <div><label>Altitude</label> : <input type="number" id="altitude" value={selection.parameters.altitude || 0} onChange={handleParameterChange} step="0.1" /></div>
            <div><label>Weirdness</label> : <input type="number" id="weirdness" value={selection.parameters.weirdness || 0} onChange={handleParameterChange} step="0.1" /></div>
            <div><label>Offset</label> : <input type="number" id="offset" value={selection.parameters.offset || 0} onChange={handleParameterChange} step="0.1" /></div>
            <div><label>Temperature</label> : <input type="number" id="temperature" value={selection.parameters.temperature || 0.8} onChange={handleParameterChange} step="0.1" /></div>
            <div><label>Humidity</label> : <input type="number" id="humidity" value={selection.parameters.humidity || 0.4} onChange={handleParameterChange} step="0.1" /></div>
            {children}
        </div>
    </div>
});
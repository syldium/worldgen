import React, { useState, useCallback, useContext, useEffect } from 'react';
import Select from '../../ui/Select';
import { SeedField } from './DimensionGenerator';
import { useKeyedListOptions } from '../../hooks/context';
import { useMemo } from 'react';
import { useCrud, CRUD, useNumber, useKeyedOptionsState } from '../../hooks/form';
import { useToggle } from '../../hooks/ui';
import { DataContext } from '../../context/DataContext';
import { Button } from '../../ui/Button';
import { capitalize, hasDuplicatedObjects } from '../../utils/data';
import { NumberList } from '../../ui/NumberList';
import { MULTI_NOISE_BIOME_SOURCE, NOISES_NAMES } from './DimensionDefaults';
import { NumberInput } from '../../ui/Input';

export function BiomeSource({biome_source = { type: 'minecraft:fixed' }, onChange}) {
    const [source, setSource] = useState(biome_source);

    const options = useMemo(function() {
        return [
            { value: 'minecraft:checkerboard', label: 'Checkerboard' },
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
    const handleCheckerboardSourceChange = useCallback(function(settings) {
        setSource(source => ({ ...source, ...settings }));
    }, []);
    const handleFixedSourceChange = useCallback(function(biome) {
        setSource(source => ({ ...source, biome }));
    }, []);
    const handleMultiSourceChange = useCallback(function(s) {
        setSource(source => ({ ...source, ...s }));
    }, []);

    useEffect(() => onChange(source), [onChange, source]);

    const selected = useMemo(function() {
        return options.find(o => o.value === source.type);
    }, [options, source.type]);

    return <fieldset>
        <legend>Biome source</legend>
        <div className="form-group">
            <label htmlFor="biome-source-type">Type</label><Select inputId="biome-source-type" options={options} value={selected} onChange={handleTypeChange} />
        </div>
        <SeedField value={source.seed} onChange={handleSeedChange} />
        <hr />
        {source.type === 'minecraft:checkerboard' && <CheckerboardBiomeSource source={source} onChange={handleCheckerboardSourceChange} />}
        {source.type === 'minecraft:fixed' && <FixedBiomeSource source={source.biome} onChange={handleFixedSourceChange} />}
        {source.type === 'minecraft:multi_noise' && <MultiNoiseBiomeSource source={source} onChange={handleMultiSourceChange} />}
    </fieldset>
}

const CheckerboardBiomeSource = React.memo(function({source, onChange}) {
    const [options, biomes, setBiomes] = useKeyedOptionsState('biomes', source.biomes, true);
    const [scale, setScale] = useNumber(source.scale);

    useEffect(() => onChange({ biomes, scale }), [biomes, onChange, scale]);

    return <div className="form-group">
        <div className="form-group">
            <label htmlFor="biomes">Biomes</label><Select options={options} isMulti isClearable={false} value={options.filter(o => biomes.includes(o.value))} onChange={setBiomes} id="biomes" />
        </div>
        <div className="form-group">
            <NumberInput id="scale" value={scale} onChange={setScale}>Scale (squares of 2<sup>scale</sup> chunks)</NumberInput>
        </div>
        {biomes.length < 1 && <p className="alert--warning">Warning: a dimension must contain at least one biome!</p>}
    </div>;
});

const FixedBiomeSource = React.memo(function({source = 'minecraft:plains', onChange}) {
    const [options, biome, setBiome] = useKeyedOptionsState('biomes', source);
    useEffect(() => onChange(biome), [biome, onChange]);

    return <div className="form-group">
        <label htmlFor="fixed-biome">Biome</label><Select options={options} value={options.find(o => o.value === biome)} onChange={setBiome} />
    </div>;
});

const MultiNoiseBiomeSource = React.memo(function({source = MULTI_NOISE_BIOME_SOURCE, onChange}) {
    const options = useKeyedListOptions('biomes');
    const [biomes, dispatch] = useCrud(source.biomes);

    const [advanced, toggleAdvanced] = useToggle();
    const handleNoiseChange = useCallback(function(type, noise) {
        onChange(({ ...source, [type]: noise }));
    }, [source, onChange]);

    const handleAddClick = useCallback(function(e) {
        e.preventDefault();
        dispatch({ type: CRUD.ADD, payload: { biome: 'minecraft:plains', parameters: {
            altitude: 0,
            weirdness: 0,
            offset: 0,
            temperature: 0.8,
            humidity: 0.4
        } } });
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
        for (const noise of NOISES_NAMES) {
            if (typeof source[noise] === 'undefined') {
                onChange({ ...MULTI_NOISE_BIOME_SOURCE, ...source, biomes });
                return;
            }
        }
        if (biomes !== source.biomes) {
            onChange({ ...source, biomes });
        }
    }, [biomes, onChange, source]);

    const values = [];
    biomes.forEach((entry, i) => {
        const key = i;
        values.push(<BiomeSelection namespace={namespace} vanilla={vanilla} custom={custom} biomesOptions={options} entry={entry} key={key} onChange={handleChange}><Button cat="danger" onClick={(e) => handleDeleteClick(e, i)}>Delete</Button></BiomeSelection>);
    });
    return <>
        <div className="flex-container" style={{ alignItems: 'baseline' }}>
            <h4>
                Biomes list
                <Button onClick={handleAddClick} cat="primary mls">Add biome</Button>
                <Button onClick={toggleAdvanced} cat="secondary">Advanced</Button>
            </h4>
        </div>
        {advanced && <div className="grid-2-small-1 has-gutter mbm">
            {NOISES_NAMES
                .map(noise => <PerlinNoiseParameters
                    key={noise}
                    noise={source[noise] || MULTI_NOISE_BIOME_SOURCE[noise]}
                    onChange={(n) => handleNoiseChange(noise, n)}>{capitalize(noise.replace('_', ' '))}</PerlinNoiseParameters>)}
        </div>}
        {values}
        {hasDuplicatedObjects(biomes.map(biome => biome.parameters)) && <p className="alert--warning">Warning: every biome must have a unique combination of parameters!</p>}
    </>;
});

const PerlinNoiseParameters = React.memo(function({children, noise = { firstOctave: -7, amplitudes: [1, 1] }, onChange}) {

    const handleFirstOctaveChange = useCallback(function(firstOctave) {
        onChange({ ...noise, firstOctave });
    }, [noise, onChange]);
    const handleAmplitudesChange = useCallback(function(amplitudes) {
        onChange({ ...noise, amplitudes });
    }, [noise, onChange]);

    return <fieldset style={{ margin: 0 }}>
        <legend>{children}</legend>
        <div className="form-group form-row">
            <NumberInput id="firstOctave" value={noise.firstOctave} onChange={handleFirstOctaveChange} min={-1000}>First octave</NumberInput>
            <NumberList numbers={noise.amplitudes} onChange={handleAmplitudesChange}>Amplitudes</NumberList>
        </div>
    </fieldset>;
});

const BiomeSelection = React.memo(function({namespace, vanilla, custom, biomesOptions, entry, onChange, children}) {
    const handleBiomeChange = useCallback(function(option) {
        const biome = option.value;
        const data = (vanilla.find(b => 'minecraft:' + b.name === biome) || custom.find(b => namespace + ':' + b.key === biome) || { rainfall: 0, temperature: 0 });
        const parameters = {
            altitude: entry.parameters.altitude || 0,
            weirdness: entry.parameters.weirdness || 0,
            offset: entry.parameters.offset || 0,
            temperature: data.temperature || 0.8,
            humidity: data.rainfall || 0.4
        };
        onChange({ biome, parameters }, entry);
    }, [entry, custom, namespace, onChange, vanilla]);

    const handleParameterChange = useCallback(function(value) {
        onChange({ biome: entry.biome, parameters: { ...entry.parameters, ...value } }, entry);
    }, [entry, onChange]);

    const selected = useMemo(function() {
        return biomesOptions.find(o => o.value === entry.biome);
    }, [biomesOptions, entry.biome]);
    return <div className="form-group">
        <Select options={biomesOptions} value={selected} onChange={handleBiomeChange} />
        <div className="form-group form-row">
            <NumberInput id="altitude" value={entry.parameters.altitude} upChange={handleParameterChange} step="0.1" min="-2" max="2">Altitude</NumberInput>
            <NumberInput id="weirdness" value={entry.parameters.weirdness} upChange={handleParameterChange} step="0.1" min="-2" max="2">Weirdness</NumberInput>
            <NumberInput id="offset" value={entry.parameters.offset} upChange={handleParameterChange} step="0.1" max="1">Offset</NumberInput>
            <NumberInput id="temperature" value={entry.parameters.temperature} upChange={handleParameterChange} step="0.1" min="-2" max="2">Temperature</NumberInput>
            <NumberInput id="humidity" value={entry.parameters.humidity} upChange={handleParameterChange} step="0.1" min="-2" max="2">Humidity</NumberInput>
            {children}
        </div>
    </div>
});

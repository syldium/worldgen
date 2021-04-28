import { ConfInput, NumberInput } from '../../ui/Input';
import { MULTI_NOISE_BIOME_SOURCE, NOISES_NAMES } from './DimensionDefaults';
import { capitalize, hasDuplicatedObjects } from '../../utils/data';
import React, { useCallback, useContext, useEffect } from 'react';

import { Button } from '../../ui/Button';
import { DataContext } from '../../context/DataContext';
import { MultiNoiseRepresentation } from './MultiNoiseBiomeSource';
import { NumberList } from '../../ui/NumberList';
import { SeedField } from './DimensionGenerator';
import { useCrudPreset } from '../../hooks/form';
import { useKeyedListOptions } from '../../hooks/context';
import { useMemo } from 'react';
import { useToggle } from '../../hooks/ui';
import Select from '../../ui/Select';

export const BiomeSource = React.memo(function({source = { type: 'minecraft:fixed' }, onChange}) {

    const options = useMemo(function() {
        return [
            { value: 'minecraft:checkerboard', label: 'Checkerboard' },
            { value: 'minecraft:fixed', label: 'Fixed' },
            { value: 'minecraft:multi_noise', label: 'Multi noise' },
            { value: 'minecraft:the_end', label: 'The end' },
            { value: 'minecraft:vanilla_layered', label: 'Vanilla layered' }
        ];
    }, []);

    const handleChange = useCallback(function(settings) {
        onChange(({ ...source, ...settings }));
    }, [onChange, source]);
    const handleSeedChange = useCallback(function(seed) {
        onChange(({ ...source, seed }));
    }, [onChange, source]);
    const handleTypeChange = useCallback(function(option) {
        onChange(({ seed: source.seed, type: option.value }));
    }, [onChange, source.seed]);
    const handleFixedSourceChange = useCallback(function(biome) {
        onChange(({ ...source, biome }));
    }, [onChange, source]);

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
        {source.type === 'minecraft:checkerboard' && <CheckerboardBiomeSource source={source} onChange={handleChange} />}
        {source.type === 'minecraft:fixed' && <FixedBiomeSource biome={source.biome} onChange={handleFixedSourceChange} />}
        {source.type === 'minecraft:multi_noise' && <MultiNoiseBiomeSource source={source} onChange={handleChange} />}
        {source.type === 'minecraft:vanilla_layered' && <VanillaLayeredBiomeSource source={source} onChange={handleChange} />}
    </fieldset>
});

const CheckerboardBiomeSource = React.memo(function({source, onChange}) {
    const options = useKeyedListOptions('biomes');
    const handleBiomesChange = useCallback(function(selection) {
        onChange({ ...source, biomes: selection === null ? [] : selection.map(o => o.value) });
    }, [onChange, source]);
    const handleScaleChange = useCallback(function(scale) {
        onChange({ ...source, scale });
    }, [onChange, source]);

    const biomes = useMemo(() => source.biomes || (options.length > 0 ? [options[0].value] : []), [options, source.biomes]);
    useEffect(() => {
        if (!Array.isArray(source.biomes)) {
            onChange({ biomes, scale: source.scale || 2 });
        }
    }, [biomes, source.biomes, source.scale, onChange]);

    return <div className="form-group">
        <div className="form-group">
            <label htmlFor="biomes">Biomes</label><Select options={options} isMulti isClearable={false} value={options.filter(o => biomes.includes(o.value))} onChange={handleBiomesChange} id="biomes" />
        </div>
        <div className="form-group">
            <NumberInput id="scale" value={source.scale} onChange={handleScaleChange} max={62} required={false} defaultValue={2}>Scale (squares of 2<sup>scale</sup> chunks)</NumberInput>
        </div>
        {biomes.length < 1 && <p className="alert--warning">Warning: a dimension must contain at least one biome!</p>}
    </div>;
});

export const FixedBiomeSource = React.memo(function({biome = 'minecraft:plains', inline = false, onChange}) {
    const options = useKeyedListOptions('biomes');
    const handleBiomesChange = useCallback(function(option) {
        onChange(option.value);
    }, [onChange]);

    return <div className={inline ? 'form-row flex-grow' : 'form-group'}>
        <label htmlFor="fixed-biome">Biome{inline && ' :'}&nbsp;</label><div className={inline ? 'flex-grow' : undefined}><Select options={options} value={options.find(o => o.value === biome)} onChange={handleBiomesChange} /></div>
    </div>;
});

const MultiNoiseBiomeSource = React.memo(function({source = MULTI_NOISE_BIOME_SOURCE, onChange}) {
    const options = useKeyedListOptions('biomes');
    const [biomes, handleAdd, handleChange, handleRemove] = useCrudPreset(biomes => onChange({ ...source, biomes }), source.biomes, { biome: 'minecraft:plains', parameters: {
        altitude: 0,
        weirdness: 0,
        offset: 0,
        temperature: 0.8,
        humidity: 0.4
    } });

    const [advanced, toggleAdvanced] = useToggle();
    const handleNoiseChange = useCallback(function(type, noise) {
        onChange(({ ...source, [type]: noise }));
    }, [source, onChange]);

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
    }, [biomes, onChange, source]);

    const values = [];
    biomes.forEach((entry, i) => {
        values.push(<BiomeSelection namespace={namespace} vanilla={vanilla} custom={custom} biomesOptions={options} entry={entry} key={i} onChange={handleChange}><Button cat="danger" onClick={e => handleRemove(e, i)}>Delete</Button></BiomeSelection>);
    });
    return <>
        <div className="flex-container" style={{ alignItems: 'baseline' }}>
            <h4>
                Biomes list
                <Button onClick={handleAdd} cat="primary mls">Add biome</Button>
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
        <MultiNoiseRepresentation source={source} />
    </>;
});

const VanillaLayeredBiomeSource = React.memo(function({source, onChange}) {
    const handleLegacyBiomeToggle = useCallback(function(e) {
        onChange({ ...source, legacy_biome_init_layer: e.target.checked });
    }, [onChange, source]);
    const handleLargeBiomesToggle = useCallback(function(e) {
        onChange({ ...source, large_biomes: e.target.checked });
    }, [onChange, source]);

    return <div className="form-row">
        <ConfInput checked={source.legacy_biome_init_layer || false} onChange={handleLegacyBiomeToggle}>Legacy biome init layer</ConfInput>
        <ConfInput checked={source.large_biomes || false} onChange={handleLargeBiomesToggle}>Large biomes</ConfInput>
    </div>;
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
            <NumberList numbers={noise.amplitudes} step={0.1} onChange={handleAmplitudesChange}>Amplitudes</NumberList>
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

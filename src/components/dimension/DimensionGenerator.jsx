import { CHUNK_GENERATOR_TYPES, DIMENSION } from './DimensionDefaults';
import React, { useCallback, useEffect, useState } from 'react';

import { BiomeSource } from './BiomeSource';
import { ConfInput } from '../../ui/Input';
import { FlatChunkSettings } from './FlatChunkSettings';
import { NoiseGenerator } from '../noise/NoiseSettings';
import { hashCode } from './../../utils/hash';
import Select from '../../ui/Select';

export function DimensionGenerator({generator, onChange}) {

    const [previousGenerator, setPreviousGenerator] = useState({ type: null });

    const handleChunkGeneratorChange = useCallback(function(option) {
        if (option.value === previousGenerator.type) {
            onChange(previousGenerator);
        } else if (option.value === 'minecraft:noise') {
            onChange(DIMENSION.generator);
        } else {
            onChange({ type: option.value });
        }
        setPreviousGenerator(generator);
    }, [generator, previousGenerator, onChange]);

    const handleSeedChange = useCallback(function(seed) {
        onChange({ ...generator, seed });
    }, [generator, onChange]);
    const handleSettingsChange = useCallback(function(settings) {
        onChange({ ...generator, settings });
    }, [generator, onChange]);
    const handleBiomeSourceChange = useCallback(function(biome_source) {
        onChange({ ...generator, biome_source });
    }, [generator, onChange]);

    return <fieldset>
        <legend style={{ fontWeight: 'normal', width: '28ch', fontSize: '1.05rem' }}><Select options={CHUNK_GENERATOR_TYPES} value={CHUNK_GENERATOR_TYPES.find(o => generator.type === o.value)} onChange={handleChunkGeneratorChange} /></legend>
        <div className="form-group">
            {generator.type === 'minecraft:noise' && <>
                <SeedField value={generator.seed} onChange={handleSeedChange} />
                <NoiseGenerator settings={generator.settings} onChange={handleSettingsChange} />
                <BiomeSource source={generator.biome_source} onChange={handleBiomeSourceChange} />
            </>}
            {generator.type === 'minecraft:flat' &&
                <FlatChunkSettings settings={generator.settings} onChange={handleSettingsChange} />
            }
        </div>
    </fieldset>;
}

export const SeedField = React.memo(function({onChange, value}) {
    const [text, setText] = useState(value || 286956243);

    const handleChange = useCallback(function(e) {
        const value = e.target.value;
        setText(value);
        onChange(isNaN(value) ? hashCode(value) : parseInt(value));
    }, [onChange]);

    useEffect(() => {
        if (typeof value !== 'number') {
            onChange(286956243);
        }
    }, [onChange, value]);

    return <div className="form-group">
        <ConfInput type="text" id="seed" value={text} onChange={handleChange}>Seed</ConfInput>
    </div>
});

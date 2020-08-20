import React, { useCallback, useState } from 'react';
import { DimensionType } from './DimensionType';
import { DimensionGenerator } from './DimensionGenerator';
import { Button } from '../../ui/Button';
import { DIMENSION } from './DimensionDefaults';
import { NamespacedKey } from '../NamespacedKey';
import { JsonViewer } from '../../ui/JsonViewer';

export function Dimension({data = DIMENSION, onSave}) {

    const [state, setState] = useState(data);

    const handleTypeChange = useCallback(function(type) {
        setState(state => ({ ...state, type }));
    }, []);
    const handleGeneratorChange = useCallback(function(generator) {
        setState(state => ({ ...state, generator }));
    }, []);

    const handleVanillaSelect = function(dimension) {
        if (state.generator.type === 'minecraft:noise') {
            dimension.generator.seed = state.generator.seed;
            dimension.generator.biome_source.seed = state.generator.biome_source.seed;
        } else {
            dimension.generator.seed = 286956243;
            dimension.generator.biome_source.seed = 286956243;
        }
        setState(dimension);
    };

    const handleSubmit = useCallback(function(e) {
        e.preventDefault();
        onSave({
            ...state,
            ...Object.fromEntries(new FormData(e.target))
        });
    }, [onSave, state])

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="blue_dimension" type="dimensions" value={data.key} onSelectLoad={handleVanillaSelect}>
            dimension
            <JsonViewer data={state} />
        </NamespacedKey>
        <DimensionType type={state.type} onChange={handleTypeChange} />
        <DimensionGenerator generator={state.generator} onChange={handleGeneratorChange} />
        <Button type="submit">Save</Button>
    </form>
}
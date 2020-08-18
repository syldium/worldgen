import React, { useCallback } from 'react';
import { DimensionType } from './DimensionType';
import { DimensionGenerator } from './DimensionGenerator';
import { Button } from '../../ui/Button';
import { DIMENSION } from './DimensionDefaults';
import { NamespacedKey } from '../NamespacedKey';
import { JsonViewer } from '../../ui/JsonViewer';
import { useIndexableState } from '../../hooks/context';

export function Dimension({data = DIMENSION, onSave}) {

    const [state, setState] = useIndexableState(data);

    const handleTypeChange = useCallback(function(type) {
        setState(state => ({ ...state, type }));
    }, [setState]);
    const handleGeneratorChange = useCallback(function(generator) {
        setState(state => ({ ...state, generator }));
    }, [setState]);

    const handleVanillaSelect = useCallback(function(dimension) {
        dimension.generator.seed = state.generator.seed;
        dimension.generator.biome_source.seed = state.generator.biome_source.seed;
        setState(dimension);
    }, [setState, state.generator.seed, state.generator.biome_source.seed]);

    const handleSubmit = useCallback(function(e) {
        e.preventDefault();
        onSave({
            ...state,
            ...Object.fromEntries(new FormData(e.target))
        });
    }, [onSave, state])

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="blue_dimension" type="dimensions" value={data.key} mayReplaceVanilla={true} onSelectLoad={handleVanillaSelect}>
            dimension
            <JsonViewer data={state} />
        </NamespacedKey>
        <DimensionType type={state.type} onChange={handleTypeChange} />
        <DimensionGenerator generator={state.generator} onChange={handleGeneratorChange} />
        <Button type="submit">Save</Button>
    </form>
}
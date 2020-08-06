import React, { useCallback, useState } from 'react';
import { DimensionType } from './DimensionType';
import { DimensionGenerator } from './DimensionGenerator';
import { Button } from '../../ui/Button';
import { DIMENSION } from './DimensionDefaults';
import { NamespacedKey } from '../NamespacedKey';

export function Dimension({data = DIMENSION, onSave}) {

    const [state, setState] = useState(data);

    const handleTypeChange = useCallback(function(type) {
        setState(state => ({ ...state, type }));
    }, []);
    const handleGeneratorChange = useCallback(function(generator) {
        setState(state => ({ ...state, generator }));
    }, []);

    const handleSubmit = function (e) {
        e.preventDefault();
        onSave({
            ...state,
            ...Object.fromEntries(new FormData(e.target))
        });
    }

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="blue_dimension" type="dimensions" value={data.key} mayReplaceVanilla={true}>dimension</NamespacedKey>
        <DimensionType type={state.type} onChange={handleTypeChange} />
        <fieldset>
            <legend>Generator configuration</legend>
            <DimensionGenerator generator={state.generator} onChange={handleGeneratorChange} />
        </fieldset>
        <Button type="submit">Save</Button>
    </form>
}
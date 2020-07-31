import React, { useCallback, useState } from 'react';
import { DimensionType } from './DimensionType';
import { DimensionGenerator } from './DimensionGenerator';
import { Button } from '../../ui/Button';
import { DIMENSION } from './DimensionDefaults';
import { NamespacedKey } from '../NamespacedKey';

export function Dimension({data = DIMENSION, onSave}) {

    const [state, setState] = useState(data);

    const handleGeneratorChange = useCallback(function(generator) {
        setState(s => {
            s.generator = generator;
            return s;
        });
    }, []);

    const handleSubmit = function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {...state};
        data.key = formData.get('key');
        data.type = formData.get('dimension-type');
        onSave(data);
    }

    return <form onSubmit={handleSubmit}>
        <h3>Edit dimension</h3>
        <NamespacedKey example="blue_dimension" type="dimensions" value={data.key} mayReplaceVanilla={true} />
        <DimensionType type={state.type} />
        <fieldset>
            <legend>Generator configuration</legend>
            <DimensionGenerator generator={state.generator} onChange={handleGeneratorChange} />
        </fieldset>
        <div className="form-group mlm mbm">
            <Button type="submit">Save</Button>
        </div>
    </form>
}
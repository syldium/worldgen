import React, { useCallback, useState } from 'react';
import { DimensionType } from './DimensionType';
import { DimensionGenerator } from './DimensionGenerator';
import { Button } from '../../ui/Button';

export function Dimension({data = {}, onSave}) {

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
        <div className="form-group">
            <label htmlFor="key">Identifier</label> : <input type="text" name="key" id="key" required pattern="[a-z0-9._-]+" placeholder="Ex. : blue-dim" defaultValue={data.key} />
        </div>
        <DimensionType type={data.type} />
        <fieldset>
            <legend>Generator configuration</legend>
            <DimensionGenerator data={data.generator} onChange={handleGeneratorChange} />
        </fieldset>
        <div className="form-group mlm mbm">
            <Button type="submit">Save</Button>
        </div>
    </form>
}
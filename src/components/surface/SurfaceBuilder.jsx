import React, { useCallback, useState } from 'react';
import { BlockState } from '../state/BlockState';
import { Button } from '../../ui/Button';
import { SURFACE_BUILDER } from './SurfaceBuilderDefaults';

export function SurfaceBuilder({data = SURFACE_BUILDER, onSave}) {
    const [config, setConfig] = useState(data.config);

    const handleTopMaterialChange = useCallback(function(top_material) {
        setConfig(config => ({ ...config, top_material }));
    }, []);
    const handleUnderMaterialChange = useCallback(function(under_material) {
        setConfig(config => ({ ...config, under_material }));
    }, []);
    const handleUnderwaterMaterialChange = useCallback(function(underwater_material) {
        setConfig(config => ({ ...config, underwater_material }));
    }, []);

    const handleSubmit = useCallback(function(e) {
        e.preventDefault();
        const data = { config };
        data.key = new FormData(e.target).get('key');
        data.type = 'minecraft:default';
        onSave(data);
    }, [config, onSave]);

    return <form onSubmit={handleSubmit}>
        <h3>Edit surface builder</h3>
        <div className="form-group">
            <label htmlFor="key">Identifier</label> : <input type="text" name="key" id="key" required pattern="[a-z0-9._-]+" placeholder="Ex. : blackstone" defaultValue={data.key} />
        </div>
        <div className="form-group">
            <label htmlFor="top_material">Top material</label> : <BlockState block={config.top_material} name="top_material" onChange={handleTopMaterialChange} />
        </div>
        <div className="form-group">
            <label htmlFor="under_material">Under material</label> : <BlockState block={config.under_material} name="under_material" onChange={handleUnderMaterialChange} />
        </div>
        <div className="form-group">
            <label htmlFor="sea_lantern">Underwater material</label> : <BlockState block={config.underwater_material} name="underwater_material" onChange={handleUnderwaterMaterialChange} />
        </div>
        <div className="form-group mlm mbm">
            <Button type="submit">Save</Button>
        </div>
    </form>;
}
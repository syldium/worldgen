import React, { useCallback, useState } from 'react';
import { BlockState } from '../state/BlockState';
import { Button } from '../../ui/Button';
import { SURFACE_TYPES_OPTIONS, SURFACE_BUILDER } from './SurfaceBuilderDefaults';
import Select from 'react-select';
import { NamespacedKey } from '../NamespacedKey';

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
        const formData = new FormData(e.target);
        onSave({
            config,
            type: formData.get('type'),
            key: formData.get('key'),
            index: data.index
        });
    }, [config, data.index, onSave]);

    return <form onSubmit={handleSubmit}>
        <h3>Edit surface builder</h3>
        <NamespacedKey example="blackstone" type="surfaces" value={data.key} expectBreakage={typeof data.key !== 'undefined'} />
        <div className="form-group">
            <label htmlFor="type">Type</label> : <Select options={SURFACE_TYPES_OPTIONS} defaultValue={SURFACE_TYPES_OPTIONS.find(o => o.value === data.type)} name="type" />
            <p><small className="text-muted">The builder type defines the shape of the surface. For example, the <em>swamp</em> type will create puddles while the <em>badlands</em> types will create small rocky peaks; the <em>nether</em> types will add a mix of nether blocks and expose more of the underneath material.</small></p>
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
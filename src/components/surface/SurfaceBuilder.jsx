import React, { useCallback, useState } from 'react';
import { BlockState } from '../state/BlockState';
import { Button } from '../../ui/Button';
import { SURFACE_TYPES_OPTIONS, SURFACE_BUILDER } from './SurfaceBuilderDefaults';
import Select from '../../ui/Select';
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
        <NamespacedKey example="blackstone" type="surfaces" value={data.key} expectBreakage={typeof data.key !== 'undefined'}>surface builder</NamespacedKey>
        
        <div className="form-group">
            <label htmlFor="type">Type</label>
            <Select options={SURFACE_TYPES_OPTIONS} defaultValue={SURFACE_TYPES_OPTIONS.find(o => o.value === data.type)} name="type" inputId="type" />
            <p className="help2"><small className="text-muted">The builder type defines the shape of the surface. For example, the <em>swamp</em> type will create puddles while the <em>badlands</em> types will create small rocky peaks; the <em>nether</em> types will add a mix of nether blocks and expose more of the underneath material.</small></p>
        </div>
        
        <label htmlFor="top_material">Top material</label>
        <BlockState block={config.top_material} className="" inputId="top_material" onChange={handleTopMaterialChange} />
        <label htmlFor="under_material">Under material</label>
        <BlockState block={config.under_material} className="" inputId="under_material" onChange={handleUnderMaterialChange} />
        <label htmlFor="underwater_material">Underwater material</label>
        <BlockState block={config.underwater_material} className="" inputId="underwater_material" onChange={handleUnderwaterMaterialChange} />

        <Button type="submit">Save</Button>
    </form>;
}
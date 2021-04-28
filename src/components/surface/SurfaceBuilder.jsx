import { SURFACE_BUILDER, SURFACE_TYPES_OPTIONS } from './SurfaceBuilderDefaults';
import React, { useCallback, useState } from 'react';

import { BlockState } from '../state/BlockState';
import { Button } from '../../ui/Button';
import { JsonViewer } from '../../ui/JsonViewer';
import { NamespacedKey } from '../NamespacedKey';
import Select from '../../ui/Select';

export function SurfaceBuilder({data = SURFACE_BUILDER, onSave}) {
    const [state, setState] = useState(data);

    const handleTypeChange = useCallback(function(option) {
        setState(state => ({ ...state, type: option.value }));
    }, []);
    const handleTopMaterialChange = useCallback(function(top_material) {
        setState(state => ({ ...state, config: { ...state.config, top_material } }));
    }, []);
    const handleUnderMaterialChange = useCallback(function(under_material) {
        setState(state => ({ ...state, config: { ...state.config, under_material } }));
    }, []);
    const handleUnderwaterMaterialChange = useCallback(function(underwater_material) {
        setState(state => ({ ...state, config: { ...state.config, underwater_material } }));
    }, []);

    const handleSubmit = useCallback(function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSave({
            ...state,
            key: formData.get('key')
        });
    }, [onSave, state]);

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="blackstone" type="surfaces" value={state.key} expectBreakage={typeof data.key !== 'undefined'} onSelectLoad={setState}>
            surface builder
            <JsonViewer data={state} />
        </NamespacedKey>
        
        <div className="form-group">
            <label htmlFor="type">Type</label>
            <Select options={SURFACE_TYPES_OPTIONS} value={SURFACE_TYPES_OPTIONS.find(o => o.value === state.type)} onChange={handleTypeChange} inputId="type" />
            <p className="help2"><small className="text-muted">The builder type defines the shape of the surface. For example, the <em>swamp</em> type will create puddles while the <em>badlands</em> types will create small rocky peaks; the <em>nether</em> types will add a mix of nether blocks and expose more of the underneath material.</small></p>
        </div>
        
        <label htmlFor="top_material">Top material</label>
        <BlockState block={state.config.top_material} className="" inputId="top_material" onChange={handleTopMaterialChange} />
        <label htmlFor="under_material">Under material</label>
        <BlockState block={state.config.under_material} className="" inputId="under_material" onChange={handleUnderMaterialChange} />
        <label htmlFor="underwater_material">Underwater material</label>
        <BlockState block={state.config.underwater_material} className="" inputId="underwater_material" onChange={handleUnderwaterMaterialChange} />

        <Button type="submit">Save</Button>
    </form>;
}
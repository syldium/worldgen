import React, { useCallback, useEffect, useState } from 'react';
import { ConfInput } from '../../ui/Input';
import { useToggle } from '../../hooks/ui';
import { useCrud, CRUD } from '../../hooks/form';
import Select from 'react-select';
import { STRUCTURES } from './NoiseDefaults';
import { Button } from '../../ui/Button';

export const Structures = React.memo(function ({ data, onChange }) {

    const handleStrongholdChange = useCallback(function(stronghold) {
        if (stronghold === false) {
            onChange({ structures: data.structures });
        } else {
            onChange({ structures: data.structures, stronghold });
        }
    }, [data.structures, onChange]);
    const handleStructuresChange = useCallback(function(structures) {
        onChange({ ...data, structures });
    }, [data, onChange]);

    return <fieldset>
        <legend>Structures</legend>
        <Stronghold data={data.stronghold} onChange={handleStrongholdChange} />
        <StructuresList data={data.structures} onChange={handleStructuresChange} />
    </fieldset>
});

const Stronghold = React.memo(function ({ data, onChange }) {

    const [enabled, toggle] = useToggle(typeof data === 'object');
    const [stronghold, setStronghold] = useState(data || { distance: 32, spread: 3, count: 128 });

    const handleChange = useCallback(function(e) {
        e.preventDefault();
        const name = e.target.dataset.name;
        const value = parseInt(e.target.value);
        setStronghold(stronghold => ({ ...stronghold, [name]: value }));
    }, [setStronghold]);

    useEffect(function() {
        if (data !== stronghold
            || (enabled && typeof data === 'undefined')
            || (!enabled && typeof data === 'object')) {
                onChange(enabled ? stronghold : false);
        }
    }, [data, enabled, onChange, stronghold]);

    return <div>
        <div className="toggle-label">Stronghold<Button cat="secondary" onClick={toggle}>{enabled ? 'Disable' : 'Enable'}</Button></div>
        {enabled && <div className="form-group form-row">
            <ConfInput id="distance" defaultValue={stronghold.distance} onChange={handleChange} min="0" max="1023">Distance</ConfInput>
            <ConfInput id="spread" defaultValue={stronghold.spread} onChange={handleChange} min="0" max="1023">Spread</ConfInput>
            <ConfInput id="count" defaultValue={stronghold.count} onChange={handleChange} min="1" max="4095">Count</ConfInput>
        </div>}
    </div>
});

const StructuresList = React.memo(function({ data, onChange }) {
    const [visibility, toggle] = useToggle();
    const [structures, dispatch] = useCrud(Object.entries(data).map(([type, d]) => ({ ...d, type })));

    const handleAdd = useCallback(function(e) {
        e.preventDefault();
        dispatch({ type: CRUD.ADD, payload: {
            type: 'minecraft:village',
            spacing: 32,
            separation: 8,
            salt: 10387312
        }, unshift: true });
        if (!visibility) {
            toggle();
        }
    }, [dispatch, toggle, visibility]);
    const handleChange = useCallback(function(original, structure) {
        dispatch({ type: CRUD.UPDATE, target: original, payload: structure });
    }, [dispatch]);
    const handleRemove = useCallback(function(structure) {
        dispatch({ type: CRUD.REMOVE, payload: structure });
    }, [dispatch]);

    useEffect(function() {
        const obj = {};
        for (const structure of structures) {
            obj[structure.type] = {
                spacing: structure.spacing,
                separation: structure.separation,
                salt: structure.salt
            };
        }
        onChange(obj);
    }, [onChange, structures]);

    return <div>
        <div className="toggle-label">
            Structures
            <div className="btn-group">
                <Button onClick={handleAdd}>Add</Button>
                {structures.length > 0 && <Button cat="secondary" onClick={toggle}>{visibility ? 'Less...' : 'More...'}</Button>}
            </div>
        </div>
        {visibility && structures.map((def, i) => 
            <Structure data={def} key={i} onChange={handleChange} onDelete={handleRemove} />
        )}
    </div>
});

const Structure = React.memo(function ({ data, onChange, onDelete }) {

    const handleChange = useCallback(function(e) {
        const field = typeof e.target === 'undefined' ? 'type' : e.target.dataset.name;
        const value = typeof e.target === 'undefined' ? e.value : parseInt(e.target.value);
        onChange(data, { ...data, [field]: value });
    }, [data,  onChange]);
    const handleSpacingChange = useCallback(function(e) {
        const name = e.target.dataset.name;
        const value = parseInt(e.target.value);
        if ((name === 'spacing' && value > data.separation)
            || (e.target.dataset.name === 'separation' && value < data.spacing)) {
            onChange(data, {...data, [name]: value});
        } 
    }, [data,  onChange]);
    const handleDelete = useCallback(function (e) {
        e.preventDefault();
        onDelete(data);
    }, [data, onDelete]);

    return <div>
        <div className="form-group">
            <label>Type</label> : <Select options={STRUCTURES} value={STRUCTURES.find(s => s.value === data.type)} onChange={handleChange} />
        </div>
        <div className="form-group form-row">
            <ConfInput id="spacing" value={data.spacing} onChange={handleSpacingChange} min="0" max="4096">Spacing</ConfInput>
            <ConfInput id="separation" value={data.separation} onChange={handleSpacingChange} min="0" max="4096">Spacing</ConfInput>
            <ConfInput id="salt" value={data.salt} onChange={handleChange} min="0" max={0x7FFFFFFF} style={{ width: '150px' }}>Spacing</ConfInput>
            <div className="form-inline"><Button cat="danger" onClick={handleDelete}>Delete</Button></div>
        </div>
        <hr /> 
    </div>
});

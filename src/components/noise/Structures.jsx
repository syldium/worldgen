import { CRUD, useCrudState } from '../../hooks/form';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '../../ui/Button';
import { NumberInput } from '../../ui/Input';
import { STRUCTURES } from './NoiseDefaults';
import { useToggle } from '../../hooks/ui';
import Select from '../../ui/Select';

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

    const handleChange = useCallback(function(value) {
        setStronghold(stronghold => ({ ...stronghold, ...value }));
    }, [setStronghold]);

    useEffect(function() {
        if ((data !== stronghold && enabled)
            || (enabled && typeof data === 'undefined')
            || (!enabled && typeof data === 'object')) {
                onChange(enabled ? stronghold : false);
        }
    }, [data, enabled, onChange, stronghold]);

    return <div>
        <div className="toggle-label">Stronghold<Button cat="secondary" onClick={toggle}>{enabled ? 'Disable' : 'Enable'}</Button></div>
        {enabled && <div className="form-group form-row">
            <NumberInput id="distance" defaultValue={stronghold.distance} upChange={handleChange} max="1023">Distance</NumberInput>
            <NumberInput id="spread" defaultValue={stronghold.spread} upChange={handleChange} max="1023">Spread</NumberInput>
            <NumberInput id="count" defaultValue={stronghold.count} upChange={handleChange} min="1" max="4095">Count</NumberInput>
        </div>}
    </div>
});

const StructuresList = React.memo(function({ data, onChange }) {
    const [visibility, toggle] = useToggle();
    const [structures, dispatch] = useCrudState(Object.entries(data).map(([type, d]) => ({ ...d, type })));

    const [previous, setPrevious] = useState(data);
    if (data !== previous) {
        dispatch({ type: CRUD.REPLACE, payload: Object.entries(data).map(([type, d]) => ({ ...d, type })) });
        setPrevious(data);
    }

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
        if (previous !== data) {
            return;
        }

        const obj = {};
        for (const structure of structures) {
            obj[structure.type] = {
                spacing: structure.spacing,
                separation: structure.separation,
                salt: structure.salt
            };
        }
        if (JSON.stringify(obj) !== JSON.stringify(data)) {
            onChange(obj);
        }
    }, [data, onChange, previous, structures]);

    return <div>
        <div className="toggle-label">
            Structures
            <div className="btn-group">
                <Button onClick={handleAdd}>Add structure</Button>
                {structures.length > 0 && <Button cat="secondary" onClick={toggle}>{visibility ? 'Less...' : 'More...'}</Button>}
            </div>
        </div>
        {visibility && structures.map((def, i) => 
            <Structure data={def} key={i} onChange={handleChange} onDelete={handleRemove} />
        )}
    </div>
});

const Structure = React.memo(function ({ data, onChange, onDelete }) {

    const handleTypeChange = useCallback(function(option) {
        onChange(data, { ...data, type: option.value });
    }, [data,  onChange]);
    const handleSpacingChange = useCallback(function(value) {
        const name = Object.keys(value)[0];
        value = value[name];
        if ((name === 'spacing' && value > data.separation)
            || (name === 'separation' && value < data.spacing)) {
            onChange(data, {...data, [name]: value});
        } 
    }, [data,  onChange]);
    const handleSaltChange = useCallback(function(salt) {
        onChange(data, { ...data, salt });
    }, [data,  onChange]);
    const handleDelete = useCallback(function (e) {
        e.preventDefault();
        onDelete(data);
    }, [data, onDelete]);

    return <div>
        <div className="form-group">
            <label>Type</label> : <Select options={STRUCTURES} value={STRUCTURES.find(s => s.value === data.type)} onChange={handleTypeChange} />
        </div>
        <div className="form-group form-row">
            <NumberInput id="spacing" value={data.spacing} min={data.separation + 1} upChange={handleSpacingChange} max="4096">Spacing</NumberInput>
            <NumberInput id="separation" value={data.separation} upChange={handleSpacingChange} max={Math.min(data.spacing - 1, 4096)}>Separation</NumberInput>
            <NumberInput id="salt" value={data.salt} onChange={handleSaltChange} max={0x7FFFFFFF} style={{ width: '150px' }}>Salt</NumberInput>
            <div className="form-inline"><Button cat="danger" onClick={handleDelete}>Delete</Button></div>
        </div>
        <hr /> 
    </div>
});

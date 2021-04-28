import { useCrudPreset, useJsonEffect } from "../../hooks/form";
import React, { useCallback, useContext, useMemo } from 'react';

import { Button } from '../../ui/Button';
import { DataContext } from '../../context/DataContext';
import { NumberInput } from '../../ui/Input';
import { SPAWNERS_DEFAULTS } from './BiomeDefaults';
import { useToggle } from '../../hooks/ui';
import Select from '../../ui/Select';

export const BiomeSpawners = React.memo(function({onChange, data}) {

    const spawners = useJsonEffect(data || SPAWNERS_DEFAULTS, data, onChange);
    const entities = useContext(DataContext).vanilla.entities;

    const handleChange = useCallback(function(group, groupSpawners) {
        onChange({ ...spawners, [group]: groupSpawners });
    }, [spawners, onChange]);

    return <div>
        <SpawnGroup group="ambient" data={spawners.ambient} onChange={handleChange} entities={entities}>Ambient</SpawnGroup>
        <SpawnGroup group="creature" data={spawners.creature} onChange={handleChange} entities={entities}>Creature</SpawnGroup>
        <SpawnGroup group="misc" data={spawners.misc} onChange={handleChange} entities={entities}>Miscellaneous</SpawnGroup>
        <SpawnGroup group="monster" data={spawners.monster} onChange={handleChange} entities={entities}>Monster</SpawnGroup>
        <SpawnGroup group="water_ambient" data={spawners.water_ambient} onChange={handleChange} entities={entities}>Water ambient</SpawnGroup>
        <SpawnGroup group="water_creature" data={spawners.water_creature} onChange={handleChange} entities={entities}>Water creature</SpawnGroup>
    </div>;
});

const SpawnGroup = React.memo(function({children, entities, data = [], group, onChange}) {
    const [visibility, toggle] = useToggle();
    const text = visibility ? 'Less...' : 'More...';

    const [spawners, insert, handleChange, handleRemove] = useCrudPreset(spawners => onChange(group, spawners), data, function(spawners) {
        // Get the first non taken entity
        return { type: (entities.filter(o => !spawners.some(s => s.type === o.value))[0] || { value: 'minecraft:cow' }).value, minCount: 1, maxCount: 1, weight: 1 };
    }, true);

    const handleAdd = useCallback(function(e) {
        insert(e);
        if (!visibility) {
            toggle();
        }
    }, [insert, toggle, visibility]);

    if (visibility) {
        return <div>
            <div className="toggle-label">
                {children}
                <div className="btn-group">
                    {entities.length > spawners.length && <Button onClick={handleAdd}>Add</Button>}
                    {spawners.length > 0 && <Button cat="secondary" onClick={toggle}>{text}</Button>} 
                </div>
            </div>
            {spawners.map((spawner, index) => {
                const options = entities.filter(o => spawner.type === o.value || !spawners.some(s => s.type === o.value));
                return <SpawnDefinition data={spawner} key={spawner.type} onChange={handleChange} onDelete={handleRemove} index={index} options={options} />;
            })}
        </div>;
    }
    
    return <div className="toggle-label">
        {children}
        <div className="btn-group">
            {spawners.length > 0 && <Button cat="secondary" onClick={toggle}>{text}</Button>}
            {(spawners.length < 1) && <Button onClick={handleAdd}>Add</Button>}
        </div>
    </div>;
});

const SpawnDefinition = React.memo(function({data, index, options, onChange, onDelete}) {

    const handleTypeChange = useCallback(function(option) {
        onChange({ ...data, type: option.value }, data);
    }, [data, onChange]);
    const handleValueChange = useCallback(function(value) {
        onChange({ ...data, ...value }, data);
    }, [data, onChange]);
    const handleCountChange = function(count) {
        const name = Object.keys(count)[0];
        const value = count[name];
        if ((name === 'minCount' && value <= data.maxCount)
            || (name === 'maxCount' && value >= data.minCount)) {
                onChange({ ...data, [name]: value }, data);
        } 
    };
    const handleDelete = useCallback(function(e) {
        onDelete(e, index);
    }, [index, onDelete]);

    const selectedOption = useMemo(function() {
        return options.find(o => o.value === data.type);
    }, [data.type, options]);

    return <div>
        <div className="form-group">
            <label>Mob type</label> : <Select options={options} value={selectedOption} onChange={handleTypeChange} />
        </div>
        <div className="form-group form-row">
            <NumberInput id="weight" value={data.weight} upChange={handleValueChange}>Weight</NumberInput>
            <NumberInput id="minCount" value={data.minCount} max={data.maxCount} upChange={handleCountChange}>Min count</NumberInput>
            <NumberInput id="maxCount" value={data.maxCount} min={data.minCount} upChange={handleCountChange}>Max count</NumberInput>
            <div className="form-inline"><Button cat="danger" onClick={handleDelete}>Delete</Button></div>
        </div>
        <hr /> 
    </div>
});

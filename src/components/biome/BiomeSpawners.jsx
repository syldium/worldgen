import React, { useContext, useReducer, useEffect, useMemo, useState, useCallback } from 'react';
import Select from 'react-select';
import { useToggle } from '../../hooks/ui';
import { Button } from '../../ui/Button';
import { DataContext } from '../../context/DataContext';
import { SPAWNERS_AMBIENT, SPAWNERS_CREATURE, SPAWNERS_MONSTER } from './BiomeDefaults';

const ADD_SPAWNER = 'ADD_SPAWNER';
const UPDATE_SPAWNER = 'UPDATE_SPAWNER';
const REMOVE_SPAWNER = 'REMOVE_SPAWNER';

function spawnersReducer(state, action) {
    switch (action.type) {
        case ADD_SPAWNER:
            return [...state, action.payload];
        case UPDATE_SPAWNER:
          return state.map(spawner => spawner === action.target ? action.payload : spawner);
        case REMOVE_SPAWNER:
          return state.filter(spawner => spawner !== action.payload);
        default:
          return state;
    }
}

export function BiomeSpawners({onChange, data = { ambient: SPAWNERS_AMBIENT, creature: SPAWNERS_CREATURE, misc: [], monster: SPAWNERS_MONSTER, water_ambient: [], water_creature: [] }}) {

    const entities = useContext(DataContext).vanilla.entities;
    const [spawners, setSpawners] = useState(data);

    const handleChange = useCallback(function(group, groupSpawners) {
        setSpawners(function(spawners) {
            const state = {
                ...spawners,
                [group]: groupSpawners
            };
            onChange(state);
            return state;
        });
    }, [onChange]);

    return <div>
        <SpawnGroup group="ambient" data={spawners.ambient} onChange={handleChange} entities={entities}>Ambient</SpawnGroup>
        <SpawnGroup group="creature" data={spawners.creature} onChange={handleChange} entities={entities}>Creature</SpawnGroup>
        <SpawnGroup group="misc" data={spawners.misc} onChange={handleChange} entities={entities}>Miscellaneous</SpawnGroup>
        <SpawnGroup group="monster" data={spawners.monster} onChange={handleChange} entities={entities}>Monster</SpawnGroup>
        <SpawnGroup group="water_ambient" data={spawners.water_ambient} onChange={handleChange} entities={entities}>Water ambient</SpawnGroup>
        <SpawnGroup group="water_creature" data={spawners.water_creature} onChange={handleChange} entities={entities}>Water creature</SpawnGroup>
    </div>;
}

function SpawnGroup({children, entities, data = [], group, onChange}) {
    const [visibility, toggle] = useToggle();
    const text = visibility ? 'Less...' : 'More...';

    const [spawners, dispatch] = useReducer(spawnersReducer, data);

    const handleAdd = useCallback(function(e) {
        e.preventDefault();
        dispatch({ type: ADD_SPAWNER, payload: {
            type: 'minecraft:cow',
            weight: 1,
            minCount: 1,
            maxCount: 1,
        }});
        if (!visibility) {
            toggle();
        }
    }, [toggle, visibility]);

    const handleChange = useCallback(function(original, spawner) {
        dispatch({ type: UPDATE_SPAWNER, target: original, payload: spawner });
    }, []);

    const handleRemove = useCallback(function(spawner) {
        dispatch({ type: REMOVE_SPAWNER, payload: spawner });
    }, []);

    useEffect(function() {
        onChange(group, spawners);
    }, [group, onChange, spawners]);

    const values = [];
    if (visibility) {
        spawners.forEach((def, i) => {
            const key = `${i}-${def.type}-${def.weight}-${def.minCount}-${def.maxCount}`;
            values.push(<SpawnDefinition data={def} key={key} onChange={handleChange} onDelete={handleRemove} entities={entities} />);
        });
        return <div>
            <div className="toggle-label">
                {children} 
                <div className="btn-group">
                    <Button onClick={handleAdd}>Add</Button>
                    {spawners.length > 0 && <Button cat="secondary" onClick={toggle}>{text}</Button>} 
                </div>
            </div>
            {values}
        </div>;
    }
    
    return <div className="toggle-label">
        {children}
        <div className="btn-group">
            {spawners.length > 0 && <Button cat="secondary" onClick={toggle}>{text}</Button>}
            {(spawners.length < 1) && <Button onClick={handleAdd}>Add</Button>}
        </div>
    </div>;
}

const SpawnDefinition = React.memo(function({entities, onChange, onDelete, data}) {

    const [definition, setDefinition] = useState(data);

    const handleChange = function(e) {
        const field = typeof e.target === 'undefined' ? 'type' : e.target.id;
        const value = typeof e.target === 'undefined' ? e.value : parseInt(e.target.value);
        setDefinition(definition => ({
            ...definition,
            [field]: value
        }));
        onChange(data, {...data, [field]: value});
    };

    const handleCountChange = function(e) {
        const value = parseInt(e.target.value);
        if ((e.target.id === 'minCount' && value <= definition.maxCount)
            || (e.target.id === 'maxCount' && value >= definition.minCount)) {
            setDefinition(definition => ({
                ...definition,
                [e.target.id]: value
            }));
            onChange(data, {...data, [e.target.id]: value});
        } 
    };

    const handleDelete = function(e) {
        e.preventDefault();
        onDelete(data);
    };

    const selectedOption = useMemo(function() {
        return entities.find(o => o.value === definition.type);
    }, [definition.type, entities]);

    return <div>
        <div className="form-group">
            <label>Mob type</label> : <Select options={entities} value={selectedOption} onChange={handleChange} />
        </div>
        <div className="form-group form-row">
            <div className="form-inline">
                <label htmlFor="weight">Weight</label> : <input type="number" id="weight" required value={definition.weight} onChange={handleChange} />
            </div>
            <div className="form-inline">
                <label htmlFor="minCount">Min count</label> : <input type="number" id="minCount" min="0" required value={definition.minCount} onChange={handleCountChange} />
            </div>
            <div className="form-inline">
                <label htmlFor="maxCount">Max count</label> : <input type="number" id="maxCount" min="0" required value={definition.maxCount} onChange={handleCountChange} />
            </div>
            <div className="form-inline"><Button cat="danger" onClick={handleDelete}>Delete</Button></div>
        </div>
        <hr /> 
    </div>
}, function(prev, next) {
    return prev.entities.length === next.entities.length && prev.data === next.data;
});
import { useReducer, useState, useCallback, useEffect, useContext, useMemo } from "react";
import { useKeyedListOptions } from "./context";
import { DataContext } from "../context/DataContext";
import arrayMove from "array-move";

function crudReducer(state, action) {
    switch (action.type) {
        case ADD:
            if (action.unshift) {
                return [action.payload, ...state];
            }
            return [...state, action.payload];
        case UPDATE:
            if (typeof action.target === 'number' && typeof action.payload === 'number') {
                return arrayMove(state, action.target, action.payload);
            }
            if (typeof action.target === 'undefined') {
                throw new Error('Cannot update an element without its previous state.');
            }
            return state.map(element => element === action.target ? action.payload : element);
        case REMOVE:
            return state.filter(element => element !== action.payload);
        case REPLACE:
            return action.payload;
        default:
            return state;
    }
}

export function useCrud(data = []) {
    return useReducer(crudReducer, data);
}

/**
 * @param {object[]} [data] 
 * @param {object|function (object[]): object} [initial] 
 * @returns {[object[], function (SyntheticEvent): void, function (number|object, number|object): void, function (SyntheticEvent, number): void, function (object[]): void}
 */
export function useCrudPreset(data = [], initial = {}, unshift = false) {
    const [entities, dispatch] = useCrud(data);

    const add = useCallback(function(e) {
        e.preventDefault();
        const n = typeof initial === 'function' ? initial(entities) : { ...initial };
        dispatch({ type: CRUD.ADD, payload: n, unshift });
    }, [dispatch, entities, initial, unshift]);
    const update = useCallback(function(state, previous) {
        if (state.hasOwnProperty('oldIndex') && state.hasOwnProperty('newIndex')) {
            dispatch({ type: CRUD.UPDATE, target: state.oldIndex, payload: state.newIndex });
            return;
        }
        dispatch({ type: CRUD.UPDATE, target: previous, payload: state });
    }, [dispatch]);
    const remove = useCallback(function(e, index) {
        e.preventDefault();
        dispatch({ type: CRUD.REMOVE, payload: entities[index] });
    }, [dispatch, entities]);
    const replace = useCallback(function(entities) {
        dispatch({ type: CRUD.REPLACE, payload: entities });
    }, [dispatch]);

    return [entities, add, update, remove, replace];
}

export function useBlocksOptions(mapped = true) {
    const blocks = useContext(DataContext).vanilla.blocks;
    return useMemo(function() {
        return mapped ? blocks.map(block => ({ value: 'minecraft:' + block.name, label: block.displayName })): blocks;
    }, [blocks, mapped]);
}

/**
 * @param {number} [initial] 
 * @returns {function(SyntheticEvent|string|number): void} 
 */
export function useNumber(initial = 0) {
    const [n, setState] = useState(initial);
    const setNumber = function(n) {
        if (typeof n === 'object') {
            n = n.target.value;
        }
        if (typeof n === 'string') {
            n = isNaN(n) ? initial : parseInt(n);
        }
        setState(n);
    }
    return [n, setNumber];
}

export function useValueChange(changeCallback, obj) {
    return useCallback(function(e) {
        if (e.target.type === 'checkbox') {
            changeCallback({ ...obj, [e.target.dataset.name || e.target.id || e.target.name]: e.target.checked });
            return;
        }
        const value = isNaN(e.target.value) ? e.target.value : parseFloat(e.target.value);
        changeCallback({ ...obj, [e.target.dataset.name || e.target.id || e.target.name]: value });
    }, [changeCallback, obj]);
}

export function useJsonEffect(state, props, onChange) {
    useEffect(() => {
        if (state === props) {
            return;
        }
        if (JSON.stringify(state) !== JSON.stringify(props)) {
            onChange(state, props);
        }
    }, [state, props, onChange]);
    return state;
}

/**
 * Fast way to provide a list of options for react-select
 * and store selection as string (list).
 * 
 * @param {('biomes'|'dimensions'|'dimension_types'|'features'|'noises'|'surfaces')} category Data category
 * @param {string|string[]} initial Initial selection
 * @param {boolean} [multiple]
 * @returns {[{ value: string, label: string }[], string|string[], function({ value: string }): void]} Options list, currently selected list and his updater
 */
export function useKeyedOptionsState(category, initial, multiple) {
    const options = useKeyedListOptions(category); // Get options

    // Default value for 'multiple' argument
    if (typeof multiple === 'undefined') {
        multiple = Array.isArray(initial);
    }

    // Enhanced use state - usage of options for default value if needed
    const [selection, setSelection] = useState(initial || function() {
        if (multiple) {
            return options.length > 0 ? [options[0].value] : [];
        }
        return options.length > 0 ? options[0].value : '';
    }());

    // End chain react-select change handler
    const setSelectionFromOptions = useCallback(function(selected) {
        if (multiple) {
            setSelection(selected === null ? [] : selected.map(o => o.value));
        } else {
            setSelection(selected.value);
        }
    }, [multiple]);

    return [options, selection, setSelectionFromOptions];
}

const ADD = 'ADD';
const UPDATE = 'UPDATE';
const REMOVE = 'REMOVE';
const REPLACE = 'REPLACE';
export const CRUD = { ADD, UPDATE, REMOVE, REPLACE };
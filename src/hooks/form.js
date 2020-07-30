import { useReducer, useState, useCallback } from "react";
import { useKeyedListOptions } from "./context";

function crudReducer(state, action) {
    switch (action.type) {
        case ADD:
            if (action.unshift) {
                return [action.payload, ...state];
            }
            return [...state, action.payload];
        case UPDATE:
          return state.map(element => element === action.target ? action.payload : element);
        case REMOVE:
          return state.filter(element => element !== action.payload);
        default:
          return state;
    }
}

export function useCrud(data = []) {
    return useReducer(crudReducer, data);
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

/**
 * Fast way to provide a list of options for react-select
 * and store selection as string (list).
 * 
 * @param {('biomes'|'blocks'|'features'|'surfaces')} category Data category
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
export const CRUD = { ADD, UPDATE, REMOVE };
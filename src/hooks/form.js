import { useReducer } from "react";

function crudReducer(state, action) {
    switch (action.type) {
        case ADD:
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

const ADD = 'ADD';
const UPDATE = 'UPDATE';
const REMOVE = 'REMOVE';
export const CRUD = { ADD, UPDATE, REMOVE };
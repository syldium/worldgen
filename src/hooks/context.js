import { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";

/**
 * @param {object[]} initial
 * @returns {[object[], function(object): void]} 
 */
export function useData(initial = []) {
    const [data, setData] = useState(initial);
    const updateData = function(object) {
        setData(stored => {
            const i = stored.findIndex(({key}) => key === object.key);
            if (i < 0) {
                stored.push(object);
            } else {
                stored[i] = object;
            }
            return stored;
        });
    }
    return [data, updateData];
}

/**
 * @param {('biomes'|'blocks'|'features'|'surfaces')} category Data category
 * @returns {{ value: string, label: string }[]} Options list for react-select
 */
export function useKeyedListOptions(category) {
    const context = useContext(DataContext);
    const options = context.custom[category]
        .map(keyed => ({ value: context.namespace + ':' + keyed.key, label: '(Custom) ' + keyed.key }));

    let struct = null;
    context.vanilla[category].forEach(keyed => {
        if (struct === null) {
            struct = keyed.hasOwnProperty('displayName') ? 1 : (keyed.hasOwnProperty('label') ? 2 : 3);
        }
        switch(struct) {
            case 1: // displayName
                options.push({ value: 'minecraft:' + keyed.name, label: keyed.displayName });
                return;
            case 2: // already option
                options.push(keyed);
                return;
            default:
                options.push({ value: 'minecraft:' + keyed, label: keyed });
        }
    });
    return options;
}
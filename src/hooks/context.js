import { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";

/**
 * @returns {[object[], function(object): void]} 
 */
export function useData() {
    const [data, setData] = useState([]);
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
 * @param {('biomes'|'blocks'|'features')} category Data category
 * @returns {{ value: string, label: string }[]} Options list for react-select
 */
export function useKeyedListOptions(category) {
    const context = useContext(DataContext);
    const options = context.custom[category]
        .map(keyed => ({ value: context.namespace + ':' + keyed.key, label: '(Custom) ' + keyed.key }));

    let hasDisplayName = null;
    context.vanilla[category].forEach(keyed => {
        if (hasDisplayName === null) {
            hasDisplayName = keyed.hasOwnProperty('displayName');
        }
        if (hasDisplayName) {
            options.push({ value: 'minecraft:' + keyed.name, label: keyed.displayName });
        } else {
            options.push({ value: 'minecraft:' + keyed, label: keyed });
        }
    });
    return options;
}
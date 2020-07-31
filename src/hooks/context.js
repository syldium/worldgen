import { useState, useContext, useMemo } from "react";
import { DataContext } from "../context/DataContext";
import { displayNamespacedKey } from "../utils/data";

/**
 * @param {object[]} initial
 * @returns {[object[], function(object): void]} 
 */
export function useData(initial = []) {
    const [data, setData] = useState(initial);
    const updateData = function(object) {
        setData(stored => {
            const existing = stored.findIndex(({key}) => object.key === key);
            if (existing > -1 && existing !== object.index) {
                object.index = stored.length;
                object.key = object.key + '2';
                stored.push(object);
                return stored;
            }

            if (typeof object.index === 'undefined') {
                object.index = stored.length;
                stored.push(object);
            } else {
                stored[object.index] = object;
            }
            return stored;
        });
    }
    return [data, updateData];
}

/**
 * @param {('biomes'|'dimensions'|'dimension_types'|'features'|'noises'|'surfaces')} category Data category
 * @param {boolean} [includeCustom]
 * @param {boolean} [empty]
 * @returns {{ value: string, label: string }[]} Options list for react-select
 */
export function useKeyedListOptions(category, includeCustom = true, empty = false) {
    const context = useContext(DataContext);
    return useMemo(function() {
        if (empty) {
            return [];
        }

        const options = includeCustom ? context.custom[category]
            .map(keyed => {
                const name = displayNamespacedKey(keyed.key, context.namespace);
                return { value: keyed.key, label: '(Custom) ' + name };
            }) : [];

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
    }, [category, context.custom, context.namespace, context.vanilla, empty, includeCustom]);
}
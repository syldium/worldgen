import {capitalize, defaultNamespace, displayNamespacedKey} from "../utils/data";
import {useCallback, useContext, useMemo, useState} from "react";

import { DataContext } from "../context/DataContext";

/**
 * @param {object[]} initial
 * @returns {[object[], function(object): void, function(object[]): void]} 
 */
export function useData(initial = []) {
    const [data, setData] = useState(initial);

    const updateData = function(object, previous) {
        setData(stored => {
            if (!object.hasOwnProperty('key')) {
                stored.splice(stored.findIndex(obj => obj === (previous || object)), 1);
                return stored;
            }

            const existing = stored.find(({ key }) => object.key === key);
            if (typeof existing !== 'undefined' && existing !== previous) {
                do {
                    object.key += '2';
                } while (stored.findIndex(({ key }) => object.key === key) > -1)
                stored.push(object);
                return stored;
            }

            if (typeof previous === 'undefined' || !previous.hasOwnProperty('key')) {
                stored.push(object);
            } else {
                stored[stored.indexOf(previous)] = object;
            }
            return stored;
        });
    }
    return [data, updateData, setData];
}

/**
 * @param {('dimensions'|'dimension_types'|'biomes'|'carvers'|'features'|'surfaces'|'noises')} category Data category
 * @param {boolean} [includeCustom]
 * @param {boolean} [empty]
 * @returns {{ value: string, label: string }[]} Options list for react-select
 */
export function useKeyedListOptions(category, includeCustom = true, empty = false) {
    const context = useContext(DataContext);
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
                options.push({ value: defaultNamespace(keyed.name), label: keyed.displayName });
                return;
            case 2: // already option
                options.push(keyed);
                return;
            default:
                options.push({ value: defaultNamespace(keyed), label: keyed });
        }
    });
    return options;
}

/**
 * @param {string} type 
 * @param {History} history 
 * @param {number} [id] 
 * @returns {function(object): void}
 */
export function useSave(type, history, id) {
    const custom = useContext(DataContext).custom;
    return useCallback(function (data) {
        const method = 'update' + function () {
            switch (type) {
                case 'surface':
                    return 'SurfacesBuilders';
                case 'dimension_type':
                    return 'DimensionTypes';
                default:
                    return capitalize(type) + 's';
            }
        }();
        custom[method](data, custom[type + 's'][id]);
        history.push('/');
    }, [custom, history, id, type]);
}

/**
 * @return {{ name: string, displayName: string, material: string, states: { name: string, type: 'bool'|'int'|'enum', num_values: number }[] }[]}
 */
export function useBlocks() {
    const context = useContext(DataContext);
    return useMemo(function () {
        return context.vanilla.blocks.concat(context.custom.blocks);
    }, [context.custom.blocks, context.vanilla.blocks]);
}

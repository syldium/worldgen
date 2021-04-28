import { MULTI_NOISE_BIOME_SOURCE, NOISES_NAMES } from '../components/dimension/DimensionDefaults';

/**
 * @param {object} a 
 * @param {object} b 
 * @returns {boolean}
 */
export function objectsEqual(a, b) {
    return Object.keys(a).length === Object.keys(b).length
        && Object.keys(a).every(p => a[p] === b[p]);
}

/**
 * @param {string} str 
 * @returns {string}
 */
export function capitalize(str) {
    return str[0].toUpperCase() + str.substr(1);
}

/**
 * @param {string} key 
 * @param {string} [defaultNamespace]
 * @returns {string}
 */
export function displayNamespacedKey(key = 'undefined', defaultNamespace) {
    return key.startsWith(defaultNamespace + ':') ? key.split(':')[1] : key;
}

/**
 * @param {string} namespacedKey
 * @param {string} namespace
 * @return {string}
 */
export function defaultNamespace(namespacedKey, namespace = 'minecraft') {
    if (namespacedKey.includes(':')) {
        return namespacedKey;
    }
    return namespace + ':' + namespacedKey;
}

export function getStateValue(state, properties = {}) {
    const actual = properties[state.name];
    switch (state.type) {
        case 'bool':
            return actual === 'true' ? 'true' : 'false';
        case 'int':
            return typeof actual === 'string' ? actual : '0';
        default:
            return actual || state.values[0];
    }
}

/**
 * @param {string} namespacedKey
 * @return {boolean}
 */
export function isValidModKey(namespacedKey) {
    const separatorIndex = namespacedKey.indexOf(':');
    if (separatorIndex < 1 || separatorIndex === namespacedKey.length - 1) {
        return false;
    }
    return !namespacedKey.startsWith('minecraft:') && !namespacedKey.includes(' ');
}

export function hasDuplicatedObjects(objects) {
    for (const a of objects) {
        for (const b of objects) {
            if (a !== b && objectsEqual(a, b)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * @param {object} feature Unserialized feature
 * @returns {{type: string, config: object}[]} Decorators list
 */
export function findDecorators(feature) {
    const decorators = [];

    let f = feature;
    (function find(obj) {
        for (const key of Object.keys(obj)) {
            if (key === 'decorator') {
                decorators.unshift(obj[key]);
                if ((obj.feature.type || obj.feature.name) !== 'minecraft:decorated') {
                    f = obj.feature;
                }
            } else if (typeof obj[key] === 'object') {
                find(obj[key]);
            }
        }
    }(feature));

    if (f === null) {
        f = {};
    }
    return [decorators, f];
}

/**
 * @param {string|object} feature 
 * @param {{type: string, config: object}[]} decorators 
 * @param {string} name
 * @returns {object} Decorated feature
 */
export function buildDecorated(feature, decorators, name) {
    if (decorators.length < 1) {
        feature.key = name;
        return feature;
    }

    const decorated = { type: 'minecraft:decorated', key: name };
    let current = decorated;
    decorators.forEach((decorator, i) => {
        const f = i === (decorators.length - 1) ? feature : { type: 'minecraft:decorated' };
        current.config = {
            feature: f,
            decorator
        };
        current = f;
        if (i < 1 && typeof f === 'object') {
            f.name = name;
        }
    });
    return decorated;
}

/**
 * Rename object keys.
 * 
 * @param {object} obj 
 * @param {object} map 
 * @returns {object}
 */
function refitKeys(obj, map) {
    const build = {};
    for (const key in obj) {
        const destKey = map[key] || key;

        let value = obj[key];
        if (typeof value === 'object') {
            value = refitKeys(value, map);
        }
        build[destKey] = value;
    }
    return build;
}

/**
 * @param {string} group 
 * @param {object} data 
 * @returns {object}
 */
export function dataUpper(group, data) {
    switch (group) {
        case 'biomes':
            // 20w30a: sky_color into effects
            if (data.hasOwnProperty('sky_color')) {
                data.effects.sky_color = data.sky_color;
            }
            return data;
        case 'features':
            // 20w30a: name -> type
            const [decorators, feature] = findDecorators(data);
            if (!feature.hasOwnProperty('type') && typeof feature === 'object') {
                feature.type = feature.name;
                delete feature.name;
                return buildDecorated(
                    feature,
                    decorators.map(decorator => refitKeys(decorator, { name: 'type' })),
                    data.key
                );
            }
            return data;
        case 'dimensions':
            // 20w30a: multi_noise: firstOctave and amplitudes parameters
            const source = data.generator.biome_source;
            if (source.type === 'minecraft:multi_noise' && NOISES_NAMES.some(n => !source.hasOwnProperty(n))) {
                data.generator.biome_source = { ...MULTI_NOISE_BIOME_SOURCE, ...source };
            }
            return data;
        case 'dimension_types':
            // 1.16.2-pre-2 : shrunk -> coordinate_scale
            if (data.hasOwnProperty('shrunk')) {
                data.coordinate_scale = data.shrunk ? 8 : 1;
                delete data.shrunk;
            }
            return data;
        default:
            // 20w30a: name -> type
            if (data.hasOwnProperty('name') && !data.hasOwnProperty('type')) {
                data.type = data.name;
            }
            return data;
    }
}

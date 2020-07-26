export function objectsEqual(a, b) {
    return Object.keys(a).length === Object.keys(b).length 
        && Object.keys(a).every(p => a[p] === b[p]);
}

export function getStateValue(state, properties = {}) {
    const actual = properties[state.name];
    switch(state.type) {
        case 'bool':
            return actual === 'true' ? 'true' : 'false';
        case 'int':
            return actual || 0;
        default:
            return actual || state.values[0];
    }
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
    
    let f = null;
    (function find(obj) {
        for (const key of Object.keys(obj)) {
            if (key === 'decorator') {
                decorators.unshift(obj[key]);
                if (f === null && !obj.feature.hasOwnProperty('decorator')) {
                    f = obj.feature;
                }
            } else if (typeof obj[key] === 'object') {
                find(obj[key]);
            }
        }
    } (feature));

    if (f === null) {
        f = {};
    }
    return [decorators, f];
}

/**
 * @param {object} feature 
 * @param {{type: string, config: object}[]} decorators 
 * @param {string} name
 * @returns {object} Decorated feature
 */
export function buildDecorated(feature, decorators, name) {
    if (decorators.length < 1) {
        return feature;
    }

    const decorated = { type: 'minecraft:decorated' };
    let current = decorated;
    decorators.forEach((decorator, i) => {
        const f = i === (decorators.length - 1) ? feature : { type: 'minecraft:decorated' };
        current.config = {
            feature: f,
            decorator
        };
        current = f;
        if (i < 1) {
            f.name = name;
        }
    });
    return decorated;
}
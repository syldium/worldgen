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
 * @returns {{name: string, config: object}[]} Decorators list
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
 * @param {{name: string, config: object}[]} decorators 
 * @returns {object} Decorated feature
 */
export function buildDecorated(feature, decorators) {
    if (decorators.length < 1) {
        return feature;
    }

    const decorated = { name: 'minecraft:decorated' };
    let current = decorated;
    decorators.forEach((decorator, i) => {
        let f = i === (decorators.length - 1) ? feature : { name: 'minecraft:decorated' };
        current.config = {
            feature: f,
            decorator
        };
        current = f;
    });
    return decorated;
}
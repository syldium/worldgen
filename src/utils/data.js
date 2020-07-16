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
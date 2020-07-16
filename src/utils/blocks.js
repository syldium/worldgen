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
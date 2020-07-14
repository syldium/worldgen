export function hexColorToInteger(color) {
    return parseInt(color.replace(/^#/, ''), 16);
}

export function integerColorToHex(color) {
    return '#' + (color & 0xFFFFFF).toString(16).padStart(6, '0');
}
export const INT_MIN_VALUE = 0x80000000 & 0x80000000;
export const INT_MAX_VALUE = 0x7FFFFFFF;

/**
 * @param {number} n 
 * @returns {number}
 */
export function maintainPrecision(n) {
    return parseFloat(n.toFixed(12));
}

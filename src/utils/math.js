export const INT_MIN_VALUE = 0x80000000 & 0x80000000;
export const INT_MAX_VALUE = 0x7FFFFFFF;

/**
 * @param {number} n 
 * @returns {number}
 */
export function maintainPrecision(n) {
    try {
        return parseFloat(n.toFixed(12));
    } catch (e) {
        console.error(e);
        return n;
    }
}

/**
 * @param {number} t 
 * @returns {number}
 */
export function perlinFade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

export function lerp(delta, start, end) {
    return start + delta * (end - start);
}

export function lerp2(deltaX, deltaY, n00, n10, n01, n11) {
    return lerp(deltaY, lerp(deltaX, n00, n10), lerp(deltaX, n01, n11));
}

export function lerp3(deltaX, deltaY, deltaZ, n000, n100, n010, n110, n001, n101, n011, n111) {
    return lerp(deltaZ, lerp2(deltaX, deltaY, n000, n100, n010, n110), lerp2(deltaX, deltaY, n001, n101, n011, n111));
}

export function grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

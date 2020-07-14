export function hashCode(s) {
    let hash;
    for (let i = 0; i < s.length; i++) { 
        hash = Math.imul(31, hash) + s.charCodeAt(i) | 0;
    }
    return hash;
}
import { useState } from "react";

/**
 * @param {boolean} initial 
 * @returns {[boolean, function(): void]}
 */
export function useToggle(initial = false) {
    const [status, setState] = useState(initial);
    const toggle = function (e = null) {
        if (typeof e === 'boolean') {
            setState(e);
            return;
        }
        if (e !== null) {
            e.preventDefault();
        }
        setState(current => !current);
    }
    return [status, toggle];
}
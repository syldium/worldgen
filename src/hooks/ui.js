import { useCallback, useEffect, useRef, useState } from "react";

/**
 * @param {boolean} initial 
 * @returns {[boolean, function(): void]}
 */
export function useToggle(initial = false) {
    const [status, setState] = useState(initial);
    const toggle = useCallback(function (e = null) {
        if (e !== null && (typeof e === 'boolean' || typeof e.target.checked === 'boolean')) {
            setState(typeof e === 'boolean' ? e : e.target.checked);
            return;
        }
        
        if (e !== null && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        setState(current => !current);
    }, []);
    return [status, toggle];
}

/**
 * 
 * @param {string} [page] 
 * @param {number} [index] 
 * @returns {[string, number, function (SyntheticEvent, string, number): void]}
 */
export function useMenu(page = 'main', index = -1) {
    const [state, setState] = useState({ page, index });

    const setPage = function (e, page = 'main', index = -1) {
        if (e !== null) {
            e.preventDefault();
        }
        if (index < 0) {
            setState({ page });
        } else {
            setState({ page, index });
        }
    }

    return [
        state.page,
        state.index,
        setPage
    ];
}

/**
 * @param {function(HTMLCanvasElement, CanvasRenderingContext2D): void} callback
 * @returns {React.MutableRefObject}
 */
export function useCanvas(callback) {
    const reference = useRef(null);

    useEffect(function() {
        const canvas = reference.current;
        const ctx = canvas.getContext('2d');
        callback(canvas, ctx);
    }, [callback]);

    return reference;
}
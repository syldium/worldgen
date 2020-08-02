import { useState, useRef, useEffect } from "react";

/**
 * @param {boolean} initial 
 * @returns {[boolean, function(): void]}
 */
export function useToggle(initial = false) {
    const [status, setState] = useState(initial);
    const toggle = function (e = null) {
        if (e !== null && (typeof e === 'boolean' || typeof e.target.checked === 'boolean')) {
            setState(typeof e === 'boolean' ? e : e.target.checked);
            return;
        }
        
        if (e !== null && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        setState(current => !current);
    }
    return [status, toggle];
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
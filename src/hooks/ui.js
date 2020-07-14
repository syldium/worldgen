import { useState } from "react";

export function useToggle(intial = false) {
    const [status, setState] = useState(intial);
    const toggle = function (e = false) {
        if (e !== false) {
            e.preventDefault();
        }
        setState(current => !current);
    }
    return [status, toggle];
}
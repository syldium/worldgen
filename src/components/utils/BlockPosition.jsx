import React, { useCallback } from 'react';

import { INT_MIN_VALUE } from '../../utils/math';
import { NumberInput } from '../../ui/Input';

export const BlockPosition = React.memo(function ({ children, id, onChange, optional = false, position }) {

    const handleCheckboxChange = useCallback(function (e) {
        onChange(e.target.checked ? [0, 0, 0] : null);
    }, [onChange]);
    const handleXChange = useCallback(function (x) {
        onChange([x, position[1], position[2]]);
    }, [onChange, position]);
    const handleYChange = useCallback(function (y) {
        onChange([position[0], y, position[2]]);
    }, [onChange, position]);
    const handleZChange = useCallback(function (z) {
        onChange([position[0], position[1], z]);
    }, [onChange, position]);

    return <div className="form-row">
        {children}
        {Array.isArray(position) && <>
            <NumberInput id="x" value={position[0]} min={INT_MIN_VALUE} className="mls" onChange={handleXChange}>x</NumberInput>
            <NumberInput id="y" value={position[1]} min={INT_MIN_VALUE} className="mls" onChange={handleYChange}>y</NumberInput>
            <NumberInput id="z" value={position[2]} min={INT_MIN_VALUE} className="mls" onChange={handleZChange}>z</NumberInput>
        </>}
        {optional && <input type="checkbox" className="checkbox" id={id} checked={Array.isArray(position)} onChange={handleCheckboxChange} />}
    </div>
});

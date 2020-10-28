import React from 'react';
import Select from '../../ui/Select';

const options = [
    { value: 'WORLD_SURFACE_WG', label: 'World surface (non-air block)' },
    { value: 'WORLD_SURFACE', label: 'World surface for client' },
    { value: 'OCEAN_FLOOR_WG', label: 'Ocean floor (non-air block, solid block)' },
    { value: 'OCEAN_FLOOR', label: 'Ocean floor for client' },
    { value: 'MOTION_BLOCKING', label: 'Motion blocking (that blocks motion or contains a fluid)' },
    { value: 'MOTION_BLOCKING_NO_LEAVES', label: 'Motion blocking no leaves (that blocks motion or contains a fluid or is leaves)' }
];

/**
 * @param heightmap {string}
 * @param onChange {function({ value: string, label: string })}
 */
export function Heightmap({ heightmap, onChange }) {
    return <Select options={options} value={options.find(o => o.value === heightmap) || null} onChange={onChange} />
}

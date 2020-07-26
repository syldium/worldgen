import React, { useState, useEffect, useCallback } from 'react';
import { integerColorToHex, hexColorToInteger } from '../../utils/color';
import { EFFECTS } from './BiomeDefaults';
import { useToggle } from '../../hooks/ui';

export function BiomeEffects({effects = EFFECTS, onChange}) {

    const [colors, setColors] = useState(effects);
    const [optional, toggleOption] = useToggle(effects.hasOwnProperty('foliage_color') || effects.hasOwnProperty('grass_color'));

    const handleColorChange = useCallback(function(e) {
        const id = e.target.id;
        const value = e.target.value;
        setColors(colors => ({
            ...colors,
            [id]: hexColorToInteger(value)
        }));
    }, []);

    const handleToggleChange = useCallback(function(e) {
        toggleOption(e.target.checked);
    }, [toggleOption]);

    useEffect(function () {
        const next = { ...colors };
        if (!optional) {
            delete next.foliage_color;
            delete next.grass_color;
        }
        onChange(next);
    }, [optional, colors, onChange]);

    return <>
        <div className="form-inline">
            <label htmlFor="sky_color">Sky color</label> : <input type="color" id="sky_color" required value={integerColorToHex(colors.sky_color)} onChange={handleColorChange} />
        </div>
        <div className="form-inline">
            <label htmlFor="fog_color">Fog color</label> : <input type="color" id="fog_color" value={integerColorToHex(colors.fog_color)} onChange={handleColorChange} />
        </div>
        <div className="form-inline">
            <label htmlFor="water_color">Water color</label> : <input type="color" id="water_color" value={integerColorToHex(colors.water_color)} onChange={handleColorChange} />
        </div>
        <div className="form-inline">
            <label htmlFor="water_fog_color">Water fog color</label> : <input type="color" id="water_fog_color" value={integerColorToHex(colors.water_fog_color)} onChange={handleColorChange} />
        </div>
        {optional && <>
            <div className="form-inline">
                <label htmlFor="foliage_color">Foliage color</label> : <input type="color" id="foliage_color" value={integerColorToHex(colors.foliage_color || 10387789)} onChange={handleColorChange} />
            </div>
            <div className="form-inline">
                <label htmlFor="grass_color">Grass color</label> : <input type="color" id="grass_color" value={integerColorToHex(colors.grass_color || 9470285)} onChange={handleColorChange} />
            </div>
        </>}
        <div className="form-inline">
            <label htmlFor="block-toggle">Optionals</label> : <input type="checkbox" id="block-toggle" className="checkbox" checked={optional} onChange={handleToggleChange} />
        </div>
    </>
}
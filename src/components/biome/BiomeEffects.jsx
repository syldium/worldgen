import React, { useState, useEffect } from 'react';
import { integerColorToHex, hexColorToInteger } from '../../utils/color';
import { EFFECTS } from './BiomeDefaults';

export function BiomeEffects({effects = EFFECTS, onChange}) {

    const [colors, setColors] = useState(effects);

    const handleColorChange = function(e) {
        e.persist();
        setColors(colors => ({
            ...colors,
            [e.target.id]: hexColorToInteger(e.target.value)
        }));
        onChange(colors);
    };

    useEffect(function () {
        onChange(colors);
    }, [colors, onChange]);

    return <>
        <div className="form-inline">
            <label htmlFor="sky_color">Sky color</label> : <input type="color" name="sky_color" required value={integerColorToHex(data.sky_color)} />
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
        <div className="form-inline">
            <label htmlFor="foliage_color">Foliage color</label> : <input type="color" id="foliage_color" value={integerColorToHex(colors.foliage_color)} onChange={handleColorChange} />
        </div>
        <div className="form-inline">
            <label htmlFor="grass_color">Grass color</label> : <input type="color" id="grass_color" value={integerColorToHex(colors.grass_color)} onChange={handleColorChange} />
        </div>
    </>
}
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '../../ui/Button';
import { MultiNoiseDimension } from '../../viewers/biome_multi_noise/MultiNoiseDimension';
import { integerColorToHex } from '../../utils/color';
import { useToggle } from '../../hooks/ui';

export const MultiNoiseRepresentation = React.memo(function ({ source }) {

    const [auto, toggle] = useToggle();
    const [scale, setScale] = useState(4);
    const reference = useRef(null);

    const render = useCallback(function () {
        if ((source.biomes || []).length < 1) {
            return;
        }
        const canvas = reference.current;
        const ctx = canvas.getContext('2d', { alpha: false });
        const img = ctx.createImageData(canvas.width, canvas.height);
        const dimension = new MultiNoiseDimension(source);
        dimension.createImageData(img, scale);
        ctx.putImageData(img, 0, 0);
    }, [scale, source]);

    const handleClick = useCallback(function (e) {
        e.preventDefault();
        render();
    }, [render]);

    const handleScaleChange = useCallback(function (e) {
        setScale(parseInt(e.target.value));
    }, []);

    useEffect(function () {
        if (auto) {
            render();
        }
    }, [auto, render]);

    return <fieldset>
        <legend>Preview</legend>
        <div className="form-row">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <canvas height="128" width="384" ref={reference} moz-opaque="true"></canvas>
            </div>
            <div>
                <label htmlFor="scale">Scale</label> : <input type="range" id="scale" min="1" max="8" value={scale} onChange={handleScaleChange} /> ({1 << scale} block/px)<br />
                <label htmlFor="auto-update">Auto update (affects performance)</label> : <input type="checkbox" className="checkbox" checked={auto} onChange={toggle} id="auto-update" /><br />
                {(source.biomes || []).length > 0 && !auto && <Button onClick={handleClick}>Render</Button>}
            </div>
        </div>
        <ul className="form-group form-row" style={{ justifyContent: 'start' }}>
            {Object.entries(MultiNoiseDimension.getBiomesColors(source.biomes)).map(([biome, color]) => {
                const b = (color >> 16) & 0xFF;
                const g = (color >> 8) & 0xFF;
                const r = color & 0xFF;
                return <li key={biome} style={{ display: 'inline', marginLeft: '8px', marginRight: '4px' }}>
                    <div style={{
                        backgroundColor: integerColorToHex(((r << 16) | (g << 8) | b)),
                        width: '32px', height: '16px',
                        display: 'inline-block',
                        marginRight: '0.5rem',
                        verticalAlign: 'middle'
                    }}></div>
                    {biome}
                </li>
            })}
        </ul>
    </fieldset>
});

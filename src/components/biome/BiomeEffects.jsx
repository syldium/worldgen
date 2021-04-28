import { ColorInput, ConfInput, NumberInput } from '../../ui/Input';
import { PARTICLES, PARTICLE_DEFAULTS } from './BiomeDefaults';
import React, { useCallback, useContext, useState } from 'react';

import { BlockState } from '../state/BlockState';
import { DataContext } from '../../context/DataContext';
import { useJsonEffect } from '../../hooks/form';
import Select from '../../ui/Select';

export const BiomeEffects = React.memo(function ({ effects, onChange }) {

    const [blockColor, setBlockColor] = useState(effects);
    const [particle, setParticle] = useState(effects.particle);

    const sounds = useContext(DataContext).vanilla.sounds;

    const handleColorChange = useCallback(function (color) {
        onChange({ ...effects, ...color });
    }, [effects, onChange]);

    const handleBlockColorChange = useCallback(function (color) {
        onChange({ ...effects, ...color });
        setBlockColor({ ...blockColor, ...color });
    }, [blockColor, effects, onChange]);
    const handleAmbientSoundChange = useCallback(function (option) {
        if (option === null) {
            onChange((({ ambient_sound, ...effects }) => effects)(effects));
        } else {
            onChange({ ...effects, ambient_sound: option.value });
        }
    }, [effects, onChange]);
    const handleMoodSoundChange = useCallback(function (mood_sound) {
        if (mood_sound === null) {
            onChange((({ mood_sound, ...effects }) => effects)(effects));
        } else {
            if (typeof effects.mood_sound === 'undefined') {
                onChange({
                    ...effects, mood_sound: {
                        tick_delay: 6000,
                        block_search_extent: 8,
                        offset: 2.0, ...mood_sound
                    }
                });
            } else {
                onChange({ ...effects, mood_sound: { ...effects.mood_sound, ...mood_sound } });
            }
        }
    }, [effects, onChange]);
    const handleParticleChange = useCallback(function (particle) {
        onChange({ ...effects, particle });
        setParticle(particle);
    }, [effects, onChange]);

    const handleBlockColorToggle = useCallback(function (e) {
        if (e.target.checked) {
            onChange({ ...effects, foliage_color: blockColor.foliage_color || 10387789, grass_color: blockColor.grass_color || 9470285 });
        } else {
            onChange((({ foliage_color, grass_color, ...effects }) => effects)(effects));
        }
    }, [blockColor, effects, onChange]);
    const handleParticleToggle = useCallback(function (e) {
        if (e.target.checked) {
            onChange({ ...effects, particle: particle || PARTICLE_DEFAULTS });
        } else {
            onChange((({ particle, ...effects }) => effects)(effects));
        }
    }, [onChange, effects, particle]);

    const blockColorChecked = effects.hasOwnProperty('foliage_color') || effects.hasOwnProperty('grass_color');
    const particleChecked = effects.hasOwnProperty('particle');

    return <>
        <fieldset>
            <legend>Biome effects</legend>
            <div className="form-group form-row">
                <ColorInput id="sky_color" value={effects.sky_color} upChange={handleColorChange}>Sky color</ColorInput>
                <ColorInput id="fog_color" value={effects.fog_color} upChange={handleColorChange}>Fog color</ColorInput>
                <ColorInput id="water_color" value={effects.water_color} upChange={handleColorChange}>Water color</ColorInput>
                <ColorInput id="water_fog_color" value={effects.water_fog_color} upChange={handleColorChange}>Water fog color</ColorInput>
                {blockColorChecked && <>
                    <ColorInput id="foliage_color" value={effects.foliage_color || 10387789} upChange={handleBlockColorChange}>Foliage color</ColorInput>
                    <ColorInput id="grass_color" value={effects.grass_color || 9470285} upChange={handleBlockColorChange}>Grass color</ColorInput>
                </>}
                <ConfInput id="block-toggle" checked={blockColorChecked} onChange={handleBlockColorToggle}>Optionals</ConfInput>
                <ConfInput id="particle" checked={particleChecked} onChange={handleParticleToggle}>Particle</ConfInput>
            </div>
            {particleChecked && <ParticleEffect particle={effects.particle} onChange={handleParticleChange} />}
        </fieldset>
        <fieldset>
            <legend>Optionals sounds</legend>
            <div className="form-group form-row">
                Ambient :
            <div style={{ flexGrow: 0.95, flexShrink: 1 }}><Select options={sounds} value={sounds.find(o => effects.ambient_sound === o.value)} onChange={handleAmbientSoundChange} isClearable={true} /></div>
            </div>
            <MoodSound options={sounds} sound={effects.mood_sound} onChange={handleMoodSoundChange} />
        </fieldset>
    </>
});

const MoodSound = React.memo(function ({ onChange, options, sound }) {
    const handleSoundChange = useCallback(function (option) {
        onChange(option === null ? null : { sound: option.value });
    }, [onChange]);

    return <>
        <div className="form-group form-row">
            Mood :
            <div style={{ flexGrow: 0.95, flexShrink: 1 }}><Select options={options} value={options.find(o => (sound || {}).sound === o.value)} onChange={handleSoundChange} isClearable={true} /></div>
        </div>
        {typeof sound === 'object' && <div className="form-row" style={{ marginTop: '0.5rem' }}>
            <NumberInput id="tick_delay" value={sound.tick_delay} upChange={onChange} className="mls">Tick delay</NumberInput>
            <NumberInput id="block_search_extent" value={sound.block_search_extent} upChange={onChange} className="mls">Block search extent</NumberInput>
            <NumberInput id="offset" value={sound.offset} upChange={onChange} step={0.1} className="mls">Offset</NumberInput>
        </div>}
    </>
});

const ParticleEffect = React.memo(function ({ onChange, particle }) {

    particle = useJsonEffect(particle || PARTICLE_DEFAULTS, particle, onChange);
    const handleTypeChange = useCallback(function (option) {
        onChange({ ...particle, options: { type: option.value } });
    }, [particle, onChange]);
    const handleBlockChange = useCallback(function (block) {
        onChange({ ...particle, options: { ...particle.options, ...block } });
    }, [particle, onChange]);
    const handleColorChange = useCallback(function (color) {
        onChange({ ...particle, options: { ...particle.options, ...color } });
    }, [particle, onChange]);
    const handleScaleChange = useCallback(function (scale) {
        onChange({ ...particle, options: { ...particle.options, scale } });
    }, [particle, onChange]);
    const handleProbabilityChange = useCallback(function (probability) {
        onChange({ ...particle, probability });
    }, [particle, onChange]);

    const o = particle.options;
    return <div className="form-group form-row">
        <div style={{ flexGrow: 0.95, flexShrink: 1 }}><Select options={PARTICLES} value={PARTICLES.find(op => o.type === op.value)} onChange={handleTypeChange} /></div>
        {(o.type === 'minecraft:block' || o.type === 'minecraft:falling_dust') && <div style={{ flexGrow: 1 }}><BlockState block={o} onChange={handleBlockChange} /></div>}
        {o.type === 'minecraft:dust' && <>
            <DustColor r={o.r} g={o.g} b={o.b} onChange={handleColorChange} />
            <NumberInput id="scale" value={o.scale} onChange={handleScaleChange} defaultValue="1" step="0.1" className="mls">Scale</NumberInput>
        </>}
        <NumberInput id="probability" value={particle.probability} onChange={handleProbabilityChange} step="0.005" className="mlm">Probability</NumberInput>
    </div>
});

const DustColor = React.memo(function ({ r, g, b, onChange }) {
    const handleColorChange = useCallback(function (color) {
        const r = ((color >> 16) & 0xFF) / 0xFF;
        const g = ((color >> 8) & 0xFF) / 0xFF;
        const b = (color & 0xFF) / 0xFF;
        onChange({ r, g, b });
    }, [onChange]);

    let value = undefined;
    if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
        r = (r * 0xFF) & 0xFF;
        g = (g * 0xFF) & 0xFF;
        b = (b * 0xFF) & 0xFF;
        value = ((r << 16) | (g << 8) | b);
    }

    return <ColorInput value={value} defaultValue={0x38470} onChange={handleColorChange} className="mls">Color</ColorInput>
});

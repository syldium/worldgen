import React, { useState, useEffect, useCallback } from 'react';
import { EFFECTS, PARTICLES, PARTICLE_DEFAULTS } from './BiomeDefaults';
import { useToggle } from '../../hooks/ui';
import { NumberInput, ConfInput } from '../../ui/Input';
import Select from 'react-select';
import { BlockState } from '../state/BlockState';
import { useJsonEffect } from '../../hooks/form';

export function BiomeEffects({effects, onChange}) {

    const [colors, setColors] = useState(effects || EFFECTS);
    const [blockColor, toggleBlockColor] = useToggle(colors.hasOwnProperty('foliage_color') || colors.hasOwnProperty('grass_color'));
    const [particle, toggleParticle] = useToggle(colors.hasOwnProperty('particle'));

    const handleColorChange = useCallback(function(color) {
        setColors(colors => ({ ...colors, ...color }));
    }, []);
    const handleParticleChange = useCallback(function(particle) {
        setColors(colors => ({ ...colors, particle }));
    }, []);

    useEffect(function () {
        const next = { ...colors };
        if (!blockColor) {
            delete next.foliage_color;
            delete next.grass_color;
        }
        if (!particle) {  
            delete next.particle;
        }
        onChange(next);
    }, [blockColor, colors, effects, onChange, particle]);

    return <fieldset>
        <legend>Biome effects</legend>
        <div className="form-group form-row">
            <NumberInput type="color" id="sky_color" value={colors.sky_color} upChange={handleColorChange}>Sky color</NumberInput>
            <NumberInput type="color" id="fog_color" value={colors.fog_color} upChange={handleColorChange}>Fog color</NumberInput>
            <NumberInput type="color" id="water_color" value={colors.water_color} upChange={handleColorChange}>Water color</NumberInput>
            <NumberInput type="color" id="water_fog_color" value={colors.water_fog_color} upChange={handleColorChange}>Water fog color</NumberInput>
            {blockColor && <>
                <NumberInput type="color" id="foliage_color" value={colors.foliage_color || 10387789} upChange={handleColorChange}>Foliage color</NumberInput>
                <NumberInput type="color" id="grass_color" value={colors.grass_color  || 9470285} upChange={handleColorChange}>Grass color</NumberInput>
            </>}
            <ConfInput id="block-toggle" checked={blockColor} onChange={toggleBlockColor}>Optionals</ConfInput>
            <ConfInput id="particle" checked={particle} onChange={toggleParticle}>Particle</ConfInput>
        </div>
        {particle && <ParticleEffect particle={colors.particle} onChange={handleParticleChange} />}
    </fieldset>
}

function ParticleEffect({onChange, particle}) {

    particle = useJsonEffect(particle || PARTICLE_DEFAULTS, particle, onChange);
    const handleTypeChange = useCallback(function(option) {
        onChange({ ...particle, options: { type: option.value } });
    }, [particle, onChange]);
    const handleBlockChange = useCallback(function(block) {
        onChange({ ...particle, options: { ...particle.options, ...block } });
    }, [particle, onChange]);
    const handleColorChange = useCallback(function(color) {
        onChange({ ...particle, options: { ...particle.options, ...color } });
    }, [particle, onChange]);
    const handleScaleChange = useCallback(function(scale) {
        onChange({ ...particle, options: { ...particle.options, scale } });
    }, [particle, onChange]);
    const handleProbabilityChange = useCallback(function(probability) {
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
}

function DustColor({ r, g, b, onChange }) {
    const handleColorChange = useCallback(function(color) {
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

    return <NumberInput type="color" value={value} defaultValue={0x38470} onChange={handleColorChange} className="mls">Color</NumberInput>
}
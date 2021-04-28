import { ConfInput, NumberInput } from '../../ui/Input';
import React, { useCallback, useState } from 'react';

import { BlockState } from '../state/BlockState';
import { Button } from '../../ui/Button';
import { INT_MIN_VALUE } from '../../utils/math';
import { JsonViewer } from '../../ui/JsonViewer';
import { NamespacedKey } from '../NamespacedKey';
import { OVERWORLD_NOISE } from './NoiseDefaults';
import { Structures } from './Structures';
import { useKeyedListOptions } from '../../hooks/context';
import { useValueChange } from '../../hooks/form';
import Select from '../../ui/Select';

export const NoiseGenerator = React.memo(function({onChange, settings = 'minecraft:overworld'}) {
    const options = useKeyedListOptions('noises').map(option => {
        option.resource = option.value;
        return option;
    });

    const handleChange = useCallback(function(option) {
        onChange(option.resource);
    }, [onChange]);

    if (typeof settings === 'object') {
        options.push({ value: 'inline', label: 'inline', resource: settings });
    }

    return <div className="form-group">
        <label htmlFor="settings">Noise settings</label><Select options={options} value={options.find(o => o.resource === settings)} onChange={handleChange} inputId="settings" />
    </div>;
});

export const NoiseSettings = React.memo(function ({ data = OVERWORLD_NOISE, onSave }) {

    const [state, setState] = useState(data);

    const handleSubmit = useCallback(function (e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        onSave({ ...state, ...formData });
    }, [onSave, state]);

    const handleBlockChange = useCallback(function (name, s) {
        setState(state => ({ ...state, [name]: s }));
    }, []);
    const handleStructuresChange = useCallback(function (structures) {
        setState(state => ({ ...state, structures }));
    }, []);
    const handleNoiseChange = useCallback(function (noise) {
        setState(state => ({ ...state, noise: { ...state.noise, ...noise } }));
    }, []);
    const handleChange = useCallback(function(value) {
        setState(state => ({ ...state, ...value }));
    }, []);
    const handleDisableMobGenerationChange = useCallback(function(e) {
        const disable_mob_generation = e.target.checked;
        setState(state => ({ ...state, disable_mob_generation }));
    }, []);

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="epic" type="noises" value={data.key} expectBreakage={typeof data.key !== 'undefined'} onSelectLoad={setState}>
            noise
            <JsonViewer data={state} />
        </NamespacedKey>

        <Structures data={state.structures} onChange={handleStructuresChange} />

        <fieldset>
            <legend>Defaults</legend>
            <div className="form-group">
                <label>Block</label> : <BlockState block={state.default_block} onChange={state => handleBlockChange('default_block', state)} />
            </div>
            <div className="form-group">
                <label>Fluid</label> : <BlockState block={state.default_fluid} onChange={state => handleBlockChange('default_fluid', state)} />
            </div>
        </fieldset>

        <fieldset>
            <legend>Main</legend>
            <div className="form-group form-row">
                <NumberInput id="bedrock_roof_position" value={state.bedrock_roof_position} min={-20} max={276} upChange={handleChange}>Bedrock roof position</NumberInput>
                <NumberInput id="bedrock_floor_position" value={state.bedrock_floor_position} min={-20} max={276} upChange={handleChange}>Bedrock floor position</NumberInput>
                <NumberInput id="sea_level" value={state.sea_level} max={255} upChange={handleChange}>Sea level</NumberInput>
                <ConfInput id="disable_mob_generation" checked={state.disable_mob_generation} onChange={handleDisableMobGenerationChange}>Disable mob generation</ConfInput>
            </div>
        </fieldset>

        {Object.keys(state.structures.structures).includes('minecraft:nether_fossil') && (state.noise.height - 2 - state.sea_level) < 0 &&
            <p className="alert--warning">The game may crash when trying to generate nether fossils, because (height - 2 - sea_level) is negative (actually: {state.noise.height - 2 - state.sea_level}).</p>
        }
        <NoiseConfig data={state.noise} onChange={handleNoiseChange} />

        <Button type="submit">Save</Button>
    </form>;
});

const NoiseConfig = React.memo(function ({ data, onChange }) {

    const handleChange = useValueChange(onChange, data);
    const handleSamplingChange = useCallback(function (sampling) {
        onChange({ ...data, sampling: { ...data.sampling, ...sampling } });
    }, [data, onChange]);
    const handleTopSlideChange = useCallback(function (top_slide) {
        onChange({ ...data, top_slide: { ...data.top_slide, ...top_slide } });
    }, [data, onChange]);
    const handleBottomSlideChange = useCallback(function (bottom_slide) {
        onChange({ ...data, bottom_slide: { ...data.bottom_slide, ...bottom_slide } });
    }, [data, onChange]);

    return <fieldset>
        <legend>Noise config (advanced)</legend>
        <div className="form-group form-row">
            <NumberInput id="height" value={data.height} upChange={onChange} max={256}>Height</NumberInput>
            <NumberInput id="size_horizontal" value={data.size_horizontal} upChange={onChange} min={1} max={4}>Size horizontal</NumberInput>
            <NumberInput id="size_vertical" value={data.size_vertical} upChange={onChange} min={1} max={4}>Size vertical</NumberInput>
            <NumberInput id="density_factor" value={data.density_factor} upChange={onChange} step={0.01}>Density factor</NumberInput>
            <NumberInput id="density_offset" value={data.density_offset} upChange={onChange} min={INT_MIN_VALUE} step={0.01}>Density offset</NumberInput>
        </div>
        <div className="form-group form-row">
            <ConfInput id="simplex_surface_noise" checked={data.simplex_surface_noise} onChange={handleChange}>Simplex surface noise</ConfInput>
            <ConfInput id="random_density_offset" checked={data.random_density_offset || false} onChange={handleChange}>Random density offset</ConfInput>
            <ConfInput id="island_noise_override" checked={data.island_noise_override || false} onChange={handleChange}>Island noise override</ConfInput>
            <ConfInput id="amplified" checked={data.amplified || false} onChange={handleChange}>Amplified</ConfInput>
        </div>

        <NoiseSamplingConfig data={data.sampling} onChange={handleSamplingChange}>Sampling</NoiseSamplingConfig>
        <SlideConfig data={data.top_slide} onChange={handleTopSlideChange}>Top slide</SlideConfig>
        <SlideConfig data={data.bottom_slide} onChange={handleBottomSlideChange}>Bottom slide</SlideConfig>
    </fieldset>
});

const NoiseSamplingConfig = React.memo(function ({ children, data, onChange }) {

    return <fieldset>
        <legend>{children}</legend>
        <div className="form-group form-row">
            <NumberInput id="xz_scale" value={data.xz_scale} min={0.001} max={1000} step={0.1} upChange={onChange}>XY scale</NumberInput>
            <NumberInput id="y_scale" value={data.y_scale} min={0.001} max={1000} step={0.1} upChange={onChange}>Y scale</NumberInput>
            <NumberInput id="xz_factor" value={data.xz_factor} min={0.001} max={1000} step={0.1} upChange={onChange}>XZ factor</NumberInput>
            <NumberInput id="y_factor" value={data.y_factor} min={0.001} max={1000} step={0.1} upChange={onChange}>Y factor</NumberInput>
        </div>
    </fieldset>
});

const SlideConfig = React.memo(function ({ children, data, onChange }) {

    return <fieldset>
        <legend>{children}</legend>
        <div className="form-group form-row">
            <NumberInput id="target" value={data.target} upChange={onChange} min={INT_MIN_VALUE}>Target</NumberInput>
            <NumberInput id="size" value={data.size} upChange={onChange} max={256}>Size</NumberInput>
            <NumberInput id="offset" value={data.offset} upChange={onChange} min={INT_MIN_VALUE}>Offset</NumberInput>
        </div>
    </fieldset>
});

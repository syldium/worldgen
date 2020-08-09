import React, { useCallback, useState } from 'react';
import { BlockState } from '../state/BlockState';
import { Button } from '../../ui/Button';
import { JsonViewer } from '../../ui/JsonViewer';
import { ConfInput, NumberInput } from '../../ui/Input';
import Select from '../../ui/Select';
import { useValueChange } from '../../hooks/form';
import { OVERWORLD_NOISE } from './NoiseDefaults';
import { Structures } from './Structures';
import { NamespacedKey } from '../NamespacedKey';
import { INT_MIN_VALUE } from '../../utils/number';
import { useKeyedListOptions } from '../../hooks/context';

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
        const data = { ...state, ...formData };
        Object.keys(formData).forEach(function (key) {
            if (!isNaN(formData[key])) {
                data[key] = parseFloat(formData[key]);
            }
        });
        data.disable_mob_generation = formData.hasOwnProperty('disable_mob_generation');
        onSave(data);
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

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="epic" type="noises" value={data.key} expectBreakage={typeof data.key !== 'undefined'}>
            noise
            <JsonViewer data={state} />
        </NamespacedKey>

        <Structures data={data.structures} onChange={handleStructuresChange} />

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
                <NumberInput name="bedrock_roof_position" defaultValue={data.bedrock_roof_position} min={-20} max={276}>Bedrock roof position</NumberInput>
                <NumberInput name="bedrock_floor_position" defaultValue={data.bedrock_floor_position} min={-20} max={276}>Bedrock floor position</NumberInput>
                <NumberInput name="sea_level" defaultValue={data.sea_level} max={256}>Sea level</NumberInput>
                <ConfInput name="disable_mob_generation" defaultChecked={data.disable_mob_generation}>Disable mob generation</ConfInput>
            </div>
        </fieldset>

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
            <NumberInput id="height" value={data.height} upChange={onChange} min="0" max="256">Height</NumberInput>
            <NumberInput id="size_horizontal" value={data.size_horizontal} upChange={onChange} min="1" max="4">Size horizontal</NumberInput>
            <NumberInput id="size_vertical" value={data.size_vertical} upChange={onChange} min="1" max="4">Size vertical</NumberInput>
            <NumberInput id="density_factor" value={data.density_factor} upChange={onChange} step="0.01">Density factor</NumberInput>
            <NumberInput id="density_offset" value={data.density_offset} upChange={onChange} min="-10000" step="0.01">Density offset</NumberInput>
        </div>
        <div className="form-group form-row">
            <ConfInput id="simplex_surface_noise" checked={data.simplex_surface_noise} onChange={handleChange}>Simplex surface noise</ConfInput>
            <ConfInput id="random_density_offset" checked={data.random_density_offset} onChange={handleChange}>Random density offset</ConfInput>
            <ConfInput id="island_noise_override" checked={data.island_noise_override} onChange={handleChange}>Island noise override</ConfInput>
            <ConfInput id="amplified" checked={data.amplified} onChange={handleChange}>Amplified</ConfInput>
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
            <NumberInput name="xz_scale" value={data.xz_scale} upChange={onChange}>XY scale</NumberInput>
            <NumberInput name="y_scale" value={data.y_scale} upChange={onChange}>Y scale</NumberInput>
            <NumberInput name="xz_factor" value={data.xz_factor} upChange={onChange}>XZ factor</NumberInput>
            <NumberInput name="y_factor" value={data.y_factor} upChange={onChange}>Y factor</NumberInput>
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

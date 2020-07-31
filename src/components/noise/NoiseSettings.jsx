import React, { useCallback, useState } from 'react';
import { BlockState } from '../state/BlockState';
import { Button } from '../../ui/Button';
import { useValueChange } from '../../hooks/form';
import { ConfInput } from '../../ui/Input';
import { OVERWORLD_NOISE } from './NoiseDefaults';
import { Structures } from './Structures';
import { NamespacedKey } from '../NamespacedKey';

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
        setState(state => ({ ...state, noise }));
    }, []);

    return <form onSubmit={handleSubmit}>
        <h3>Edit noise</h3>
        <NamespacedKey example="epic" type="noises" value={data.key} expectBreakage={typeof data.key !== 'undefined'} />

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
                <ConfInput name="bedrock_roof_position" defaultValue={data.bedrock_roof_position}>Bedrock roof position</ConfInput>
                <ConfInput name="bedrock_floor_position" defaultValue={data.bedrock_floor_position}>Bedrock floor position</ConfInput>
                <ConfInput name="sea_level" defaultValue={data.sea_level} min="0" max="256">Sea level</ConfInput>
                <ConfInput name="disable_mob_generation" defaultChecked={data.disable_mob_generation}>Disable mob generation</ConfInput>
            </div>
        </fieldset>

        <NoiseConfig data={data.noise} onChange={handleNoiseChange} />

        <div className="form-group mlm mbm">
            <Button type="submit">Save</Button>
        </div>
    </form>;
});

const NoiseConfig = React.memo(function ({ data, onChange }) {

    const handleChange = useValueChange(onChange, data);
    const handleSamplingChange = useCallback(function (sampling) {
        onChange({ ...data, sampling });
    }, [data, onChange]);
    const handleTopSlideChange = useCallback(function (top_slide) {
        onChange({ ...data, top_slide });
    }, [data, onChange]);
    const handleBottomSlideChange = useCallback(function (bottom_slide) {
        onChange({ ...data, bottom_slide });
    }, [data, onChange]);

    return <fieldset>
        <legend>Noise config (advanced)</legend>
        <div className="form-group form-row">
            <ConfInput id="height" defaultValue={data.height} onChange={handleChange} min="0" max="256">Height</ConfInput>
            <ConfInput id="size_horizontal" defaultValue={data.size_horizontal} onChange={handleChange} min="1" max="4">Size horizontal</ConfInput>
            <ConfInput id="size_vertical" defaultValue={data.size_vertical} onChange={handleChange} min="1" max="4">Size vertical</ConfInput>
            <ConfInput id="density_factor" defaultValue={data.density_factor} onChange={handleChange} step="0.01">Density factor</ConfInput>
            <ConfInput id="density_offset" defaultValue={data.density_offset} onChange={handleChange} step="0.01">Density offset</ConfInput>
        </div>
        <div className="form-group form-row">
            <ConfInput id="simplex_surface_noise" defaultChecked={data.simplex_surface_noise} onChange={handleChange}>Simplex surface noise</ConfInput>
            <ConfInput id="random_density_offset" defaultChecked={data.random_density_offset} onChange={handleChange}>Random density offset</ConfInput>
            <ConfInput id="island_noise_override" defaultChecked={data.island_noise_override} onChange={handleChange}>Island noise override</ConfInput>
            <ConfInput id="amplified" defaultChecked={data.amplified} onChange={handleChange}>Amplified</ConfInput>
        </div>

        <NoiseSamplingConfig data={data.sampling} onChange={handleSamplingChange}>Sampling</NoiseSamplingConfig>
        <SlideConfig data={data.top_slide} onChange={handleTopSlideChange}>Top slide</SlideConfig>
        <SlideConfig data={data.bottom_slide} onChange={handleBottomSlideChange}>Bottom slide</SlideConfig>
    </fieldset>
});

const NoiseSamplingConfig = React.memo(function ({ children, data, onChange }) {

    const handleChange = useValueChange(onChange, data);

    return <fieldset>
        <legend>{children}</legend>
        <div className="form-group form-row">
            <ConfInput name="xz_scale" defaultValue={data.xz_scale} onChange={handleChange}>XY scale</ConfInput>
            <ConfInput name="y_scale" defaultValue={data.y_scale} onChange={handleChange}>Y scale</ConfInput>
            <ConfInput name="xz_factor" defaultValue={data.xz_factor} onChange={handleChange}>XZ factor</ConfInput>
            <ConfInput name="y_factor" defaultValue={data.y_factor} onChange={handleChange}>Y factor</ConfInput>
        </div>
    </fieldset>
});

const SlideConfig = React.memo(function ({ children, data, onChange }) {

    const handleChange = useValueChange(onChange, data);

    return <fieldset>
        <legend>{children}</legend>
        <div className="form-group form-row">
            <ConfInput id="target" defaultValue={data.target} onChange={handleChange}>Target</ConfInput>
            <ConfInput id="size" defaultValue={data.size} onChange={handleChange}>Size</ConfInput>
            <ConfInput id="offset" defaultValue={data.offset} onChange={handleChange}>Offset</ConfInput>
        </div>
    </fieldset>
});

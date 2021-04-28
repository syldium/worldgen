import { DECORATORS_OPTIONS, Decorator } from './Decorator';
import React, { useCallback } from 'react';

import { CARVERS_OPTIONS, } from './DecoratorDefaults';
import { INT_MIN_VALUE } from '../../../utils/math';
import { NumberInput } from '../../../ui/Input';
import { UniformInt } from '../../utils/UniformInt';
import Select from '../../../ui/Select';

export const CarvingMaskDecorator = React.memo(function ({ config, onChange }) {
    const handleStepChange = useCallback(function (option) {
        onChange({ probability: config.probability, step: option.value });
    }, [config.probability, onChange]);

    return <>
        <div className="inbl"><Select options={CARVERS_OPTIONS} value={CARVERS_OPTIONS.find(o => config.step === o.value)} onChange={handleStepChange} /></div>
        <NumberInput id="probability" value={config.probability} upChange={onChange} step={0.05}>Probability</NumberInput>
    </>
});

export const ChanceDecorator = React.memo(({ config, onChange }) =>
    <NumberInput id="chance" value={config.chance} defaultValue={32} upChange={onChange}>Chance</NumberInput>
);

export const CountDecorator = React.memo(({ config, onChange }) =>
    <UniformInt id="count" value={config.count} minBase={-10} maxBase={128} maxSpread={128} defaultValue={25} upChange={onChange}>Count</UniformInt>
);

export const CountExtraDecorator = React.memo(({ config, onChange }) =>
    <>
        <NumberInput id="count" value={config.count} upChange={onChange}>Count</NumberInput>
        <NumberInput id="extra_chance" value={config.extra_chance} upChange={onChange} step={0.05}>Extra chance</NumberInput>
        <NumberInput id="extra_count" value={config.extra_count} upChange={onChange}>Extra count</NumberInput>
    </>
);

export const CountNoiseDecorator = React.memo(({ config, onChange }) =>
    <>
        <NumberInput id="noise_level" value={config.noise_level} min={INT_MIN_VALUE} step={0.1} upChange={onChange}>Noise level</NumberInput>
        <NumberInput id="below_noise" value={config.below_noise} upChange={onChange}>Below noise</NumberInput>
        <NumberInput id="above_noise" value={config.above_noise} upChange={onChange}>Above noise</NumberInput>
    </>
);

export const CountNoiseBiasedDecorator = React.memo(({ config, onChange }) =>
    <>
        <NumberInput id="noise_to_count_ratio" value={config.noise_to_count_ratio} upChange={onChange}>Noise to count ratio</NumberInput>
        <NumberInput id="noise_factor" value={config.noise_factor} upChange={onChange} step={0.05}>Noise factor</NumberInput>
        <NumberInput id="noise_offset" value={config.noise_offset} required={false} upChange={onChange} step={0.05}>Noise factor</NumberInput>
    </>
);

export const DecoratedDecorator = React.memo(function ({ config, onChange }) {
    const handleInnerChange = useCallback(inner => onChange({ inner }), [onChange]);
    const handleOuterChange = useCallback(outer => onChange({ outer }), [onChange]);

    return <>
        <div style={{ width: '48%' }}><Decorator className="form-row" decorator={config.outer} onChange={handleOuterChange} options={DECORATORS_OPTIONS} /></div>
        <div style={{ width: '48%' }}><Decorator className="form-row" decorator={config.inner} onChange={handleInnerChange} options={DECORATORS_OPTIONS} /></div>
    </>
});

export const DepthAverageDecorator = React.memo(({ config, onChange }) =>
    <>
        <NumberInput id="baseline" value={config.baseline} upChange={onChange}>Baseline</NumberInput>
        <NumberInput id="spread" value={config.spread} upChange={onChange}>Spread</NumberInput>
    </>
);

export const RangeDecorator = React.memo(({ config, onChange }) =>
    <>
        <NumberInput id="bottom_offset" value={config.bottom_offset} required={false} upChange={onChange}>Bottom offset</NumberInput>
        <NumberInput id="top_offset" value={config.top_offset} required={false} upChange={onChange}>Top offset</NumberInput>
        <NumberInput id="maximum" value={config.maximum} required={false} upChange={onChange}>Y maximum</NumberInput>
    </>
);

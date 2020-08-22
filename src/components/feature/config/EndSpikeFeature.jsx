import { ConfInput, NumberInput } from '../../../ui/Input';
import React, { useCallback } from 'react';

import { BlockPosition } from '../../utils/BlockPosition';
import { Button } from '../../../ui/Button';
import { INT_MIN_VALUE } from '../../../utils/math';
import { useCrudPreset } from '../../../hooks/form';

export function EndSpikeFeature({ configuration, onChange }) {

    const [spikes, handleAdd, handleChange, handleRemove] = useCrudPreset((spikes) => onChange({ ...configuration, spikes }), configuration.spikes);
    const handleBeamTargetChange = useCallback(function (crystal_beam_target) {
        if (crystal_beam_target === null) {
            onChange((({ crystal_beam_target, ...config }) => config)(configuration));
        } else {
            onChange({ ...configuration, crystal_beam_target });
        }
    }, [configuration, onChange]);
    const handleCrystalChange = useCallback(function (e) {
        const crystal_invulnerable = e.target.checked;
        onChange({ ...configuration, crystal_invulnerable });
    }, [configuration, onChange]);

    return <div>
        <fieldset>
            <legend>Settings</legend>
            <div className="form-group form-row">
                <ConfInput id="crystal_invulnerable" checked={configuration.crystal_invulnerable || false} onChange={handleCrystalChange}>Crystal invulnerable</ConfInput>
                <BlockPosition id="crystal_beam_target" position={configuration.crystal_beam_target} optional onChange={handleBeamTargetChange}>Crystal beam target : </BlockPosition>
            </div>
        </fieldset>
        <fieldset>
            <legend>Spikes <Button onClick={handleAdd}>Add spike</Button></legend>
            {spikes.map((spike, i) =>
                <Spike key={JSON.stringify(spike) + i} spike={spike} onChange={handleChange} onRemove={handleRemove}>
                    <Button cat="danger mlm" onClick={e => handleRemove(e, spike)}>Remove</Button>
                </Spike>
            )}
        </fieldset>
    </div>
}

const Spike = React.memo(function ({children, onChange, spike}) {

    const handleChange = useCallback(function (value) {
        onChange({ ...spike, ...value }, spike);
    }, [onChange, spike]);
    const handleGuardedChange = useCallback(function (e) {
        onChange({ ...spike, guarded: e.target.checked }, spike);
    }, [onChange, spike]);

    return <div className="form-group form-row">
        <NumberInput id="centerX" value={spike.centerX} min={INT_MIN_VALUE} required={false} upChange={handleChange}>Center X</NumberInput>
        <NumberInput id="centerZ" value={spike.centerZ} min={INT_MIN_VALUE} required={false} upChange={handleChange}>Center Z</NumberInput>
        <NumberInput id="radius" value={spike.radius} required={false} upChange={handleChange}>Radius</NumberInput>
        <NumberInput id="height" value={spike.height} required={false} upChange={handleChange}>Height</NumberInput>
        <ConfInput id="guarded" checked={spike.guarded || false} onChange={handleGuardedChange}>Guarded</ConfInput>
        {children}
    </div>
});

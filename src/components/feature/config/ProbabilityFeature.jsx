import { NumberInput } from '../../../ui/Input';
import React from 'react';

export function ProbabilityFeature({ configuration, onChange }) {

    return <fieldset>
        <legend>Config</legend>
        <div className="form-group">
            <NumberInput id="probability" value={configuration.probability} max={1} step={0.01} upChange={onChange}>Probability</NumberInput>
        </div>
    </fieldset>
}

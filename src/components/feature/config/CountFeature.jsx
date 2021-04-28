import { UniformInt } from '../../utils/UniformInt';
import React from 'react';

export function CountFeature({ configuration, onChange }) {

    return <fieldset>
        <legend>Config</legend>
        <div className="form-group">
            <UniformInt id="probability" value={configuration.probability} minBase={-10} maxBase={128} maxSpread={128} upChange={onChange}>Count</UniformInt>
        </div>
    </fieldset>
}

import { FeatureField } from '../InlineFeature';
import React, { useCallback } from 'react';

export function RandomBooleanFeature({ configuration, onChange }) {

    const handleFeatureTrueChange = useCallback(function (feature_true) {
        onChange({ ...configuration, feature_true });
    }, [configuration, onChange]);
    const handleFeatureFalseChange = useCallback(function (feature_false) {
        onChange({ ...configuration, feature_false });
    }, [configuration, onChange]);

    return <>
        <fieldset>
            <legend>Feature true</legend>
            <FeatureField feature={configuration.feature_true} onChange={handleFeatureTrueChange} />
        </fieldset>
        <fieldset>
            <legend>Feature false</legend>
            <FeatureField feature={configuration.feature_false} onChange={handleFeatureFalseChange} />
        </fieldset>
    </>
}

import { FEATURES, FEATURES_OPTIONS, FeatureConfig } from './ConfiguredFeature';
import React, { useCallback } from 'react';

import { findDecorators } from '../../utils/data';
import { useKeyedListOptions } from '../../hooks/context';
import Select from '../../ui/Select';

export const InlineFeature = React.memo(function ({ children, feature, legend, onChange }) {

    const handleConfigChange = useCallback(function (config) {
        onChange({ type: feature.type, config }, feature);
    }, [feature, onChange]);
    const handleTypeChange = useCallback(function (option) {
        const [, feature] = findDecorators(FEATURES.find(feature => feature.type === option.value).default);
        onChange(feature);
    }, [onChange]);

    return <fieldset>
        {typeof legend !== 'undefined' && <legend>{legend}</legend>}
        <div className="form-group form-row">
            <div className="flex-grow"><Select options={FEATURES_OPTIONS} value={FEATURES_OPTIONS.find(o => o.value === feature.type) || null} onChange={handleTypeChange} /></div>
            {children}
        </div>
        <FeatureConfig type={feature.type} configuration={feature.config} onChange={handleConfigChange} />
    </fieldset>
});

export const FeatureField = React.memo(function ({ children, feature, filter, legend, onChange }) {

    const options = useKeyedListOptions('features');
    const handleSelectChange = useCallback(function (option) {
        onChange(option.value, feature);
    }, [feature, onChange]);

    if (typeof feature === 'object') {
        return <InlineFeature feature={feature} legend={legend} onChange={onChange}>{children}</InlineFeature>
    }

    const filteredOptions = typeof filter === 'function' ? options.filter(filter) : options;
    return <div className="form-group form-row">
        <div className="flex-grow"><Select options={filteredOptions} value={options.find(o => feature === o.value)} onChange={handleSelectChange} /></div>
        {children}
    </div>
});


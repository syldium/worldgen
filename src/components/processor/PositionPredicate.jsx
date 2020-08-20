import React, { useCallback, useMemo } from "react";

import { NumberInput } from "../../ui/Input";
import Select from "../../ui/Select";

export const PositionPredicate = React.memo(function ({ className = 'form-group', onChange, predicate = { predicate_type: 'minecraft:always_true' } }) {

    const handleTypeChange = useCallback(function (option) {
        onChange({ predicate_type: option.value }, predicate);
    }, [onChange, predicate]);
    const handleChange = useCallback(function (value) {
        onChange({ ...predicate, ...value }, predicate);
    }, [onChange, predicate]);

    const options = useMemo(function () {
        return [
            { value: 'minecraft:always_true', label: 'Always true' },
            { value: 'minecraft:linear_pos', label: 'Linear pos' },
            { value: 'minecraft:axis_aligned_linear_pos', label: 'Axis aligned linear pos' }
        ];
    }, []);

    const type = predicate.predicate_type;
    return <div className={className}>
        <label>Predicate type</label>
        <Select options={options} value={options.find(o => o.value === type)} onChange={handleTypeChange} />
        {type === 'minecraft:linear_pos' && <LinearPosPredicate predicate={predicate} onChange={handleChange} />}
        {type === 'minecraft:axis_aligned_linear_pos' && <AxisAlignedLinearPos predicate={predicate} onChange={handleChange} />}
    </div>
});


const LinearPosPredicate = React.memo(function ({ children, onChange, predicate }) {
    return <div className="form-group form-row">
        <NumberInput id="min_chance" value={predicate.min_chance} step={0.1} upChange={onChange} required={false}>Min chance</NumberInput>
        <NumberInput id="max_chance" value={predicate.max_chance} step={0.1} upChange={onChange} required={false}>Max chance</NumberInput>
        <NumberInput id="min_dist" value={predicate.min_dist} upChange={onChange} required={false}>Min dist</NumberInput>
        <NumberInput id="max_dist" value={predicate.max_dist} upChange={onChange} required={false}>Min dist</NumberInput>
        {children}
    </div>
});

const AxisAlignedLinearPos = React.memo(function ({ children, onChange, predicate }) {
    const options = ['x', 'y', 'z'].map(axis => ({ value: axis, label: axis }));

    const handleAxisChange = useCallback(function (option) {
        onChange({ axis: option.value }, predicate);
    }, [onChange, predicate]);

    return <LinearPosPredicate predicate={predicate} onChange={onChange}>
        <div className="form-row">
            <label htmlFor="axis">Axis :&nbsp;</label>
            <Select options={options} value={options.find(o => predicate.axis === o.value) || options[1]} onChange={handleAxisChange} inputId="axis" />
        </div>
        {children}
    </LinearPosPredicate>
});

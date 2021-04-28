import { ConfInput, NumberInput } from '../../ui/Input';
import { DIMENSION_TYPE_EFFECTS, DIMENSION_TYPE_INFINIBURN, OVERWORLD_CAVES_DIMENSION_TYPE, OVERWORLD_DIMENSION_TYPE, THE_END_DIMENSION_TYPE, THE_NETHER_DIMENSION_TYPE } from './DimensionDefaults';
import React, { useCallback, useContext, useState } from 'react';

import { Button } from '../../ui/Button';
import { DataContext } from '../../context/DataContext';
import { JsonViewer } from '../../ui/JsonViewer';
import { Modal } from '../../ui/Modal';
import { NamespacedKey } from '../NamespacedKey';
import { useKeyedListOptions } from '../../hooks/context';
import { useToggle } from '../../hooks/ui';
import Select from '../../ui/Select';

export function DimensionType({ type = 'minecraft:overworld', onChange }) {
    const [open, toggleModal] = useToggle();
    const options = useKeyedListOptions('dimension_types').map(option => {
        option.resource = option.value;
        return option;
    });

    if (typeof type === 'object') {
        options.push({ value: 'inline', label: 'inline', resource: type });
    }

    const handleTypeChange = useCallback(function (option) {
        onChange(option.resource);
    }, [onChange]);
    const handleNewClick = useCallback(function (e) {
        e.preventDefault();
        toggleModal(true);
    }, [toggleModal]);
    const handleTypeCreated = useCallback(function (type) {
        onChange(type.key);
        toggleModal(false);
    }, [onChange, toggleModal]);

    return <div className="form-group">
        <label htmlFor="dimension-type">Dimension type <Button onClick={handleNewClick}>Create new</Button></label>
        <Select inputId="dimension-type" options={options} value={options.find(o => o.resource === type)} onChange={handleTypeChange} />
        {open && <Modal open={open} onClose={toggleModal}>
            <DimensionTypeForm onSave={handleTypeCreated} />
        </Modal>}
    </div>;
}

export function DimensionTypeForm({ data = OVERWORLD_DIMENSION_TYPE, onSave }) {
    const [config, setConfig] = useState(data);

    const handleVanillaSelect = useCallback(function (value) {
        setConfig({
            ...{
                'minecraft:overworld': OVERWORLD_DIMENSION_TYPE,
                'minecraft:overworld_caves': OVERWORLD_CAVES_DIMENSION_TYPE,
                'minecraft:the_nether': THE_NETHER_DIMENSION_TYPE,
                'minecraft:the_end': THE_END_DIMENSION_TYPE
            }[value]
        });
    }, []);
    const handleNumberChange = useCallback(function (value) {
        setConfig(config => ({ ...config, ...value }))
    }, []);
    const handleSelectChange = useCallback(function (name, option) {
        setConfig(config => ({ ...config, [name]: option.value }))
    }, []);
    const handleCheckboxChange = useCallback(function (e) {
        const name = e.target.dataset.name;
        const checked = e.target.checked;
        setConfig(config => ({ ...config, [name]: checked }))
    }, []);
    const handleFixedTimeToggle = useCallback(function (e) {
        if (e.target.checked) {
            setConfig(config => ({ ...config, fixed_time: 18000 }));
        } else {
            setConfig((({ fixed_time, ...config }) => config));
        }
    }, []);

    const updateDimensionTypes = useContext(DataContext).custom.updateDimensionTypes;
    const handleSubmit = useCallback(function (e) {
        e.preventDefault();
        e.stopPropagation();
        const d = ({
            ...config,
            ...Object.fromEntries(new FormData(e.target))
        });
        updateDimensionTypes(d, data);
        if (typeof onSave === 'function') {
            onSave(d);
        }
    }, [config, data, onSave, updateDimensionTypes]);

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="typed" type="dimension_types" value={data.key} onSelect={handleVanillaSelect} expectBreakage={typeof data.key !== 'undefined'}>
            dimension type
            <JsonViewer data={config} />
        </NamespacedKey>
        <fieldset>
            <legend>Light</legend>
            <div className="form-row">
                <NumberInput id="ambient_light" value={config.ambient_light} upChange={handleNumberChange} step="0.1">Ambient light</NumberInput>
                <ConfInput id="has_skylight" checked={config.has_skylight} onChange={handleCheckboxChange}>Has skylight</ConfInput>
            </div>
        </fieldset>
        <fieldset>
            <legend>Height (20w49a only)</legend>
            <div className="form-row">
                <NumberInput id="min_y" value={config.min_y} min={-2048} max={2048 - config.height} step={16} upChange={handleNumberChange}>Min Y</NumberInput>
                <NumberInput id="height" value={config.height} max={2048 - config.min_y} step={16} upChange={handleNumberChange}>Height</NumberInput>
            </div>
            {config.logical_height > config.height &&
                <p className="alert--warning"><code>logical_height</code> cannot be higher than <code>height</code>.</p>
            }
            {(config.min_y & 0xF !== 0 || config.height & 0xF !== 0) &&
                <p className="alert--warning">These values have to be multiples of 16.</p>
            }
        </fieldset>
        <fieldset>
            <legend>Apparence</legend>
            <div className="form-row">
                <InfiniburnIdentifier value={config.infiniburn} onChange={handleSelectChange} inputId="infiniburn" />
                <div>
                    <label htmlFor="effects">Sky effects : </label>
                    <div className="inbl" style={{ width: '16ch' }}>
                        <Select options={DIMENSION_TYPE_EFFECTS} value={DIMENSION_TYPE_EFFECTS.find(o => config.effects === o.value) || DIMENSION_TYPE_EFFECTS[0]} onChange={o => handleSelectChange('effects', o)} inputId="effects" />
                    </div>
                </div>
            </div>
            <div className="form-group form-row">
                <NumberInput id="logical_height" value={config.logical_height} upChange={handleNumberChange} max={256}>Logical height</NumberInput>
                <div className="form-row">
                    {typeof config.fixed_time !== 'number' && <label htmlFor="fixed_time-toggle">Fixed time : </label>}
                    {typeof config.fixed_time === 'number' && <NumberInput id="fixed_time" value={config.fixed_time} upChange={handleNumberChange} step={1200}>Fixed time</NumberInput>}
                    <input type="checkbox" checked={typeof config.fixed_time === 'number'} onChange={handleFixedTimeToggle} className="checkbox" id="fixed_time-toggle" />
                </div>
            </div>
            <p style={{ marginBottom: 0, textAlign: 'center' }}><small className="text-muted">These settings are only used for appearance and some game mechanics<br />such as chorus fruits tp. To modify the world generation, change the noise parameters.</small></p>
        </fieldset>
        <fieldset>
            <legend>Overworld related behavior</legend>
            <div className="form-row">
                <ConfInput id="bed_works" checked={config.bed_works} onChange={handleCheckboxChange}>Bed works</ConfInput>
                <ConfInput id="has_raids" checked={config.has_raids} onChange={handleCheckboxChange}>Has raids</ConfInput>
                <ConfInput id="natural" checked={config.natural} onChange={handleCheckboxChange}>Natural</ConfInput>
            </div>
        </fieldset>
        <fieldset>
            <legend>Nether related behavior</legend>
            <div className="form-row">
                <ConfInput id="has_ceiling" checked={config.has_ceiling} onChange={handleCheckboxChange}>Has ceiling</ConfInput>
                <NumberInput id="coordinate_scale" value={config.coordinate_scale} upChange={handleNumberChange} min={10 ** -5} max={10 ** 7} step={0.1}>Coordinate scale</NumberInput>
            </div>
            <div className="form-group form-row">
                <ConfInput id="respawn_anchor_works" checked={config.respawn_anchor_works} onChange={handleCheckboxChange}>Respawn anchor works</ConfInput>
                <ConfInput id="piglin_safe" checked={config.piglin_safe} onChange={handleCheckboxChange}>Piglin safe</ConfInput>
                <ConfInput id="ultrawarm" checked={config.ultrawarm} onChange={handleCheckboxChange}>Ultrawarm</ConfInput>
            </div>
        </fieldset>
        <Button type="submit">Save</Button>
    </form>;
}

function InfiniburnIdentifier({ inputId, onChange, value }) {
    return <div>
        <label htmlFor={inputId}>Infiniburn : </label>
        <div className="inbl" style={{ width: '16ch' }}>
            <Select options={DIMENSION_TYPE_INFINIBURN} value={DIMENSION_TYPE_INFINIBURN.find(o => value === o.value) || DIMENSION_TYPE_INFINIBURN[0]} onChange={o => onChange('infiniburn', o)} inputId={inputId} />
        </div>
    </div>
}

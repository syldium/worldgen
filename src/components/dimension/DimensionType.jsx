import React, { useState, useCallback, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { OVERWORLD_DIMENSION_TYPE, THE_NETHER_DIMENSION_TYPE, THE_END_DIMENSION_TYPE } from './DimensionDefaults';
import { useKeyedListOptions } from '../../hooks/context';
import { useToggle } from '../../hooks/ui';
import { ConfInput, NumberInput } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import Select from '../../ui/Select';
import { Button } from '../../ui/Button';
import { NamespacedKey } from '../NamespacedKey';

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
    const handleTypeCreated = useCallback(function(type) {
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

    const handlePresetChange = useCallback(function (e, preset) {
        e.preventDefault();
        setConfig(preset);
    }, []);
    const handleNumberChange = useCallback(function(value) {
        setConfig(config => ({ ...config, ...value }))
    }, []);
    const handleCheckboxChange = useCallback(function(e) {
        const name = e.target.dataset.name;
        const checked = e.target.checked;
        setConfig(config => ({ ...config, [name]: checked }))
    }, []);

    const updateDimensionTypes = useContext(DataContext).custom.updateDimensionTypes;
    const handleSubmit = useCallback(function (e) {
        e.preventDefault();
        e.stopPropagation();
        const d = ({
            ...config,
            ...Object.fromEntries(new FormData(e.target))
        });
        updateDimensionTypes(d);
        if (typeof onSave === 'function') {
            onSave(d);
        }
    }, [config, onSave, updateDimensionTypes]);

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="typed" type="dimension_type" value={data.key} expectBreakage={typeof data.key !== 'undefined'}>dimension type</NamespacedKey>
        {typeof data.key === 'undefined' &&
            <fieldset>
                <legend>Preset</legend>
                <Button onClick={(e) => handlePresetChange(e, OVERWORLD_DIMENSION_TYPE)}>Overworld</Button>
                <Button onClick={(e) => handlePresetChange(e, THE_NETHER_DIMENSION_TYPE)}>The Nether</Button>
                <Button onClick={(e) => handlePresetChange(e, THE_END_DIMENSION_TYPE)}>The End</Button>
            </fieldset>
        }
        <fieldset>
            <legend>Light</legend>
            <div className="form-row">
                <NumberInput id="ambient_light" value={config.ambient_light} upChange={handleNumberChange} step="0.1">Ambient light</NumberInput>
                <ConfInput id="has_skylight" checked={config.has_skylight} onChange={handleCheckboxChange}>Has skylight</ConfInput>
            </div>
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
                <NumberInput id="coordinate_scale" value={config.coordinate_scale} upChange={handleNumberChange} min={10**-5} max={10**7} step={0.1}>Coordinate scale</NumberInput>
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

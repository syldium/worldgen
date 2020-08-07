import React, { useCallback, useContext, useState } from 'react';
import { NamespacedKey } from "../NamespacedKey";
import { VANILLA_CARVERS } from './CarverDefaults';
import { useKeyedListOptions } from '../../hooks/context';
import { DataContext } from '../../context/DataContext';
import { useJsonEffect } from '../../hooks/form';
import { Button } from '../../ui/Button';
import { NumberInput } from '../../ui/Input';
import { JsonViewer } from '../../ui/JsonViewer';
import Select from '../../ui/Select';
import { Modal } from '../../ui/Modal';
import { useToggle } from '../../hooks/ui';
import { useInlineResources } from '../../hooks/select';

export const ConfiguredCarver = React.memo(function({ carvers, onChange }) {

    carvers = useJsonEffect(carvers || { air: [ 'minecraft:cave', 'minecraft:canyon' ] }, carvers, onChange);
    const [open, toggleModal] = useToggle();

    const options = useKeyedListOptions('carvers');

    const handleAirChange = useCallback(function (options) {
        onChange({ ...carvers, air: options === null ? [] : options.map(option => option.resource) });
    }, [carvers, onChange]);
    const handleLiquidChange = useCallback(function (options) {
        onChange({ ...carvers, liquid: options === null ? [] : options.map(option => option.resource) });
    }, [carvers, onChange]);
    const handleNewClick = useCallback(function (e) {
        e.preventDefault();
        toggleModal(true);
    }, [toggleModal]);
    const handleCarverCreated = useCallback(function(carver) {
        onChange({ ...carvers, air: [ ...(carvers.air || []), carver.key ] });
        toggleModal(false);
    }, [carvers, onChange, toggleModal]);

    const [optionsAir, selectedAir] = useInlineResources(options, carvers.air);
    const [optionsLiquid, selectedLiquid] = useInlineResources(options, carvers.liquid);

    return <fieldset>
        <legend>Carvers <Button onClick={handleNewClick}>Create new</Button></legend>

        <label htmlFor="air">Air</label>
        <Select isMulti options={optionsAir} onChange={handleAirChange} value={selectedAir} inputId="air" />
        <div className="form-group">
            <label htmlFor="liquid">Liquid</label>
            <Select isMulti options={optionsLiquid} onChange={handleLiquidChange} value={selectedLiquid} inputId="liquid" />
        </div>
        {open && <Modal open={open} onClose={toggleModal}>
            <ConfiguredCarverForm onSave={handleCarverCreated} />
        </Modal>}
    </fieldset>
});

export function ConfiguredCarverForm({ data = { type: 'minecraft:cave', config: { probability: 0.143 } }, onSave }) {

    const [carver, setCarver] = useState(data);

    const handleSelectChange = useCallback(function (option) {
        setCarver({
            config: {
                probability: option.probability
            },
            type: option.value
        });
    }, []);
    const handleProbabilityChange = useCallback(function (probability) {
        setCarver(carver => ({ ...carver, config: { probability } }));
    }, []);

    const updateCarvers = useContext(DataContext).custom.updateCarvers;
    const handleSubmit = useCallback(function (e) {
        e.preventDefault();
        e.stopPropagation();
        const c = ({
            ...carver,
            ...Object.fromEntries(new FormData(e.target))
        });
        updateCarvers(c)
        if (typeof onSave === 'function') {
            onSave(c);
        }
    }, [carver, onSave, updateCarvers]);

    return <form onSubmit={handleSubmit}>
        <NamespacedKey example="pit" type="carvers" value={data.key} expectBreakage={typeof data.key !== 'undefined'}>
            configured carver
            <JsonViewer data={carver} />
        </NamespacedKey>
        <div className="form-group">
            <label htmlFor="type">Type</label>
            <Select options={VANILLA_CARVERS} value={VANILLA_CARVERS.find(o => o.value === carver.type)} onChange={handleSelectChange} inputId="type" />
        </div>
        <div className="form-group">
            <NumberInput value={carver.config.probability} max="1" step="0.001" onChange={handleProbabilityChange}>Probability</NumberInput>
        </div>
        <Button type="submit">Save</Button>
    </form>
}

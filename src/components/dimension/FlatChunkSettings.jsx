import { ConfInput, NumberInput } from '../../ui/Input';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { useCrudPreset, useJsonEffect } from '../../hooks/form';
import React, { useCallback } from 'react';

import { BlockSelect } from '../state/BlockPredicate';
import { Button } from '../../ui/Button';
import { FixedBiomeSource } from './BiomeSource';
import { Structures } from '../noise/Structures';

export const FlatChunkSettings = React.memo(function ({ settings, onChange }) {

    settings = useJsonEffect(settings || {
        structures: {
            structures: []
        },
        layers: [
            { block: 'minecraft:bedrock', height: 1 },
            { block: 'minecraft:sandstone', height: 70 }
        ],
        biome: 'minecraft:plains'
    }, settings, onChange);

    const handleBiomeChange = useCallback(function (biome) {
        onChange({ ...settings, biome });
    }, [settings, onChange]);
    const handleLayersChange = useCallback(function (layers) {
        onChange({ ...settings, layers });
    }, [settings, onChange]);
    const handleStructuresChange = useCallback(function (structures) {
        onChange({ ...settings, structures });
    }, [settings, onChange]);
    const handleLakesToggle = useCallback(function (e) {
        onChange({ ...settings, lakes: e.target.checked });
    }, [settings, onChange]);

    return <div className="form-group">
        <div className="form-group form-row">
            <FixedBiomeSource biome={settings.biome} inline={true} onChange={handleBiomeChange} />
            <ConfInput className="mls" checked={settings.lakes || false} onChange={handleLakesToggle}>Lakes</ConfInput>
        </div>
        <GeneratorLayers config={settings.layers} onChange={handleLayersChange} />
        <Structures data={settings.structures} onChange={handleStructuresChange} />
    </div>
});

const GeneratorLayers = React.memo(function ({ config, onChange }) {
    const [layers, handleAdd, handleChange, handleRemove] = useCrudPreset(onChange, config, { block: 'minecraft:grass_block', height: 1 });

    const shouldCancelStart = useCallback(function (e) {
        return !e.target.parentNode.classList.contains('sortable-item');
    }, []);

    const handleReversedSort = useCallback(function ({ oldIndex, newIndex }) {
        handleChange({ oldIndex: layers.length - 1 - oldIndex, newIndex: layers.length - 1 - newIndex });
    }, [layers, handleChange]);

    return <fieldset>
        <legend>Layers <Button onClick={handleAdd}>Add layer</Button></legend>
        <SortableLayersList layers={layers} onChange={handleChange} onRemove={handleRemove} onSortEnd={handleReversedSort} shouldCancelStart={shouldCancelStart} />
    </fieldset>
});

const SortableLayersList = SortableContainer(React.memo(function ({ layers, onChange, onRemove }) {
    let key = 0;
    return <ol className="sortable-container">
        {layers.map((layer, index) => {
            key += layer.height + 1;
            return <Layer i={index} index={layers.length - 1 - index} key={key} layer={layer} onChange={onChange} onRemove={onRemove} />
        }).reverse()}
    </ol>
}));

const Layer = SortableElement(React.memo(function ({ i, layer, onChange, onRemove }) {
    const handleHeightChange = useCallback(function (height, layer) {
        onChange({ ...layer, height }, layer);
    }, [onChange]);
    const handleBlockChange = useCallback(function (block, layer) {
        onChange({ ...layer, block }, layer);
    }, [onChange]);

    return <div className="sortable-item"><div className="form-group form-row">
        <div className="flex-grow"><BlockSelect block={layer.block} onChange={option => handleBlockChange(option.value, layer)} /></div>
        <NumberInput id="height" className="mls" value={layer.height} max={256} onChange={height => handleHeightChange(height, layer)}>Height</NumberInput>
        <Button cat="danger mlm" onClick={e => onRemove(e, i)}>Remove</Button>
    </div></div>
}));

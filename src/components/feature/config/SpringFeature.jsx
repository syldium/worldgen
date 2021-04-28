import { ConfInput, NumberInput } from '../../../ui/Input';
import {useBlocks} from "../../../hooks/context";
import React, { useCallback, useMemo } from 'react';

import { BlockSelect } from '../../state/BlockPredicate';
import { BlocksNamesList } from '../../state/BlockState';
import { HUGE_FUNGUS_FEATURE_CONFIG } from './FeatureConfigDefaults';

export function SpringFeature({ configuration = HUGE_FUNGUS_FEATURE_CONFIG, onChange }) {

    const handlRequiresBlockBelowChange = useCallback(function (e) {
        const requires_block_below = e.target.checked;
        onChange(({ ...configuration, requires_block_below }));
    }, [configuration, onChange]);
    const handleStateChange = useCallback(function (option) {
        onChange({ ...configuration, state: { Name: option.value, Properties: { falling: 'true' } } });
    }, [configuration, onChange]);
    const handleValidBlocksChange = useCallback(function (valid_blocks) {
        onChange({ ...configuration, valid_blocks });
    }, [configuration, onChange]);
    const handleValueChange = useCallback(function (value) {
        onChange({ ...configuration, ...value });
    }, [configuration, onChange]);

    const blocks = useBlocks();
    const filteredBlocks = useMemo(function () {
        return blocks.filter(b => b.name === 'lava' || b.name === 'water')
            .map(block => ({ value: 'minecraft:' + block.name, label: block.displayName }));
    }, [blocks]);

    return <div>
        <fieldset>
            <legend>Fluid</legend>
            <div className="form-group"><BlockSelect block={configuration.state.Name} onChange={handleStateChange} options={filteredBlocks} /></div>
        </fieldset>
        <fieldset>
            <legend>Valid blocks</legend>
            <BlocksNamesList list={configuration.valid_blocks} onChange={handleValidBlocksChange} />
        </fieldset>
        <fieldset>
            <legend>Configuration</legend>
            <div className="form-row">
                <NumberInput id="rock_count" value={configuration.rock_count} upChange={handleValueChange}>Rock count</NumberInput>
                <NumberInput id="hole_count" value={configuration.hole_count} upChange={handleValueChange}>Hole count</NumberInput>
                <ConfInput id="requires_block_below" checked={configuration.requires_block_below} onChange={handlRequiresBlockBelowChange}>Requires block below</ConfInput>
            </div>
        </fieldset>
    </div>
}

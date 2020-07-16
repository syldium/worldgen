import React, { useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useState } from 'react';
import { TreeFeatureConfig } from './TreeFeature';
import { Button } from '../../ui/Button';

export function ConfiguredFeature({data = { }, onSave}) {
    const [name, setName] = useState(data.name || 'minecraft:tree');
    const [configuration, configure] = useState(data);

    const handleSelectChange = useCallback(function(option) {
        setName(option.value);
    }, []);
    const handleConfigurationChange = useCallback(function(config) {
        configure(configuration => {
            configuration.config = config
            return configuration;
        });
    }, []);

    const handleSubmit = useCallback(function(e) {
        e.preventDefault();
        const data = {...configuration, name};
        data.key = new FormData(e.target).get('key');
        onSave(data);
    }, [configuration, name, onSave]);

    const options = useMemo(function() {
        return [
            { value: 'no_op', label: 'No op' },
            { value: 'chorus_plant', label: 'Chorus plant' },
            { value: 'void_start_platform', label: 'Void start platform' },
            { value: 'desert_well', label: 'Desert well' },
            { value: 'fossil', label: 'Fossil' },
            { value: 'ice_spike', label: 'Ice spike' },
            { value: 'glowstone_blob', label: 'Glowstone blob' },
            { value: 'freeze_top_layer', label: 'Freeze top layer' },
            { value: 'vines', label: 'Vines' },
            { value: 'monster_room', label: 'Monster room' },
            { value: 'blue_ice', label: 'Blue ice' },
            { value: 'end_island', label: 'End island' },
            { value: 'kelp', label: 'Kelp' },
            { value: 'coral_tree', label: 'Coral tree' },
            { value: 'coral_mushroom', label: 'Coral mushroom' },
            { value: 'coral_claw', label: 'Coral claw' },
            { value: 'weeping_vines', label: 'Weeping vines' },
            { value: 'twisting_vines', label: 'Twisting vines' },
            { value: 'bonus_chest', label: 'Bonus chest' },
            { value: 'basalt_pillar', label: 'Basalt pillar' },
            { value: 'tree', label: 'Tree' },
            { value: 'flower', label: 'Flower' },
            { value: 'random_patch', label: 'Random patch' },
            { value: 'block_pile', label: 'Block pile' },
            { value: 'nether_forest_vegetation', label: 'Nether forest vegetation' },
            { value: 'spring_feature', label: 'Spring feature' },
            { value: 'emerald_ore', label: 'Emerald ore' },
            { value: 'huge_red_mushroom', label: 'Huge red mushroom' },
            { value: 'huge_brown_mushroom', label: 'Huge brown mushroom' },
            { value: 'iceberg', label: 'Iceberg' },
            { value: 'forest_rock', label: 'Forest rock' },
            { value: 'lake', label: 'Lake' },
            { value: 'disk', label: 'Disk' },
            { value: 'ice_patch', label: 'Ice patch' },
            { value: 'ore', label: 'Ore' },
            { value: 'no_surface_ore', label: 'No surface ore' },
            { value: 'end_spike', label: 'End spike' },
            { value: 'end_gateway', label: 'End gateway' },
            { value: 'seagrass', label: 'Seagrass' },
            { value: 'bamboo', label: 'Bamboo' },
            { value: 'sea_pickle', label: 'Sea pickle' },
            { value: 'simple_block', label: 'Simple block' },
            { value: 'huge_fungus', label: 'Huge fungus' },
            { value: 'basalt_columns', label: 'Basalt columns' },
            { value: 'delta_feature', label: 'Delta feature' },
            { value: 'netherrack_replace_blobs', label: 'Netherrack replace blobs' },
            { value: 'fill_layer', label: 'Fill layer' },
            { value: 'random_selector', label: 'Random selector' },
            { value: 'simple_random_selector', label: 'Simple random selector' },
            { value: 'random_boolean_selector', label: 'Random boolean selector' },
            { value: 'decorated', label: 'Decorated' },
            { value: 'decorated_flower', label: 'Decorated flower' }
        ].map(o => {
            o.value = 'minecraft:' + o.value;
            return o;
        });
    }, []);

    const disabled = name !== 'minecraft:tree';
    return <form onSubmit={handleSubmit}>
        <h3>Edit configured feature</h3>
        <div className="form-group">
            <label htmlFor="key">Identifier</label> : <input type="text" name="key" id="key" required pattern="[a-z0-9._-]+" placeholder="Ex. : prismarine-tree" defaultValue={data.key} />
        </div>
        <label htmlFor="name">Type</label>
        <Select options={options} value={options.find(o => o.value === name)} onChange={handleSelectChange} name="name" />
        <hr />

        {name === 'minecraft:tree' && <TreeFeatureConfig configuration={configuration.config} onChange={handleConfigurationChange} />}
        {disabled && <p className="text-muted">Coming soon...</p>}

        <div className="form-group mlm mbm">
            <Button type="submit" disabled={disabled}>Save</Button>
        </div>
    </form>;
}
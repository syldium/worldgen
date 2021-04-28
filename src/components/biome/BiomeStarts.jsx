import React, { useCallback, useMemo } from 'react';

import { STARTS } from './BiomeDefaults';
import { useJsonEffect } from '../../hooks/form';
import Select from '../../ui/Select';

export const BiomeStarts = React.memo(function({onChange, starts}) {
    starts = useJsonEffect(starts || STARTS, starts, onChange);

    const handleChange = useCallback(function(selectedOptions) {
        onChange(selectedOptions === null ? [] : selectedOptions.map(option => option.value));
    }, [onChange]);

    const options = useMemo(function() {
        return [
            "pillager_outpost",
            "mineshaft",
            "mineshaft_mesa",
            "mansion",
            "jungle_pyramid",
            "desert_pyramid",
            "igloo",
            "shipwreck",
            "shipwreck_beached",
            "swamp_hut",
            "stronghold",
            "monument",
            "ocean_ruin_cold",
            "ocean_ruin_warm",
            "fortress",
            "nether_fossil",
            "end_city",
            "buried_treasure",
            "bastion_remnant",
            "village_plains",
            "village_desert",
            "village_savanna",
            "village_snovy",
            "village_taiga",
            "ruined_portal",
            "ruined_portal_desert",
            "ruined_portal_jungle",
            "ruined_portal_swamp",
            "ruined_portal_mountain",
            "ruined_portal_ocean",
            "ruined_portal_nether"
        ].map(option => ({ value: 'minecraft:' + option, label: 'minecraft:' + option }));
    }, []);

    return <div className="form-group">
        <label htmlFor="starts">Structures</label>
        <Select isMulti id="starts" options={options} onChange={handleChange} value={options.filter(o => starts.includes(o.value))} />
    </div>;
});

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Select from 'react-select';
import { FEATURES } from './BiomeDefaults';

export default function GenFeatures({ onChange, features = FEATURES }) {

    const [levels, setLevels] = useState(features);

    const handleLevelChange = useCallback(function(priority, list) {
        setLevels(levels => {
            levels[priority] = list;
            return levels;
        })
        onChange(levels);
    }, [levels, onChange]);

    useEffect(function() {
        onChange(levels);
    }, [levels, onChange]);

    const elements = [];
    levels.forEach((level, i) => {
        elements.push(<li key={i}><GenFeaturesLevel value={level} onChange={handleLevelChange} priority={i} /></li>);
    });
    return <div className="form-group">
        <label>Features</label>
        <p className="help"><small className="text-muted">Each generation feature is associated with a priority. The higher the priority, the later the feature will be applied.</small></p>
        <ol>{elements}</ol>
    </div>;
}

function GenFeaturesLevel({ onChange, priority, value }) {
    const features = value;

    const handleChange = useCallback(function(selectedOptions) {
        onChange(priority, selectedOptions === null ? [] : selectedOptions.map(option => option.value));
    }, [onChange, priority]);

    const options = useMemo(function () {
        return [
            "nope",
            "end_spike",
            "end_gateway",
            "end_gateway_delayed",
            "chorus_plant",
            "end_island",
            "end_island_decorated",
            "delta",
            "small_basalt_columns",
            "large_basalt_columns",
            "basalt_blobs",
            "blackstone_blobs",
            "glowstone_extra",
            "glowstone",
            "crimson_forest_vegetation",
            "warped_forest_vegetation",
            "nether_sprouts",
            "twisting_vines",
            "weeping_vines",
            "basalt_pillar",
            "seagrass_cold",
            "seagrass_deep_cold",
            "seagrass_normal",
            "seagrass_river",
            "seagrass_deep",
            "seagrass_swamp",
            "seagrass_warm",
            "seagrass_deep_warm",
            "sea_pickle",
            "ice_spike",
            "ice_patch",
            "forest_rock",
            "seagrass_simple",
            "iceberg_packed",
            "iceberg_blue",
            "kelp_cold",
            "kelp_warm",
            "blue_ice",
            "bamboo_light",
            "bamboo",
            "vines",
            "lake_water",
            "lake_lava",
            "disk_clay",
            "disk_gravel",
            "disk_sand",
            "freeze_top_layer",
            "bonus_chest",
            "void_start_platform",
            "monster_room",
            "desert_well",
            "fossil",
            "spring_lava_double",
            "spring_lava",
            "spring_delta",
            "spring_closed",
            "spring_closed_double",
            "spring_open",
            "spring_water",
            "pile_hay",
            "pile_melon",
            "pile_snow",
            "pile_ice",
            "pile_pumpkin",
            "patch_fire",
            "patch_soul_fire",
            "patch_brown_mushroom",
            "patch_red_mushroom",
            "patch_crimson_roots",
            "patch_sunflower",
            "patch_pumpkin",
            "patch_taiga_grass",
            "patch_berry_bush",
            "patch_grass_plain",
            "patch_grass_forest",
            "patch_grass_badlands",
            "patch_grass_savanna",
            "patch_grass_normal",
            "patch_grass_taiga",
            "patch_grass_taiga_2",
            "patch_grass_jungle",
            "patch_dead_bush",
            "patch_dead_bush_2",
            "patch_dead_bush_badlands",
            "patch_melon",
            "patch_berry_sparse",
            "patch_berry_decorated",
            "patch_waterlilly",
            "patch_tall_grass",
            "patch_tall_grass_2",
            "patch_large_fern",
            "patch_cactus",
            "patch_cactus_desert",
            "patch_cactus_decorated",
            "patch_sugar_cane_swamp",
            "patch_sugar_cane_desert",
            "patch_sugar_cane_badlands",
            "patch_sugar_cane",
            "brown_mushroom_nether",
            "red_mushroom_nether",
            "brown_mushroom_normal",
            "red_mushroom_normal",
            "brown_mushroom_taiga",
            "red_mushroom_taiga",
            "brown_mushroom_giant",
            "red_mushroom_giant",
            "brown_mushroom_swamp",
            "red_mushroom_swamp",
            "ore_magma",
            "ore_soul_sand",
            "ore_gold_deltas",
            "ore_quartz_deltas",
            "ore_gold_nether",
            "ore_quartz_nether",
            "ore_gravel_nether",
            "ore_blackstone",
            "ore_dirt",
            "ore_gravel",
            "ore_granite",
            "ore_diorite",
            "ore_andesite",
            "ore_coal",
            "ore_iron",
            "ore_gold_extra",
            "ore_gold",
            "ore_redstone",
            "ore_diamond",
            "ore_lapis",
            "ore_infested",
            "ore_emerald",
            "ore_debris_large",
            "ore_debris_small",
            "crimson_fungi",
            "crimson_fungi_planted",
            "warped_fungi",
            "warped_fungi_planted",
            "huge_brown_mushroom",
            "huge_red_mushroom",
            "oak",
            "dark_oak",
            "birch",
            "acacia",
            "spruce",
            "pine",
            "jungle_tree",
            "fancy_oak",
            "jungle_tree_no_vine",
            "mega_jungle_tree",
            "mega_spruce",
            "mega_pine",
            "swamp_tree",
            "jungle_bush",
            "oak_badlands",
            "spruce_snovy",
            "flower_warm",
            "flower_default",
            "flower_forest",
            "flower_swamp",
            "flower_plain",
            "flower_plain_decorated",
            "forest_flower_vegetation_common",
            "forest_flower_vegetation",
            "dark_forest_vegetation_brown",
            "dark_forest_vegetation_red",
            "warm_ocean_vegetation",
            "forest_flower_trees",
            "taiga_vegetation",
            "trees_shattered_savanna",
            "trees_savanna",
            "birch_tall",
            "trees_mountain_edge",
            "trees_mountain",
            "trees_water",
            "birch_other",
            "plain_vegetation",
            "trees_jungle_edge",
            "trees_giant_spruce",
            "trees_giant",
            "trees_jungle",
            "bamboo_vegetation",
            "mushroom_field_vegetation"
        ].map(option => ({ value: 'minecraft:' + option, label: 'minecraft:' + option }));
    }, []);

    return <Select isMulti options={options} onChange={handleChange} defaultValue={options.filter(o => features.includes(o.value))} />;
}
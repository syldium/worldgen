export const VANILLA_SURFACE_BUILDERS = [
    { value: 'badlands', label: 'Badlands' },
    { value: 'basalt_deltas', label: 'Basalt Deltas' },
    { value: 'crimson_forest', label: 'Crimson forest' },
    { value: 'deset', label: 'Desert' },
    { value: 'end', label: 'End' },
    { value: 'eroded_badlands', label: 'Eroded Badlands' },
    { value: 'frozen_ocean', label: 'Frozen ocean' },
    { value: 'full_sand', label: 'Full sand' },
    { value: 'giant_tree_taiga', label: 'Giant tree taiga' },
    { value: 'grass', label: 'Grass' },
    { value: 'gravelly_mountain', label: 'Gravelly mountain' },
    { value: 'ice_spikes', label: 'Ice spikes' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'mycelium', label: 'Mycelium' },
    { value: 'nether', label: 'Nether' },
    { value: 'nope', label: 'Nope' },
    { value: 'ocean_sand', label: 'Ocean sand' },
    { value: 'shattered_savanna', label: 'Shattered savanna' },
    { value: 'soul_sand_valley', label: 'Soul sand valley' },
    { value: 'stone', label: 'Stone' },
    { value: 'swamp', label: 'Swamp' },
    { value: 'warped_forest', label: 'Warped forest' },
    { value: 'wooded_badlands', label: 'Wooded badlands' },
].map(option => {
    option.value = 'minecraft:' + option.value;
    return option;
});

export const SURFACE_BUILDER = {
    config: {
        top_material: {
            Properties: {
                snowy: "false"
            },
            Name: "minecraft:grass_block"
        },
        under_material: {
            Name: "minecraft:dirt"
        },
        underwater_material: {
            Name: "minecraft:gravel"
        }
    },
    name: "minecraft:default"
}
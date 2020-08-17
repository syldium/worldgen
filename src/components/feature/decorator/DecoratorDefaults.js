export const DECORATORS_OPTIONS = [
    { value: 'carving_mask', label: 'Carving mask' },
    { value: 'chance', label: 'Chance' },
    { value: 'count', label: 'Count' },
    { value: 'count_extra', label: 'Count extra' },
    { value: 'count_multilayer', label: 'Count multi layer' },
    { value: 'count_noise', label: 'Count noise' },
    { value: 'count_noise_biased', label: 'Count noise biased' },
    { value: 'decorated', label: 'Decorated' },
    { value: 'fire', label: 'Fire' },
    { value: 'heightmap_world_surface', label: 'Heightmap world surface' },
    { value: 'iceberg', label: 'Iceberg' },
    { value: 'lava_lake', label: 'Lava lake' },
    { value: 'range', label: 'Range' },
    { value: 'range_biased', label: 'Range biased' },
    { value: 'range_very_biased', label: 'Range very biased' },
    { value: 'square', label: 'Square' },
    { value: 'water_lake', label: 'Water lake' }
].map(o => {
    o.value = 'minecraft:' + o.value;
    return o;
});

export const CARVERS_OPTIONS = [
    { value: 'air', label: 'Air' },
    { value: 'liquid', label: 'Liquid' }
];

export const DECORATOR_CARVING_MASK_DEFAULTS = {
    step: "liquid",
    probability: 0.1
};

export const DECORATOR_EXTRA_COUNT_DEFAULTS = {
    count: 10,
    extra_chance: 0.1,
    extra_count: 1
};

export const DECORATOR_DECORATED_DEFAULTS = {
    outer: {
        config: {},
        type: "minecraft:square"
    },
    inner: {
        config: {},
        type: "minecraft:heightmap"
    }
};

export const DECORATOR_RANGE_DEFAULTS = {
    bottom_offset: 4,
    top_offset: 0,
    maximum: 64
};

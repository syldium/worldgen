export const CARVERS_OPTIONS = [
    { value: 'air', label: 'Air' },
    { value: 'liquid', label: 'Liquid' }
];

export const DECORATOR_CARVING_MASK = {
    step: 'liquid',
    probability: 0.1
};

export const DECORATOR_EXTRA_COUNT = {
    count: 10,
    extra_chance: 0.1,
    extra_count: 1
};

export const DECORATOR_COUNT_NOISE = {
    noise_level: -0.8,
    below_noise: 15,
    above_noise: 4
};

export const DECORATOR_COUNT_NOISE_BIASED = {
    noise_to_count_ratio: 160,
    noise_factor: 80.0,
    noise_offset: 0.3
};

export const DECORATOR_DECORATED = {
    outer: {
        config: {},
        type: "minecraft:square"
    },
    inner: {
        config: {},
        type: "minecraft:heightmap"
    }
};

export const DECORATOR_DEPTH_AVERAGE = {
    baseline: 16,
    spread: 16
};

export const DECORATOR_RANGE = {
    bottom_offset: 4,
    top_offset: 0,
    maximum: 64
};

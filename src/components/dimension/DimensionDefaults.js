export const DIMENSION = {
    generator: {
        type: "minecraft:noise",
        seed: 286956243,
        biome_source: {
            type: "minecraft:fixed",
            seed: 286956243,
            biome: "minecraft:plains"
        },
        settings: "minecraft:overworld"
    },
    type: "minecraft:overworld"
};

export const CHUNK_GENERATOR_TYPES = [
    { value: 'minecraft:flat', label: 'Flat chunk generator' },
    { value: 'minecraft:debug', label: 'Debug chunk generator' },
    { value: 'minecraft:noise', label: 'Noise chunk generator' }
];

export const VANILLA_DIMENSION_TYPES = [
    { value: 'minecraft:overworld', label: 'Overworld' },
    { value: 'minecraft:overworld_caves', label: 'Overworld caves' },
    { value: 'minecraft:the_nether', label: 'The Nether' },
    { value: 'minecraft:the_end', label: 'The End' }
];

export const NOISES_NAMES = [
    'temperature_noise',
    'humidity_noise',
    'altitude_noise',
    'weirdness_noise'
];

export const MULTI_NOISE_BIOME_SOURCE = {
    type: 'minecraft:multi_noise',
    seed: 286956243,
    temperature_noise: {
        firstOctave: -7,
        amplitudes: [1, 1]
    },
    humidity_noise: {
        firstOctave: -7,
        amplitudes: [1, 1]
    },
    altitude_noise: {
        firstOctave: -7,
        amplitudes: [1, 1]
    },
    weirdness_noise: {
        firstOctave: -7,
        amplitudes: [1, 1]
    },
    biomes: []
};

export const DIMENSION_TYPE_EFFECTS = [
    { value: 'minecraft:overworld', label: 'Overworld' },
    { value: 'minecraft:the_nether', label: 'The Nether' },
    { value: 'minecraft:the_end', label: 'The End' }
];

export const DIMENSION_TYPE_INFINIBURN = [
    { value: 'minecraft:infiniburn_overworld', label: 'Overworld' },
    { value: 'minecraft:infiniburn_nether', label: 'The Nether' },
    { value: 'minecraft:infiniburn_end', label: 'The End' }
];

export const OVERWORLD_DIMENSION_TYPE = {
    has_raids: true,
    logical_height: 256,
    infiniburn: "minecraft:infiniburn_overworld",
    effects: "minecraft:overworld",
    ambient_light: 0.0,
    piglin_safe: false,
    bed_works: true,
    respawn_anchor_works: false,
    ultrawarm: false,
    natural: true,
    coordinate_scale: 1,
    min_y: 0,
    height: 256,
    has_skylight: true,
    has_ceiling: false
}

export const OVERWORLD_CAVES_DIMENSION_TYPE = { ...OVERWORLD_DIMENSION_TYPE, has_ceiling: true };

export const THE_NETHER_DIMENSION_TYPE = {
    has_raids: false,
    logical_height: 128,
    infiniburn: "minecraft:infiniburn_nether",
    effects: "minecraft:the_nether",
    ambient_light: 0.1,
    piglin_safe: true,
    bed_works: false,
    respawn_anchor_works: true,
    ultrawarm: true,
    natural: false,
    coordinate_scale: 8,
    min_y: 0,
    height: 256,
    fixed_time: 18000,
    has_skylight: false,
    has_ceiling: true
}

export const THE_END_DIMENSION_TYPE = {
    has_raids: true,
    logical_height: 256,
    infiniburn: "minecraft:infiniburn_end",
    effects: "minecraft:the_end",
    ambient_light: 0.0,
    piglin_safe: false,
    bed_works: false,
    respawn_anchor_works: false,
    ultrawarm: false,
    natural: false,
    coordinate_scale: 1,
    min_y: 0,
    height: 256,
    fixed_time: 6000,
    has_skylight: false,
    has_ceiling: false
}

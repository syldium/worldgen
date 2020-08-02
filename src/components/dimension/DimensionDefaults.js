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
}

export const VANILLA_DIMENSION_TYPES = [
    { value: 'minecraft:overworld', label: 'Overworld' },
    { value: 'minecraft:overworld_cave', label: 'Overworld caves' },
    { value: 'minecraft:the_nether', label: 'The Nether' },
    { value: 'minecraft:the_end', label: 'The End' },
]

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

export const OVERWORLD_DIMENSION_TYPE = {
    has_raids: true,
    logical_height: 256,
    infiniburn: "minecraft:infiniburn_overworld",
    ambient_light: 0.0,
    piglin_safe: false,
    bed_works: true,
    respawn_anchor_works: false,
    ultrawarm: false,
    natural: true,
    shrunk: false,
    has_skylight: true,
    has_ceiling: false
}

export const THE_NETHER_DIMENSION_TYPE = {
    has_raids: false,
    logical_height: 128,
    infiniburn: "minecraft:infiniburn_nether",
    ambient_light: 0.1,
    piglin_safe: true,
    bed_works: false,
    respawn_anchor_works: true,
    ultrawarm: true,
    natural: false,
    shrunk: true,
    fixed_time: 18000,
    has_skylight: false,
    has_ceiling: true
}

export const THE_END_DIMENSION_TYPE = {
    has_raids: true,
    logical_height: 256,
    infiniburn: "minecraft:infiniburn_end",
    ambient_light: 0.0,
    piglin_safe: false,
    bed_works: false,
    respawn_anchor_works: false,
    ultrawarm: false,
    natural: false,
    shrunk: false,
    fixed_time: 6000,
    has_skylight: false,
    has_ceiling: false
}
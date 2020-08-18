export const VANILLA_NOISES = [
    { value: 'minecraft:overworld', label: 'Overworld' },
    { value: 'minecraft:nether', label: 'Nether' },
    { value: 'minecraft:end', label: 'End' },
    { value: 'minecraft:amplified', label: 'Amplified' },
    { value: 'minecraft:caves', label: 'Caves' },
    { value: 'minecraft:floating_islands', label: 'Floating islands' }
];

export const STRUCTURES = [
    "ocean_ruin",
    "bastion_remnant",
    "fortress",
    "nether_fossil",
    "igloo",
    "shipwreck",
    "swamp_hut",
    "jungle_pyramid",
    "village",
    "ruined_portal",
    "endcity",
    "buried_treasure",
    "mansion",
    "monument",
    "stronghold",
    "pillager_outpost",
    "desert_pyramid",
    "mineshaft"
].map(tag => ({ value: 'minecraft:' + tag, label: tag }));;

export const OVERWORLD_NOISE = {
    bedrock_roof_position: -10,
    bedrock_floor_position: 0,
    sea_level: 63,
    disable_mob_generation: false,
    structures: {
        stronghold: {
            distance: 32,
            spread: 3,
            count: 128
        },
        structures: {
            "minecraft:ocean_ruin": {
                spacing: 20,
                separation: 8,
                salt: 14357621
            },
            "minecraft:bastion_remnant": {
                spacing: 27,
                separation: 4,
                salt: 30084232
            },
            "minecraft:fortress": {
                spacing: 27,
                separation: 4,
                salt: 30084232
            },
            "minecraft:nether_fossil": {
                spacing: 2,
                separation: 1,
                salt: 14357921
            },
            "minecraft:igloo": {
                spacing: 32,
                separation: 8,
                salt: 14357618
            },
            "minecraft:shipwreck": {
                spacing: 24,
                separation: 4,
                salt: 165745295
            },
            "minecraft:swamp_hut": {
                spacing: 32,
                separation: 8,
                salt: 14357620
            },
            "minecraft:jungle_pyramid": {
                spacing: 32,
                separation: 8,
                salt: 14357619
            },
            "minecraft:village": {
                spacing: 32,
                separation: 8,
                salt: 10387312
            },
            "minecraft:ruined_portal": {
                spacing: 40,
                separation: 15,
                salt: 34222645
            },
            "minecraft:endcity": {
                spacing: 20,
                separation: 11,
                salt: 10387313
            },
            "minecraft:buried_treasure": {
                spacing: 1,
                separation: 0,
                salt: 0
            },
            "minecraft:mansion": {
                spacing: 80,
                separation: 20,
                salt: 10387319
            },
            "minecraft:monument": {
                spacing: 32,
                separation: 5,
                salt: 10387313
            },
            "minecraft:stronghold": {
                spacing: 1,
                separation: 0,
                salt: 0
            },
            "minecraft:pillager_outpost": {
                spacing: 32,
                separation: 8,
                salt: 165745296
            },
            "minecraft:desert_pyramid": {
                spacing: 32,
                separation: 8,
                salt: 14357617
            },
            "minecraft:mineshaft": {
                spacing: 1,
                separation: 0,
                salt: 0
            }
        }
    },
    noise: {
        height: 256,
        sampling: {
            xz_scale: 1,
            y_scale: 1,
            xz_factor: 80.0,
            y_factor: 160.0
        },
        top_slide: {
            target: -10,
            size: 3,
            offset: 0
        },
        bottom_slide: {
            target: -30,
            size: 0,
            offset: 0
        },
        size_horizontal: 1,
        size_vertical: 2,
        density_factor: 1.0,
        density_offset: -0.47,
        simplex_surface_noise: true
    },
    default_block: {
        Name: "minecraft:stone"
    },
    default_fluid: {
        Properties: {
            level: "0"
        },
        Name: "minecraft:water"
    }
}

export const EFFECTS = {
    mood_sound: {
        sound: "minecraft:ambient.cave",
        tick_delay: 6000,
        block_search_extent: 8,
        offset: 2.0
    },
    sky_color: 7907327,
    fog_color: 12638463,
    water_color: 4159204,
    water_fog_color: 329011
}

export const FEATURES = [
    [],
    [
        "minecraft:lake_water",
        "minecraft:lake_lava"
    ],
    [],
    [
        "minecraft:monster_room"
    ],
    [],
    [],
    [
        "minecraft:ore_dirt",
        "minecraft:ore_gravel",
        "minecraft:ore_granite",
        "minecraft:ore_diorite",
        "minecraft:ore_andesite",
        "minecraft:ore_coal",
        "minecraft:ore_iron",
        "minecraft:ore_gold",
        "minecraft:ore_redstone",
        "minecraft:ore_diamond",
        "minecraft:ore_lapis",
        "minecraft:disk_sand",
        "minecraft:disk_clay",
        "minecraft:disk_gravel"
    ],
    [],
    [
        "minecraft:patch_tall_grass_2",
        "minecraft:plain_vegetation",
        "minecraft:flower_plain_decorated",
        "minecraft:patch_grass_plain",
        "minecraft:brown_mushroom_normal",
        "minecraft:red_mushroom_normal",
        "minecraft:patch_sugar_cane",
        "minecraft:patch_pumpkin",
        "minecraft:spring_water",
        "minecraft:spring_lava"
    ],
    [
        "minecraft:freeze_top_layer"
    ]
]

export const STARTS = [
    "minecraft:village_plains",
    "minecraft:pillager_outpost",
    "minecraft:mineshaft",
    "minecraft:stronghold",
    "minecraft:ruined_portal"
]

const SPAWNERS_AMBIENT = [
    {
        type: "minecraft:bat",
        weight: 10,
        minCount: 8,
        maxCount: 8
    }
];

const SPAWNERS_CREATURE = [
    {
        type: "minecraft:sheep",
        weight: 12,
        minCount: 4,
        maxCount: 4
    },
    {
        type: "minecraft:pig",
        weight: 10,
        minCount: 4,
        maxCount: 4
    },
    {
        type: "minecraft:chicken",
        weight: 10,
        minCount: 4,
        maxCount: 4
    },
    {
        type: "minecraft:cow",
        weight: 8,
        minCount: 4,
        maxCount: 4
    },
    {
        type: "minecraft:horse",
        weight: 5,
        minCount: 2,
        maxCount: 6
    },
    {
        type: "minecraft:donkey",
        weight: 1,
        minCount: 1,
        maxCount: 3
    }
];

const SPAWNERS_MONSTER = [
    {
        type: "minecraft:spider",
        weight: 100,
        minCount: 4,
        maxCount: 4
    },
    {
        type: "minecraft:zombie",
        weight: 95,
        minCount: 4,
        maxCount: 4
    },
    {
        type: "minecraft:zombie_villager",
        weight: 5,
        minCount: 1,
        maxCount: 1
    },
    {
        type: "minecraft:skeleton",
        weight: 100,
        minCount: 4,
        maxCount: 4
    },
    {
        type: "minecraft:creeper",
        weight: 100,
        minCount: 4,
        maxCount: 4
    },
    {
        type: "minecraft:slime",
        weight: 100,
        minCount: 4,
        maxCount: 4
    },
    {
        type: "minecraft:enderman",
        weight: 10,
        minCount: 1,
        maxCount: 4
    },
    {
        type: "minecraft:witch",
        weight: 5,
        minCount: 1,
        maxCount: 1
    },
];

export const SPAWNERS_DEFAULTS = {
    ambient: SPAWNERS_AMBIENT,
    creature: SPAWNERS_CREATURE,
    misc: [],
    monster: SPAWNERS_MONSTER,
    water_ambient: [],
    water_creature: []
};

export const BIOME_DEFAULTS = {
    effects: EFFECTS,
    carvers: {
        air: [
            "minecraft:cave",
            "minecraft:canyon"
        ]
    },
    starts: STARTS,
    features: FEATURES,
    spawners: SPAWNERS_DEFAULTS,
    category: "plains",
    precipitation: "rain",
    surface_builder: "minecraft:grass",
    scale: 0.05,
    downfall: 0.4,
    depth: 0.12,
    temperature: 0.8,
    player_spawn_friendly: true,
    spawn_costs: {}
}

export const PARTICLES = [
    'ambient_entity_effect',
    'angry_villager',
    'ash',
    'barrier',
    'block',
    'bubble',
    'bubble_column_up',
    'bubble_pop',
    'campfire_cosy_smoke',
    'campfire_signal_smoke',
    'cloud',
    'composter',
    'crimson_spore',
    'crit',
    'current_down',
    'damage_indicator',
    'dolphin',
    'dragon_breath',
    'dripping_honey',
    'dripping_lava',
    'dripping_obsidian_tear',
    'dripping_water',
    'dust',
    'effect',
    'elder_guardian',
    'enchant',
    'enchanted_hit',
    'end_rod',
    'entity_effect',
    'explosion',
    'explosion_emitter',
    'falling_dust',
    'falling_honey',
    'falling_lava',
    'falling_nectar',
    'falling_obsidian_tear',
    'falling_water',
    'firework',
    'fishing',
    'flame',
    'flash',
    'happy_villager',
    'heart',
    'instant_effect',
    'item',
    'item_slime',
    'item_snowball',
    'landing_honey',
    'landing_lava',
    'landing_obsidian_tear',
    'large_smoke',
    'lava',
    'mycelium',
    'nautilus',
    'note',
    'poof',
    'portal',
    'rain',
    'reverse_portal',
    'smoke',
    'sneeze',
    'soul',
    'soul_fire_flame',
    'spit',
    'splash',
    'squid_ink',
    'sweep_attack',
    'totem_of_undying',
    'underwater',
    'warped_spore',
    'white_ash',
    'witch'
].map(particle => ({ value: 'minecraft:' + particle, label: particle }));

export const PARTICLE_DEFAULTS = {
    options: {
        type: "minecraft:crimson_spore"
    },
    probability: 0.015
}

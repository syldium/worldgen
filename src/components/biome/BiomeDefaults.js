export const EFFECTS = {
    mood_sound: {
        sound: "minecraft:ambient.cave",
        tick_delay: 6000,
        block_search_extent: 8,
        offset: 2.0
    },
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

export const SPAWNERS_AMBIENT = [
    {
        type: "minecraft:bat",
        weight: 10,
        minCount: 8,
        maxCount: 8
    }
];

export const SPAWNERS_CREATURE = [
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

export const SPAWNERS_MONSTER = [
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
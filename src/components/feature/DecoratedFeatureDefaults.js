import { BLOCK_PILE_FEATURE_CONFIG, HUGE_FUNGUS_FEATURE_CONFIG, ORE_FEATURE_CONFIG, RANDOM_PATCH_FEATURE_CONFIG, SPRING_FEATURE_CONFIG, TREE_FEATURE_CONFIG } from "./config/FeatureConfigDefaults";

export const DECORATED_BAMBOO = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: {
                                probability: 0.2
                            },
                            type: "minecraft:bamboo"
                        },
                        decorator: {
                            config: {},
                            type: "minecraft:heightmap_world_surface"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                noise_to_count_ratio: 160,
                noise_factor: 80.0,
                noise_offset: 0.3
            },
            type: "minecraft:count_noise_biased"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_BASALT_COLUMNS = {
    config: {
        feature: {
            config: {
                reach: 1,
                height: {
                    base: 1,
                    spread: 3
                }
            },
            type: "minecraft:basalt_columns"
        },
        decorator: {
            config: {
                count: 4
            },
            type: "minecraft:count_multilayer"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_BASALT_PILLAR = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: {},
                            type: "minecraft:basalt_pillar"
                        },
                        decorator: {
                            config: {
                                bottom_offset: 0,
                                top_offset: 0,
                                maximum: 128
                            },
                            type: "minecraft:range"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 10
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_BLOCK_PILE = {
    config: {
        feature: {
            type: "minecraft:decorated",
            config: {
                decorator: {
                    type: "minecraft:count_multilayer",
                    config: {
                        "count": 2
                    }
                },
                feature: {
                    config: BLOCK_PILE_FEATURE_CONFIG,
                    type: "minecraft:block_pile"
                }
            }
        },
        decorator: {
            type: "minecraft:chance",
            config: {
                chance: 12
            }
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_BLUE_ICE = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: {},
                            type: "minecraft:blue_ice"
                        },
                        decorator: {
                            config: {
                                bottom_offset: 30,
                                top_offset: 32,
                                maximum: 64
                            },
                            type: "minecraft:range"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: {
                    base: 0,
                    spread: 19
                }
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_BONUS_CHEST = {
    config: {},
    type: "minecraft:bonus_chest"
};

export const DECORATED_CHORUS_PLANT = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {},
                    type: "minecraft:chorus_plant"
                },
                decorator: {
                    config: {
                        outer: {
                            config: {},
                            type: "minecraft:square"
                        },
                        inner: {
                            config: {},
                            type: "minecraft:heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: {
                    base: 0,
                    spread: 4
                }
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_CORAL_CLAW = {
    config: {},
    type: "minecraft:coral_claw"
};

export const DECORATED_CORAL_MUSHROOM = {
    config: {},
    type: "minecraft:coral_mushroom"
};

export const DECORATED_CORAL_TREE = {
    config: {},
    type: "minecraft:coral_tree"
};

export const DECORATED_DECORATED = {
    config: {
        feature: "minecraft:end_island",
        decorator: {
            config: {},
            type: "minecraft:end_island"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_DELTA_FEATURE = {
    config: {
        feature: {
            config: {
                contents: {
                    Properties: {
                        level: "0"
                    },
                    Name: "minecraft:lava"
                },
                rim: {
                    Name: "minecraft:magma_block"
                },
                size: {
                    base: 3,
                    spread: 4
                },
                rim_size: {
                    base: 0,
                    spread: 2
                }
            },
            type: "minecraft:delta_feature"
        },
        decorator: {
            config: {
                count: 40
            },
            type: "minecraft:count_multilayer"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_DESERT_WELL = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {},
                    type: "minecraft:desert_well"
                },
                decorator: {
                    config: {
                        outer: {
                            config: {},
                            type: "minecraft:square"
                        },
                        inner: {
                            config: {},
                            type: "minecraft:heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                chance: 1000
            },
            type: "minecraft:chance"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_DISK = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        state: {
                            Name: "minecraft:sand"
                        },
                        radius: {
                            base: 2,
                            spread: 4
                        },
                        half_height: 2,
                        targets: [
                            {
                                Name: "minecraft:dirt"
                            },
                            {
                                Properties: {
                                    snowy: "false"
                                },
                                Name: "minecraft:grass_block"
                            }
                        ]
                    },
                    type: "minecraft:disk"
                },
                decorator: {
                    config: {
                        outer: {
                            config: {},
                            type: "minecraft:square"
                        },
                        inner: {
                            config: {},
                            type: "minecraft:top_solid_heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 3
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_EMERALD_ORE = {
    config: {
        feature: {
            config: {
                target: {
                    Name: "minecraft:stone"
                },
                state: {
                    Name: "minecraft:emerald_ore"
                }
            },
            type: "minecraft:emerald_ore"
        },
        decorator: {
            config: {},
            type: "minecraft:emerald_ore"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_END_GATEWAY = {
    config: {
        feature: {
            config: {
                exit: [100, 50, 0],
                exact: true
            },
            type: "minecraft:end_gateway"
        },
        decorator: {
            config: {},
            type: "minecraft:end_gateway"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_END_ISLAND = {
    config: {
        feature: {
            config: {},
            type: "minecraft:end_island"
        },
        decorator: {
            config: {},
            type: "minecraft:end_island"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_END_SPIKE = {
    config: {
        crystal_invulnerable: false,
        spikes: []
    },
    type: "minecraft:end_spike"
};

export const DECORATED_FILL_LAYER = {
    config: {
        height: 64,
        state: {
            Name: "minecraft:green_concrete"
        }
    },
    type: "minecraft:fill_layer"
};

export const DECORATED_FLOWER = {
    config: {
        whitelist: [],
        blacklist: [],
        tries: 64,
        state_provider: {
            type: "minecraft:plain_flower_provider"
        },
        block_placer: {
            type: "minecraft:simple_block_placer"
        }
    },
    type: "minecraft:flower"
};

export const DECORATED_FOREST_ROCK = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        state: {
                            Name: "minecraft:mossy_cobblestone"
                        }
                    },
                    type: "minecraft:forest_rock"
                },
                decorator: {
                    config: {
                        outer: {
                            config: {},
                            type: "minecraft:square"
                        },
                        inner: {
                            config: {},
                            type: "minecraft:heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: {
                    base: 0,
                    spread: 2
                }
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_FOSSIL = {
    config: {
        feature: {
            config: {},
            type: "minecraft:fossil"
        },
        decorator: {
            config: {
                chance: 64
            },
            type: "minecraft:chance"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_FREEZE_TOP_LAYER = {
    config: {},
    type: "minecraft:freeze_top_layer"
};

export const DECORATED_GLOWSTONE_BLOB = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: {},
                            type: "minecraft:glowstone_blob"
                        },
                        decorator: {
                            config: {
                                bottom_offset: 0,
                                top_offset: 0,
                                maximum: 128
                            },
                            type: "minecraft:range"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 10
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_HUGE_BROWN_MUSHROOM = {
    config: {
        cap_provider: {
            state: {
                Properties: {
                    west: "true",
                    up: "true",
                    south: "true",
                    north: "true",
                    east: "true",
                    down: "false"
                },
                Name: "minecraft:brown_mushroom_block"
            },
            type: "minecraft:simple_state_provider"
        },
        stem_provider: {
            state: {
                Properties: {
                    west: "true",
                    up: "false",
                    south: "true",
                    north: "true",
                    east: "true",
                    down: "false"
                },
                Name: "minecraft:mushroom_stem"
            },
            type: "minecraft:simple_state_provider"
        },
        foliage_radius: 3
    },
    type: "minecraft:huge_brown_mushroom"
};

export const DECORATED_HUGE_FUNGUS = {
    config: {
        feature: {
            config: {
                hat_state: {
                    Name: "minecraft:nether_wart_block"
                },
                decor_state: {
                    Name: "minecraft:shroomlight"
                },
                planted: false,
                valid_base_block: {
                    Name: "minecraft:crimson_nylium"
                },
                stem_state: {
                    Properties: {
                        axis: "y"
                    },
                    Name: "minecraft:crimson_stem"
                }
            },
            type: "minecraft:huge_fungus"
        },
        decorator: {
            config: {
                count: 8
            },
            type: "minecraft:count_multilayer"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_HUGE_RED_MUSHROOM = {
    config: {
        feature: {
            config: HUGE_FUNGUS_FEATURE_CONFIG,
            type: "minecraft:huge_fungus"
        },
        decorator: {
            config: {
                count: 8
            },
            type: "minecraft:count_multilayer"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_ICEBERG = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        state: {
                            Name: "minecraft:packed_ice"
                        }
                    },
                    type: "minecraft:iceberg"
                },
                decorator: {
                    config: {},
                    type: "minecraft:iceberg"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                chance: 16
            },
            type: "minecraft:chance"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_ICE_PATCH = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        state: {
                            Name: "minecraft:packed_ice"
                        },
                        radius: {
                            base: 2,
                            spread: 1
                        },
                        half_height: 1,
                        targets: [
                            {
                                Name: "minecraft:dirt"
                            },
                            {
                                Properties: {
                                    snowy: "false"
                                },
                                Name: "minecraft:grass_block"
                            },
                            {
                                Properties: {
                                    snowy: "false"
                                },
                                Name: "minecraft:podzol"
                            },
                            {
                                Name: "minecraft:coarse_dirt"
                            },
                            {
                                Properties: {
                                    snowy: "false"
                                },
                                Name: "minecraft:mycelium"
                            },
                            {
                                Name: "minecraft:snow_block"
                            },
                            {
                                Name: "minecraft:ice"
                            }
                        ]
                    },
                    type: "minecraft:ice_patch"
                },
                decorator: {
                    config: {
                        outer: {
                            config: {},
                            type: "minecraft:square"
                        },
                        inner: {
                            config: {},
                            type: "minecraft:heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 2
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_ICE_SPIKE = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {},
                    type: "minecraft:ice_spike"
                },
                decorator: {
                    config: {
                        outer: {
                            config: {},
                            type: "minecraft:square"
                        },
                        inner: {
                            config: {},
                            type: "minecraft:heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 3
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_KELP = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: {},
                            type: "minecraft:kelp"
                        },
                        decorator: {
                            config: {},
                            type: "minecraft:top_solid_heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                noise_to_count_ratio: 80,
                noise_factor: 80.0,
                noise_offset: 0.0
            },
            type: "minecraft:count_noise_biased"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_LAKE = {
    config: {
        feature: {
            config: {
                state: {
                    Properties: {
                        level: "0"
                    },
                    Name: "minecraft:water"
                }
            },
            type: "minecraft:lake"
        },
        decorator: {
            config: {
                chance: 4
            },
            type: "minecraft:water_lake"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_MONSTER_ROOM = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: {},
                            type: "minecraft:monster_room"
                        },
                        decorator: {
                            config: {
                                bottom_offset: 0,
                                top_offset: 0,
                                maximum: 256
                            },
                            type: "minecraft:range"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 8
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_NETHER_FOREST_VEGETATION = {
    config: {
        feature: {
            config: {
                state_provider: {
                    entries: [
                        {
                            weight: 87,
                            data: {
                                Name: "minecraft:crimson_roots"
                            }
                        },
                        {
                            weight: 11,
                            data: {
                                Name: "minecraft:crimson_fungus"
                            }
                        },
                        {
                            weight: 1,
                            data: {
                                Name: "minecraft:warped_fungus"
                            }
                        }
                    ],
                    type: "minecraft:weighted_state_provider"
                }
            },
            type: "minecraft:nether_forest_vegetation"
        },
        decorator: {
            config: {
                count: 6
            },
            type: "minecraft:count_multilayer"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_NETHERRACK_REPLACE_BLOBS = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: {
                                target: {
                                    Name: "minecraft:netherrack"
                                },
                                state: {
                                    Properties: {
                                        axis: "y"
                                    },
                                    Name: "minecraft:basalt"
                                },
                                radius: {
                                    base: 3,
                                    spread: 4
                                }
                            },
                            type: "minecraft:netherrack_replace_blobs"
                        },
                        decorator: {
                            config: {
                                bottom_offset: 0,
                                top_offset: 0,
                                maximum: 128
                            },
                            type: "minecraft:range"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 75
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_NO_BONEMEAL_FLOWER = {
    config: {
        whitelist: [],
        blacklist: [],
        tries: 64,
        state_provider: {
            state: {
                Name: "minecraft:lily_of_the_valley"
            },
            type: "minecraft:simple_state_provider"
        },
        block_placer: {
            type: "minecraft:simple_block_placer"
        }
    },
    type: "minecraft:no_bonemeal_flower"
};

export const DECORATED_NO_SURFACE_ORE = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        target: {
                            tag: "minecraft:base_stone_nether",
                            predicate_type: "minecraft:tag_match"
                        },
                        state: {
                            Name: "minecraft:ancient_debris"
                        },
                        size: 3
                    },
                    type: "minecraft:no_surface_ore"
                },
                decorator: {
                    config: {
                        baseline: 16,
                        spread: 8
                    },
                    type: "minecraft:depth_average"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {},
            type: "minecraft:square"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_NO_OP = {
    config: {},
    type: "minecraft:no_op"
};

export const DECORATED_ORE = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: ORE_FEATURE_CONFIG,
                            type: "minecraft:ore"
                        },
                        decorator: {
                            config: {
                                bottom_offset: 0,
                                top_offset: 0,
                                maximum: 32
                            },
                            type: "minecraft:range"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 2
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_RANDOM_BOOLEAN_SELECTOR = {
    config: {
        feature: {
            config: {
                feature_true: "minecraft:huge_red_mushroom",
                feature_false: "minecraft:huge_brown_mushroom"
            },
            type: "minecraft:random_boolean_selector"
        },
        decorator: {
            config: {
                outer: {
                    config: {},
                    type: "minecraft:square"
                },
                inner: {
                    config: {},
                    type: "minecraft:heightmap"
                }
            },
            type: "minecraft:decorated"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_RANDOM_PATCH = {
    config: {
        feature: {
            config: {
                feature: {
                    config: RANDOM_PATCH_FEATURE_CONFIG,
                    type: "minecraft:random_patch"
                },
                decorator: {
                    config: {
                        outer: {
                            config: {},
                            type: "minecraft:square"
                        },
                        inner: {
                            config: {},
                            type: "minecraft:heightmap_spread_double"
                        }
                    },
                    type: "minecraft:decorated"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                chance: 32
            },
            type: "minecraft:chance"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_SEAGRASS = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        probability: 0.3
                    },
                    type: "minecraft:seagrass"
                },
                decorator: {
                    config: {
                        count: 48
                    },
                    type: "minecraft:count"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                outer: {
                    config: {},
                    type: "minecraft:square"
                },
                inner: {
                    config: {},
                    type: "minecraft:top_solid_heightmap"
                }
            },
            type: "minecraft:decorated"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_SEA_PICKLE = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        count: 20
                    },
                    type: "minecraft:sea_pickle"
                },
                decorator: {
                    config: {
                        outer: {
                            config: {},
                            type: "minecraft:square"
                        },
                        inner: {
                            config: {},
                            type: "minecraft:top_solid_heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                chance: 16
            },
            type: "minecraft:chance"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_RANDOM_SELECTOR = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        features: [
                            {
                                feature: "minecraft:fancy_oak_bees_005",
                                chance: 0.334
                            }
                        ],
                        default: "minecraft:oak_bees_005"
                    },
                    type: "minecraft:random_selector"
                },
                decorator: {
                    config: {
                        outer: {
                            config: {},
                            type: "minecraft:square"
                        },
                        inner: {
                            config: {},
                            type: "minecraft:heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 0,
                extra_chance: 0.05,
                extra_count: 1
            },
            type: "minecraft:count_extra"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_SIMPLE_BLOCK = {
    config: {
        feature: {
            config: {
                to_place: {
                    Name: "minecraft:seagrass"
                },
                place_on: [
                    {
                        Name: "minecraft:stone"
                    }
                ],
                place_in: [
                    {
                        Properties: {
                            level: "0"
                        },
                        Name: "minecraft:water"
                    }
                ],
                place_under: [
                    {
                        Properties: {
                            level: "0"
                        },
                        Name: "minecraft:water"
                    }
                ]
            },
            type: "minecraft:simple_block"
        },
        decorator: {
            config: {
                step: "liquid",
                probability: 0.1
            },
            type: "minecraft:carving_mask"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_SIMPLE_RANDOM_SELECTOR = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: {
                                features: [
                                    {
                                        config: {},
                                        type: "minecraft:coral_tree"
                                    },
                                    {
                                        config: {},
                                        type: "minecraft:coral_claw"
                                    },
                                    {
                                        config: {},
                                        type: "minecraft:coral_mushroom"
                                    }
                                ]
                            },
                            type: "minecraft:simple_random_selector"
                        },
                        decorator: {
                            config: {},
                            type: "minecraft:top_solid_heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                noise_to_count_ratio: 20,
                noise_factor: 400.0,
                noise_offset: 0.0
            },
            type: "minecraft:count_noise_biased"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_SPRING_FEATURE = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: SPRING_FEATURE_CONFIG,
                            type: "minecraft:spring_feature"
                        },
                        decorator: {
                            config: {
                                bottom_offset: 8,
                                top_offset: 8,
                                maximum: 256
                            },
                            type: "minecraft:range_biased"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 50
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_TREE = {
    config: {
        feature: {
            config: {
                feature: {
                    config: TREE_FEATURE_CONFIG,
                    type: "minecraft:tree"
                },
                decorator: {
                    config: {
                        outer: {
                            config: {},
                            type: "minecraft:square"
                        },
                        inner: {
                            config: {},
                            type: "minecraft:heightmap"
                        }
                    },
                    type: "minecraft:decorated"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 10,
                extra_chance: 0.1,
                extra_count: 1
            },
            type: "minecraft:count_extra"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_TWISTING_VINES = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: {},
                            type: "minecraft:twisting_vines"
                        },
                        decorator: {
                            config: {
                                bottom_offset: 0,
                                top_offset: 0,
                                maximum: 128
                            },
                            type: "minecraft:range"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 10
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_VINES = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {},
                    type: "minecraft:vines"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 50
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

export const DECORATED_VOID_START_PLATFORM = {
    config: {},
    type: "minecraft:void_start_platform"
};

export const DECORATED_WEEPING_VINES = {
    config: {
        feature: {
            config: {
                feature: {
                    config: {
                        feature: {
                            config: {},
                            type: "minecraft:weeping_vines"
                        },
                        decorator: {
                            config: {
                                bottom_offset: 0,
                                top_offset: 0,
                                maximum: 128
                            },
                            type: "minecraft:range"
                        }
                    },
                    type: "minecraft:decorated"
                },
                decorator: {
                    config: {},
                    type: "minecraft:square"
                }
            },
            type: "minecraft:decorated"
        },
        decorator: {
            config: {
                count: 10
            },
            type: "minecraft:count"
        }
    },
    type: "minecraft:decorated"
};

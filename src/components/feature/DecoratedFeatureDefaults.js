import { TREE_FEATURE_CONFIG, RANDOM_PATCH_FEATURE_CONFIG, HUGE_FUNGUS_FEATURE_CONFIG, BLOCK_PILE_FEATURE_CONFIG, SPRING_FEATURE_CONFIG, ORE_FEATURE_CONFIG } from "./config/FeatureConfigDefaults";

export const DECORATED_BAMBOO_CONFIG = {
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

export const DECORATED_BLOCK_PILE_CONFIG = {
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

export const DECORATED_CHORUS_PLANT_CONFIG = {
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

export const DECORATED_DELTA_CONFIG = {
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

export const DECORATED_DESERT_WELL_CONFIG = {
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

export const DECORATED_DISK_CONFIG = {
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

export const DECORATED_FOREST_ROCK_CONFIG = {
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


export const DECORATED_FOSSIL_CONFIG = {
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

export const DECORATED_GLOWSTONE_BLOB_CONFIG = {
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

export const DECORATED_HUGE_FUNGUS_CONFIG = {
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

export const DECORATED_ICEBERG_CONFIG = {
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

export const DECORATED_ICE_PATCH_CONFIG = {
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

export const DECORATED_ICE_SPIKE_CONFIG = {
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

export const DECORATED_LAKE_CONFIG = {
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

export const DECORATED_NETHERRACK_REPLACE_BLOBS_CONFIG = {
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

export const DECORATED_ORE_FEATURE_CONFIG = {
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

export const DECORATED_RANDOM_PATCH_CONFIG = {
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

export const DECORATED_SEAGRASS_CONFIG = {
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

export const DECORATED_SIMPLE_BLOCK_CONFIG = {
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

export const DECORATED_SPRING_FEATURE_CONFIG = {
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

export const DECORATED_TREE_CONFIG = {
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

export const DECORATED_VOID_START_PLATFORM_CONFIG = {
    config: {},
    type: "minecraft:void_start_platform"
};

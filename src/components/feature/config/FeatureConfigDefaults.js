export const TREE_DECORATORS_OPTIONS = [
    { value: 'alter_ground', label: 'Alter ground' },
    { value: 'beehive', label: 'Beehive', default: { probability: 0.02 } },
    { value: 'cocoa', label: 'Cocoa beans', default: { probability: 0.2 } },
    { value: 'leave_vine', label: 'Leave vine' },
    { value: 'trunk_vine', label: 'Trunk vine' }
].map(o => {
    o.value = 'minecraft:' + o.value;
    return o;
});

export const BLOCK_PILE_FEATURE_CONFIG = {
    state_provider: {
        state: {
            Properties: {
                axis: "y"
            },
            Name: "minecraft:hay_block"
        },
        type: "minecraft:rotated_block_provider"
    }
};

export const HUGE_FUNGUS_FEATURE_CONFIG = {
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
};

export const ORE_FEATURE_CONFIG = {
    target: {
        tag: "minecraft:base_stone_overworld",
        predicate_type: "minecraft:tag_match"
    },
    state: {
        Name: "minecraft:gold_ore"
    },
    size: 30
};

export const SPRING_FEATURE_CONFIG = {
    rock_count: 4,
    hole_count: 1,
    valid_blocks: [
        "minecraft:stone",
        "minecraft:granite",
        "minecraft:diorite",
        "minecraft:andesite"
    ],
    state: {
        Properties: {
            falling: "true"
        },
        Name: "minecraft:water"
    },
    requires_block_below: true
};

export const TREE_FEATURE_CONFIG = {
    heightmap: "OCEAN_FLOOR",
    minimum_size: {
        limit: 1,
        lower_size: 0,
        upper_size: 1,
        type: "minecraft:two_layers_feature_size"
    },
    decorators: [],
    trunk_provider: {
        state: {
            Properties: {
                axis: "y"
            },
            Name: "minecraft:birch_log"
        },
        type: "minecraft:simple_state_provider"
    },
    leaves_provider: {
        state: {
            Properties: {
                persistent: "false",
                distance: "7"
            },
            Name: "minecraft:birch_leaves"
        },
        type: "minecraft:simple_state_provider"
    },
    foliage_placer: {
        radius: 2,
        offset: 0,
        height: 3,
        type: "minecraft:blob_foliage_placer"
    },
    trunk_placer: {
        base_height: 5,
        height_rand_a: 2,
        height_rand_b: 0,
        type: "minecraft:straight_trunk_placer"
    }
};

export const RANDOM_PATCH_FEATURE_CONFIG = {
    whitelist: [
        {
            Properties: {
                snowy: "false"
            },
            Name: "minecraft:grass_block"
        }
    ],
    blacklist: [],
    tries: 64,
    state_provider: {
        state: {
            Name: "minecraft:pumpkin"
        },
        type: "minecraft:simple_state_provider"
    },
    block_placer: {
        type: "minecraft:simple_block_placer"
    }
};

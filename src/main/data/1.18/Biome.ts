import { BiomeSettings as Biome1_17, Spawners } from '../1.17/Biome';
import { ObjectNode, ObjectNodeParams } from '../../model/node/ObjectNode';
import type { Model } from '../../model/Model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { depth, scale, starts, ...v1_17 } = Biome1_17;

export const Biome: Model = {
  node: {
    ...v1_17,
    spawners: ObjectNode({
      ...(v1_17.spawners as ObjectNodeParams).records,
      axolotls: Spawners
    })
  },
  preset: () => ({
    effects: {
      mood_sound: {
        sound: 'minecraft:ambient.cave',
        tick_delay: 6000,
        block_search_extent: 8,
        offset: 2.0
      },
      sky_color: 7907327,
      fog_color: 12638463,
      water_color: 4159204,
      water_fog_color: 329011
    },
    surface_builder: 'minecraft:grass',
    carvers: {
      air: [
        'minecraft:cave',
        'minecraft:cave_extra_underground',
        'minecraft:canyon'
      ]
    },
    features: [
      [],
      ['minecraft:lake_water', 'minecraft:lake_lava'],
      ['minecraft:amethyst_geode'],
      ['minecraft:monster_room'],
      [],
      [],
      [
        'minecraft:ore_dirt',
        'minecraft:ore_gravel',
        'minecraft:ore_granite_upper',
        'minecraft:ore_granite_lower',
        'minecraft:ore_diorite_upper',
        'minecraft:ore_diorite_lower',
        'minecraft:ore_andesite_upper',
        'minecraft:ore_andesite_lower',
        'minecraft:ore_tuff',
        'minecraft:ore_coal_upper',
        'minecraft:ore_coal_lower',
        'minecraft:ore_iron_upper',
        'minecraft:ore_iron_middle',
        'minecraft:ore_iron_small',
        'minecraft:ore_gold',
        'minecraft:ore_redstone',
        'minecraft:ore_redstone_lower',
        'minecraft:ore_diamond',
        'minecraft:ore_diamond_large',
        'minecraft:ore_lapis',
        'minecraft:ore_lapis_buried',
        'minecraft:ore_copper',
        'minecraft:underwater_magma',
        'minecraft:disk_sand',
        'minecraft:disk_clay',
        'minecraft:disk_gravel'
      ],
      [],
      [
        'minecraft:patch_tall_grass_2',
        'minecraft:glow_lichen',
        'minecraft:plain_vegetation',
        'minecraft:flower_plain_decorated',
        'minecraft:patch_grass_plain',
        'minecraft:brown_mushroom_normal',
        'minecraft:red_mushroom_normal',
        'minecraft:patch_sugar_cane',
        'minecraft:patch_pumpkin',
        'minecraft:spring_water',
        'minecraft:spring_lava'
      ],
      ['minecraft:freeze_top_layer']
    ],
    spawners: {
      monster: [
        {
          type: 'minecraft:spider',
          weight: 100,
          minCount: 4,
          maxCount: 4
        },
        {
          type: 'minecraft:zombie',
          weight: 95,
          minCount: 4,
          maxCount: 4
        },
        {
          type: 'minecraft:zombie_villager',
          weight: 5,
          minCount: 1,
          maxCount: 1
        },
        {
          type: 'minecraft:skeleton',
          weight: 100,
          minCount: 4,
          maxCount: 4
        },
        {
          type: 'minecraft:creeper',
          weight: 100,
          minCount: 4,
          maxCount: 4
        },
        {
          type: 'minecraft:slime',
          weight: 100,
          minCount: 4,
          maxCount: 4
        },
        {
          type: 'minecraft:enderman',
          weight: 10,
          minCount: 1,
          maxCount: 4
        },
        {
          type: 'minecraft:witch',
          weight: 5,
          minCount: 1,
          maxCount: 1
        }
      ],
      creature: [
        {
          type: 'minecraft:sheep',
          weight: 12,
          minCount: 4,
          maxCount: 4
        },
        {
          type: 'minecraft:pig',
          weight: 10,
          minCount: 4,
          maxCount: 4
        },
        {
          type: 'minecraft:chicken',
          weight: 10,
          minCount: 4,
          maxCount: 4
        },
        {
          type: 'minecraft:cow',
          weight: 8,
          minCount: 4,
          maxCount: 4
        },
        {
          type: 'minecraft:horse',
          weight: 5,
          minCount: 2,
          maxCount: 6
        },
        {
          type: 'minecraft:donkey',
          weight: 1,
          minCount: 1,
          maxCount: 3
        }
      ],
      ambient: [
        {
          type: 'minecraft:bat',
          weight: 10,
          minCount: 8,
          maxCount: 8
        }
      ],
      axolotls: [],
      underground_water_creature: [
        {
          type: 'minecraft:glow_squid',
          weight: 10,
          minCount: 4,
          maxCount: 6
        }
      ],
      water_creature: [],
      water_ambient: [],
      misc: []
    },
    spawn_costs: {},
    player_spawn_friendly: true,
    precipitation: 'rain',
    temperature: 0.8,
    downfall: 0.4,
    category: 'plains'
  })
};

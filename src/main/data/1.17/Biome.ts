import { ObjectNode, Opt } from '../../model/node/ObjectNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { ColorNode, IntNode } from '../../model/node/IntNode';
import { EnumNode } from '../../model/node/EnumNode';
import { DoubleNode, FloatNode } from '../../model/node/FloatNode';
import { ListNode } from '../../model/node/ListNode';
import { BoolNode } from '../../model/node/BoolNode';
import { Model } from '../../model/Model';
import { labelizeOption } from '../../util/LabelHelper';
import { Option } from '../../component/ui/Select';

const BiomeEffects = ObjectNode({
  fog_color: ColorNode(0xc0d8ff),
  water_color: ColorNode(0x3f76e4),
  water_fog_color: ColorNode(0x050533),
  sky_color: ColorNode(0x78a7ff),
  foliage_color: Opt(ColorNode()),
  grass_color: Opt(ColorNode())
});

const Spawners = ListNode(
  ObjectNode({
    type: IdentifierNode('entity_type'),
    weight: IntNode({ min: 0 }),
    minCount: IntNode({ min: 0 }),
    maxCount: IntNode({ min: 0 })
  })
);

const SpawnCost = ObjectNode({
  energy_budget: DoubleNode({ min: 0 }),
  charge: DoubleNode({ min: 0 })
});

export const Biome: Model = {
  node: {
    depth: FloatNode(),
    scale: FloatNode(),
    downfall: FloatNode(),
    effects: BiomeEffects,
    category: EnumNode([
      'none',
      'taiga',
      'extreme_hills',
      'jungle',
      'mesa',
      'plains',
      'savanna',
      'icy',
      'the_end',
      'beach',
      'forest',
      'ocean',
      'desert',
      'river',
      'swamp',
      'mushroom',
      'nether',
      'underground'
    ] as const),
    precipitation: EnumNode(['none', 'rain', 'snow'] as const),
    temperature: FloatNode(),
    temperature_modifier: EnumNode(['none', 'frozen'] as const, 'none'),
    surface_builder: IdentifierNode('worldgen/configured_surface_builder'),
    carvers: ObjectNode({
      air: ListNode(ResourceNode('worldgen/configured_carver')),
      liquid: ListNode(ResourceNode('worldgen/configured_carver'))
    }),
    features: ListNode(ListNode(ResourceNode('worldgen/configured_feature'))),
    starts: ListNode(IdentifierNode('worldgen/configured_structure_feature')),
    creature_spawn_probability: FloatNode({
      min: 0,
      max: 0.9999999,
      default: 0.1
    }),
    player_spawn_friendly: BoolNode(false),
    spawners: ObjectNode({
      monster: Spawners,
      creature: Spawners,
      ambient: Spawners,
      underground_water_creature: Spawners,
      water_creature: Spawners,
      water_ambient: Spawners,
      misc: Spawners
    }),
    spawn_costs: ListNode(SpawnCost)
  },
  preset: () => ({
    scale: 0.05,
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
      air: ['minecraft:cave', 'minecraft:canyon']
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
        'minecraft:ore_granite',
        'minecraft:ore_diorite',
        'minecraft:ore_andesite',
        'minecraft:ore_tuff',
        'minecraft:ore_deepslate',
        'minecraft:ore_coal',
        'minecraft:ore_iron',
        'minecraft:ore_gold',
        'minecraft:ore_redstone',
        'minecraft:ore_diamond',
        'minecraft:ore_lapis',
        'minecraft:ore_copper',
        'minecraft:disk_sand',
        'minecraft:disk_clay',
        'minecraft:disk_gravel'
      ],
      ['minecraft:rare_dripstone_cluster', 'minecraft:rare_small_dripstone'],
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
    starts: [
      'minecraft:village_plains',
      'minecraft:pillager_outpost',
      'minecraft:mineshaft',
      'minecraft:stronghold',
      'minecraft:ruined_portal'
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
      underground_water_creature: [
        {
          type: 'minecraft:glow_squid',
          weight: 10,
          minCount: 4,
          maxCount: 6
        },
        {
          type: 'minecraft:axolotl',
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
    category: 'plains',
    depth: 0.125
  })
};

export const Biomes: Option[] = [
  'deep_frozen_ocean',
  'swamp',
  'modified_badlands_plateau',
  'modified_jungle',
  'deep_lukewarm_ocean',
  'frozen_river',
  'taiga_hills',
  'wooded_mountains',
  'the_end',
  'bamboo_jungle',
  'snowy_taiga_mountains',
  'taiga',
  'end_midlands',
  'river',
  'frozen_ocean',
  'wooded_badlands_plateau',
  'mountains',
  'snowy_taiga',
  'modified_wooded_badlands_plateau',
  'eroded_badlands',
  'small_end_islands',
  'dark_forest',
  'the_void',
  'snowy_beach',
  'wooded_hills',
  'dark_forest_hills',
  'desert_hills',
  'end_barrens',
  'bamboo_jungle_hills',
  'crimson_forest',
  'giant_tree_taiga_hills',
  'snowy_taiga_hills',
  'nether_wastes',
  'badlands',
  'jungle_edge',
  'beach',
  'lukewarm_ocean',
  'basalt_deltas',
  'cold_ocean',
  'stone_shore',
  'dripstone_caves',
  'gravelly_mountains',
  'shattered_savanna',
  'desert_lakes',
  'savanna',
  'warm_ocean',
  'deep_cold_ocean',
  'swamp_hills',
  'ocean',
  'savanna_plateau',
  'deep_warm_ocean',
  'giant_tree_taiga',
  'giant_spruce_taiga_hills',
  'modified_gravelly_mountains',
  'badlands_plateau',
  'birch_forest',
  'lush_caves',
  'plains',
  'tall_birch_hills',
  'forest',
  'snowy_tundra',
  'tall_birch_forest',
  'desert',
  'end_highlands',
  'modified_jungle_edge',
  'warped_forest',
  'jungle',
  'jungle_hills',
  'soul_sand_valley',
  'mushroom_field_shore',
  'flower_forest',
  'birch_forest_hills',
  'taiga_mountains',
  'mountain_edge',
  'sunflower_plains',
  'snowy_mountains',
  'deep_ocean',
  'shattered_savanna_plateau',
  'ice_spikes',
  'giant_spruce_taiga',
  'mushroom_fields'
].map(labelizeOption);

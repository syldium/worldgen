import type { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { EnumNode } from '../../model/node/EnumNode';
import { FloatNode, Probability } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { MapNode } from '../../model/node/MapNode';
import { Empty, Obj, Opt } from '../../model/node/ObjectNode';
import { ResourceNode, TagNode } from '../../model/node/ResourceNode';
import { StringNode } from '../../model/node/StringNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { Spawners } from '../1.17/Biome';
import { HeightProvider } from '../1.17/HeightProvider';
import { Heightmap } from '../1.17/WorldgenStep';
import { DecorationStep, TerrainAdaptation } from './DecorationStep';

const StructureSpawn = Obj({
  bounding_box: EnumNode(['piece', 'full']),
  spawns: Spawners
});

const SpawnGroup = [
  'monster',
  'creature',
  'ambient',
  'ambient',
  'axolotls',
  'underground_water_creature',
  'water_creature',
  'water_ambient',
  'misc'
] as const;

export const Structure: Model = {
  node: SwitchNode(
    {
      buried_treasure: Empty,
      desert_pyramid: Empty,
      end_city: Empty,
      fortress: Empty,
      igloo: Empty,
      jigsaw: Obj({
        start_pool: ResourceNode('worldgen/template_pool'),
        start_jigsaw_name: Opt(StringNode()),
        size: IntNode({ min: 0, max: 7 }),
        start_height: HeightProvider,
        project_start_to_heightmap: Opt(Heightmap),
        max_distance_from_center: IntNode({ min: 1, max: 128 }),
        use_expansion_hack: BoolNode()
      }),
      jungle_temple: Empty,
      mineshaft: Obj({
        mineshaft_type: EnumNode(['normal', 'mesa'])
      }),
      nether_fossil: Obj({
        height: HeightProvider
      }),
      ocean_monument: Empty,
      ocean_ruin: Obj({
        biome_temp: EnumNode(['warm', 'cold']),
        large_probability: Probability.probability,
        cluster_probability: Probability.probability
      }),
      ruined_portal: Obj({
        setups: ListNode(Obj({
          placement: EnumNode(
            [
              'on_land_surface',
              'partly_buried',
              'on_ocean_floor',
              'in_mountain',
              'underground',
              'in_nether'
            ]
          ),
          air_pocket_probability: Probability.probability,
          mossiness: Probability.probability,
          overgrown: BoolNode(),
          vines: BoolNode(),
          can_be_cold: BoolNode(),
          replace_with_blackstone: BoolNode(),
          weight: FloatNode({ min: 0 })
        }))
      }),
      shipwreck: Obj({
        is_beached: BoolNode()
      }),
      stronghold: Empty,
      swamp_hut: Empty,
      woodland_mansion: Empty
    },
    {},
    null,
    'type',
    Obj({
      biomes: TagNode('worldgen/biome'),
      spawn_overrides: MapNode(EnumNode(SpawnGroup), StructureSpawn),
      step: DecorationStep,
      terrain_adaptation: TerrainAdaptation
    })
  ),
  preset: () => ({
    type: 'minecraft:jigsaw',
    biomes: '#minecraft:has_structure/mineshaft',
    max_distance_from_center: 80,
    project_start_to_heightmap: 'WORLD_SURFACE_WG',
    size: 1,
    spawn_overrides: {},
    start_height: {
      absolute: 0
    },
    start_pool: 'minecraft:village/plains/town_centers',
    step: 'surface_structures',
    terrain_adaptation: 'beard_thin',
    use_expansion_hack: false
  })
};

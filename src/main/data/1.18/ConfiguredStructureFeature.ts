import type { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { EnumNode } from '../../model/node/EnumNode';
import { Probability } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { MapNode } from '../../model/node/MapNode';
import { Empty, Obj } from '../../model/node/ObjectNode';
import { IdentifierNode, TagNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { Spawners } from '../1.17/Biome';
import { HeightProvider } from '../1.17/HeightProvider';

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
const Parameters = Obj({
  biomes: TagNode('worldgen/biome'),
  adapt_noise: BoolNode(false),
  spawn_overrides: MapNode(EnumNode(SpawnGroup), StructureSpawn)
});

const TemplatePool = Obj({
  start_pool: IdentifierNode('worldgen/template_pool'),
  size: IntNode()
});

export const ConfiguredStructureFeature: Model = {
  node: SwitchNode(
    {
      bastion_remnant: TemplatePool,
      buried_treasure: Obj(Probability),
      desert_pyramid: Empty,
      endcity: Empty,
      fortress: Empty,
      igloo: Empty,
      jungle_pyramid: Empty,
      mansion: Empty,
      mineshaft: Obj({
        type: EnumNode(['normal', 'mesa']),
        ...Probability
      }),
      monument: Empty,
      nether_fossil: Obj({
        height: HeightProvider
      }),
      ocean_ruin: Obj({
        biome_temp: EnumNode(['cold', 'warm']),
        large_probability: Probability.probability,
        cluster_probability: Probability.probability
      }),
      pillager_outpost: TemplatePool,
      ruined_portal: Obj({
        portal_type: EnumNode(
          [
            'standard',
            'desert',
            'jungle',
            'mountain',
            'ocean',
            'swamp',
            'nether'
          ]
        )
      }),
      shipwreck: Obj({
        is_beached: BoolNode(false)
      }),
      stronghold: Empty,
      swamp_hut: Empty,
      village: TemplatePool
    },
    {},
    'config',
    'type',
    Parameters
  ),
  preset: () => ({
    type: 'minecraft:village',
    config: {
      start_pool: 'minecraft:village/plains/town_centers',
      size: 1
    },
    biomes: '#minecraft:has_structure/mineshaft',
    spawn_overrides: {}
  })
};

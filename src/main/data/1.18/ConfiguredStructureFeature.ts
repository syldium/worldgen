import { Model, ObjectModel } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { EnumNode } from '../../model/node/EnumNode';
import { Probability } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ObjectNode, Opt } from '../../model/node/ObjectNode';
import { IdentifierNode, TagNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { Spawners } from '../1.17/Biome';
import { HeightProvider } from '../1.17/HeightProvider';

const StructureSpawn = ObjectNode({
  bounding_box: EnumNode(['piece', 'full'] as const),
  spawns: Spawners
});

const Parameters = {
  biomes: TagNode('worldgen/biome'),
  adapt_noise: BoolNode(false),
  spawn_overrides: ObjectNode({
    monster: Opt(StructureSpawn),
    creature: Opt(StructureSpawn),
    ambient: Opt(StructureSpawn),
    underground_water_creature: Opt(StructureSpawn),
    water_creature: Opt(StructureSpawn),
    water_ambient: Opt(StructureSpawn),
    misc: Opt(StructureSpawn)
  })
};

const TemplatePool: ObjectModel = {
  start_pool: IdentifierNode('worldgen/template_pool'),
  size: IntNode()
};

export const ConfiguredStructureFeature: Model = {
  node: SwitchNode(
    {
      bastion_remnant: TemplatePool,
      buried_treasure: Probability,
      mineshaft: {
        type: EnumNode(['normal', 'mesa'] as const),
        ...Probability
      },
      nether_fossil: {
        height: HeightProvider
      },
      ocean_ruin: {
        biome_temp: EnumNode(['cold', 'warm'] as const),
        large_probability: Probability.probability,
        cluster_probability: Probability.probability
      },
      pillager_outpost: TemplatePool,
      ruined_portal: {
        portal_type: EnumNode(
          [
            'standard',
            'desert',
            'jungle',
            'mountain',
            'ocean',
            'swamp',
            'nether'
          ] as const
        )
      },
      shipwreck: {
        is_beached: BoolNode(false)
      },
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

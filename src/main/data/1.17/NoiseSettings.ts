import { ObjectNode, Opt } from '../../model/node/ObjectNode';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { BoolNode } from '../../model/node/BoolNode';
import { IdentifierNode, ResourceNode } from '../../model/node/ResourceNode';
import { Model } from '../../model/Model';
import { Option } from '../../component/ui/Select';
import { labelizeOption } from '../../util/LabelHelper';
import { MapNode } from '../../model/node/MapNode';

const SamplingConfig = ObjectNode({
  xz_scale: FloatNode({ min: 0.001, max: 1000 }),
  y_scale: FloatNode({ min: 0.001, max: 1000 }),
  xz_factor: FloatNode({ min: 0.001, max: 1000 }),
  y_factor: FloatNode({ min: 0.001, max: 1000 })
});

const SlideConfig = ObjectNode({
  target: IntNode(),
  size: IntNode({ min: 0 }),
  offset: IntNode()
});

const NoiseConfig = ObjectNode({
  min_y: IntNode({ min: -2032, max: 2031, step: 16 }),
  height: IntNode({ min: 0, max: 4064, step: 16 }),
  sampling: SamplingConfig,
  top_slide: SlideConfig,
  bottom_slide: SlideConfig,
  size_horizontal: IntNode({ min: 1, max: 4 }),
  size_vertical: IntNode({ min: 1, max: 4 }),
  density_factor: FloatNode(),
  density_offset: FloatNode(),
  simplex_surface_noise: BoolNode(),
  random_density_offset: BoolNode(false),
  island_noise_override: BoolNode(false),
  amplified: BoolNode(false)
});

const StructureConfig = ObjectNode({
  spacing: IntNode({ min: 0, max: 4096 }),
  separation: IntNode({ min: 0, max: 4096 }),
  salt: IntNode({ min: 0 })
});
const StructuresConfig = ObjectNode({
  stronghold: Opt(
    ObjectNode({
      count: IntNode({ min: 1, max: 4095 }),
      distance: IntNode({ min: 0, max: 1023 }),
      spread: IntNode({ min: 0, max: 1023 })
    })
  ),
  structures: MapNode(
    IdentifierNode('worldgen/configured_structure_feature'),
    StructureConfig
  )
});
export const NoiseSettings: Model = {
  node: {
    structures: StructuresConfig,
    noise: NoiseConfig,
    default_block: ResourceNode('block_state'),
    default_fluid: ResourceNode('block_state'),
    bedrock_roof_position: IntNode(),
    bedrock_floor_position: IntNode(),
    sea_level: IntNode(),
    min_surface_level: IntNode(),
    disable_mob_generation: BoolNode(),
    aquifers_enabled: BoolNode(),
    noise_caves_enabled: BoolNode(),
    deepslate_enabled: BoolNode(),
    ore_veins_enabled: BoolNode(),
    noodle_caves_enabled: BoolNode()
  },
  preset: () => ({
    aquifers_enabled: true,
    noise_caves_enabled: true,
    deepslate_enabled: true,
    bedrock_floor_position: 0,
    sea_level: 63,
    disable_mob_generation: false,
    default_block: {
      Name: 'minecraft:stone'
    },
    default_fluid: {
      Properties: {
        level: '0'
      },
      Name: 'minecraft:water'
    },
    bedrock_roof_position: -2147483648,
    structures: {
      stronghold: {
        distance: 32,
        spread: 3,
        count: 128
      },
      structures: {
        'minecraft:ocean_ruin': {
          spacing: 20,
          separation: 8,
          salt: 14357621
        },
        'minecraft:endcity': {
          spacing: 20,
          separation: 11,
          salt: 10387313
        },
        'minecraft:jungle_pyramid': {
          spacing: 32,
          separation: 8,
          salt: 14357619
        },
        'minecraft:bastion_remnant': {
          spacing: 27,
          separation: 4,
          salt: 30084232
        },
        'minecraft:fortress': {
          spacing: 27,
          separation: 4,
          salt: 30084232
        },
        'minecraft:mansion': {
          spacing: 80,
          separation: 20,
          salt: 10387319
        },
        'minecraft:stronghold': {
          spacing: 1,
          separation: 0,
          salt: 0
        },
        'minecraft:buried_treasure': {
          spacing: 1,
          separation: 0,
          salt: 0
        },
        'minecraft:village': {
          spacing: 32,
          separation: 8,
          salt: 10387312
        },
        'minecraft:monument': {
          spacing: 32,
          separation: 5,
          salt: 10387313
        },
        'minecraft:ruined_portal': {
          spacing: 40,
          separation: 15,
          salt: 34222645
        },
        'minecraft:swamp_hut': {
          spacing: 32,
          separation: 8,
          salt: 14357620
        },
        'minecraft:nether_fossil': {
          spacing: 2,
          separation: 1,
          salt: 14357921
        },
        'minecraft:shipwreck': {
          spacing: 24,
          separation: 4,
          salt: 165745295
        },
        'minecraft:mineshaft': {
          spacing: 1,
          separation: 0,
          salt: 0
        },
        'minecraft:pillager_outpost': {
          spacing: 32,
          separation: 8,
          salt: 165745296
        },
        'minecraft:desert_pyramid': {
          spacing: 32,
          separation: 8,
          salt: 14357617
        },
        'minecraft:igloo': {
          spacing: 32,
          separation: 8,
          salt: 14357618
        }
      }
    },
    noise: {
      simplex_surface_noise: true,
      random_density_offset: true,
      size_vertical: 2,
      density_factor: 1.0,
      density_offset: -0.46875,
      top_slide: {
        target: -10,
        size: 3,
        offset: 0
      },
      bottom_slide: {
        target: 15,
        size: 3,
        offset: 0
      },
      size_horizontal: 1,
      min_y: -64,
      height: 384,
      sampling: {
        xz_scale: 0.9999999814507745,
        y_scale: 0.9999999814507745,
        xz_factor: 80.0,
        y_factor: 160.0
      }
    }
  })
};

export const NoiseSettingsOptions: Option[] = [
  'overworld',
  'amplified',
  'nether',
  'end',
  'caves',
  'floating_islands'
].map(labelizeOption);
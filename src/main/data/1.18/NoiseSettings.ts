import { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { EitherNode } from '../../model/node/EitherNode';
import { EnumNode } from '../../model/node/EnumNode';
import { DoubleNode, FloatNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SamplingConfig, StructuresConfig } from '../1.17/NoiseSettings';
import { RuleSource } from './SurfaceRule';

const SplinePoint = Obj({
  location: FloatNode(),
  value: FloatNode(),
  derivative: FloatNode()
});

const Spline = Obj({
  coordinate: EnumNode(
    [
      'continents',
      'erosion',
      'weirdness',
      'ridges'
    ] as const
  ),
  points: ListNode(SplinePoint)
});

SplinePoint.records.value = EitherNode(SplinePoint.records.value, Spline);

const TerrainShaper = Obj({
  offset: Spline,
  factor: Spline,
  jaggedness: Spline
});

const SlideConfig = Obj({
  target: DoubleNode(),
  size: IntNode({ min: 0 }),
  offset: IntNode()
});

const NoiseConfig = Obj({
  min_y: IntNode({ min: -2032, max: 2031, step: 16 }),
  height: IntNode({ min: 0, max: 4064, step: 16 }),
  sampling: SamplingConfig,
  top_slide: SlideConfig,
  bottom_slide: SlideConfig,
  size_horizontal: IntNode({ min: 1, max: 4 }),
  size_vertical: IntNode({ min: 1, max: 4 }),
  terrain_shaper: TerrainShaper
});
const NoiseParameters = Obj({
  noise: NoiseConfig,
  default_block: ResourceNode('block_state'),
  default_fluid: ResourceNode('block_state'),
  surface_rule: RuleSource,
  sea_level: IntNode(),
  disable_mob_generation: BoolNode(),
  aquifers_enabled: BoolNode(),
  noise_caves_enabled: BoolNode(),
  ore_veins_enabled: BoolNode(),
  noodle_caves_enabled: BoolNode(),
  legacy_random_source: BoolNode(),
  structures: StructuresConfig
});

export const NoiseSettings: Model = {
  node: NoiseParameters,
  preset: () => ({
    noise_caves_enabled: true,
    ore_veins_enabled: true,
    noodle_caves_enabled: true,
    legacy_random_source: false,
    sea_level: 63,
    disable_mob_generation: false,
    aquifers_enabled: true,
    default_block: {
      Name: 'minecraft:stone'
    },
    default_fluid: {
      Properties: {
        level: '0'
      },
      Name: 'minecraft:water'
    },
    surface_rule: {
      sequence: [
        {
          if_true: {
            random_name: 'minecraft:bedrock_floor',
            true_at_and_below: {
              above_bottom: 0
            },
            false_at_and_above: {
              above_bottom: 5
            },
            type: 'minecraft:vertical_gradient'
          },
          then_run: {
            result_state: {
              Name: 'minecraft:bedrock'
            },
            type: 'minecraft:block'
          },
          type: 'minecraft:condition'
        }
      ],
      type: 'minecraft:sequence'
    },
    structures: {
      stronghold: {
        distance: 32,
        spread: 3,
        count: 128
      },
      structures: {
        'minecraft:igloo': {
          spacing: 32,
          separation: 8,
          salt: 14357618
        },
        'minecraft:mansion': {
          spacing: 80,
          separation: 20,
          salt: 10387319
        },
        'minecraft:jungle_pyramid': {
          spacing: 32,
          separation: 8,
          salt: 14357619
        },
        'minecraft:nether_fossil': {
          spacing: 2,
          separation: 1,
          salt: 14357921
        },
        'minecraft:stronghold': {
          spacing: 1,
          separation: 0,
          salt: 0
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
        'minecraft:desert_pyramid': {
          spacing: 32,
          separation: 8,
          salt: 14357617
        },
        'minecraft:ruined_portal': {
          spacing: 40,
          separation: 15,
          salt: 34222645
        },
        'minecraft:fortress': {
          spacing: 27,
          separation: 4,
          salt: 30084232
        },
        'minecraft:pillager_outpost': {
          spacing: 32,
          separation: 8,
          salt: 165745296
        },
        'minecraft:village': {
          spacing: 32,
          separation: 8,
          salt: 10387312
        },
        'minecraft:endcity': {
          spacing: 20,
          separation: 11,
          salt: 10387313
        },
        'minecraft:buried_treasure': {
          spacing: 1,
          separation: 0,
          salt: 0
        },
        'minecraft:ocean_ruin': {
          spacing: 20,
          separation: 8,
          salt: 14357621
        },
        'minecraft:bastion_remnant': {
          spacing: 27,
          separation: 4,
          salt: 30084232
        },
        'minecraft:swamp_hut': {
          spacing: 32,
          separation: 8,
          salt: 14357620
        },
        'minecraft:monument': {
          spacing: 32,
          separation: 5,
          salt: 10387313
        }
      }
    },
    noise: {
      terrain_shaper: {
        offset: {
          coordinate: 'continents',
          points: [
            {
              location: -1,
              value: 0.05,
              derivative: 0
            }
          ]
        },
        factor: {
          coordinate: 'continents',
          points: [
            {
              location: -0.19,
              value: 3.95,
              derivative: 0
            }
          ]
        },
        jaggedness: {
          coordinate: 'continents',
          points: [
            {
              location: -0.11,
              value: 0,
              derivative: 0
            }
          ]
        }
      },
      top_slide: {
        target: -0.078125,
        size: 2,
        offset: 8
      },
      bottom_slide: {
        target: 0.1171875,
        size: 3,
        offset: 0
      },
      size_horizontal: 1,
      size_vertical: 2,
      min_y: -64,
      height: 384,
      sampling: {
        xz_scale: 1,
        y_scale: 1,
        xz_factor: 80,
        y_factor: 160
      }
    }
  })
};

import { Option } from '../../component/ui/Select';
import type { Model } from '../../model/Model';
import { Obj } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { omit } from '../../util/DataHelper';
import { labelizeOption } from '../../util/LabelHelper';
import { NoiseParameters as NoiseParameters1_18 } from '../1.18/NoiseSettings';

const DensityFunction = ResourceNode('worldgen/density_function');
const NoiseRouter = {
  barrier: DensityFunction,
  fluid_level_floodedness: DensityFunction,
  fluid_level_spread: DensityFunction,
  lava: DensityFunction,
  temperature: DensityFunction,
  vegetation: DensityFunction,
  continents: DensityFunction,
  erosion: DensityFunction,
  depth: DensityFunction,
  ridges: DensityFunction,
  initial_density_without_jaggedness: DensityFunction,
  final_density: DensityFunction,
  vein_toggle: DensityFunction,
  vein_ridged: DensityFunction,
  vein_gap: DensityFunction
};

export const NoiseParameters = {
  ...omit(
    NoiseParameters1_18,
    'noise_caves_enabled',
    'noodle_caves_enabled',
    'structures'
  ),
  noise_router: Obj(NoiseRouter)
};

export const NoiseSettings: Model = {
  node: Obj(NoiseParameters),
  preset: () => ({
    sea_level: 63,
    disable_mob_generation: false,
    aquifers_enabled: true,
    ore_veins_enabled: true,
    legacy_random_source: false,
    default_block: {
      Name: 'minecraft:stone'
    },
    default_fluid: {
      Name: 'minecraft:water',
      Properties: {
        level: '0'
      }
    },
    noise: {
      min_y: -64,
      height: 384,
      size_horizontal: 1,
      size_vertical: 2,
      sampling: {
        xz_scale: 0.9999999814507745,
        y_scale: 0.9999999814507745,
        xz_factor: 80,
        y_factor: 160
      },
      bottom_slide: {
        target: 0.1171875,
        size: 3,
        offset: 0
      },
      top_slide: {
        target: -0.078125,
        size: 2,
        offset: 8
      },
      terrain_shaper: {
        offset: 0,
        factor: 0,
        jaggedness: 0
      }
    },
    noise_router: {
      barrier: 0,
      fluid_level_floodedness: 0,
      fluid_level_spread: 0,
      lava: 0,
      temperature: 0,
      vegetation: 0,
      continents: 0,
      erosion: 0,
      depth: 0,
      ridges: 0,
      initial_density_without_jaggedness: 0,
      final_density: {
        type: 'minecraft:interpolated',
        argument: 'minecraft:overworld/base_3d_noise'
      },
      vein_toggle: 0,
      vein_ridged: 0,
      vein_gap: 0
    },
    surface_rule: {
      type: 'minecraft:sequence',
      sequence: []
    }
  })
};

export const NoiseSettingsOptions: Option[] = [
  'amplified',
  'caves',
  'end',
  'floating_islands',
  'large_biomes',
  'nether',
  'overworld'
].map(labelizeOption);

import { Model } from '../../model/Model';
import { FloatNode } from '../../model/node/FloatNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj } from '../../model/node/ObjectNode';
import { omit } from '../../util/DataHelper';
import { NoiseParameters as NoiseParameters1_18_2 } from '../1.18.2/NoiseSettings';
import { NoiseConfig as NoiseConfig1_18 } from '../1.18/NoiseSettings';
import { RangeInterval } from '../1.18/RangeInterval';

const range = RangeInterval(FloatNode({ min: -2, max: 2 }));
export const NoiseParameters = {
  ...NoiseParameters1_18_2,
  noise: Obj(
    omit(
      NoiseConfig1_18,
      'terrain_shaper',
      'sampling',
      'bottom_slide',
      'top_slide'
    )
  ),
  spawn_target: ListNode(Obj({
    continentalness: range,
    depth: range,
    erosion: range,
    humidity: range,
    temperature: range,
    weirdness: range,
    offset: FloatNode({ min: 0, max: 1 })
  }))
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
      size_vertical: 2
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
    spawn_target: [],
    surface_rule: {
      type: 'minecraft:sequence',
      sequence: []
    }
  })
};

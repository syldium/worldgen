import { NoiseParameters as NoiseParameters1_17 } from '../1.17/NoiseSettings';
import { Model, ObjectModel } from '../../model/Model';
import { ObjectNode } from '../../model/node/ObjectNode';
import { NoiseValues } from '../1.17/BiomeSource';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { min_surface_level, ...NoiseParameters } = {
  ...NoiseParameters1_17,
  octaves: ObjectNode({
    continentalness: NoiseValues,
    erosion: NoiseValues,
    humidity: NoiseValues,
    temperature: NoiseValues,
    weirdness: NoiseValues,
    shift: NoiseValues
  })
};

export const NoiseSettings: Model = {
  node: NoiseParameters as unknown as ObjectModel,
  preset: () => ({
    noise_caves_enabled: true,
    deepslate_enabled: true,
    ore_veins_enabled: true,
    noodle_caves_enabled: true,
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
    bedrock_roof_position: -2147483648,
    bedrock_floor_position: 0,
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
      random_density_offset: true,
      density_factor: 1.0,
      density_offset: -0.51875,
      simplex_surface_noise: true,
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
        xz_scale: 0.9999999814507745,
        y_scale: 0.9999999814507745,
        xz_factor: 80.0,
        y_factor: 160.0
      }
    },
    octaves: {
      erosion: {
        firstOctave: -9,
        amplitudes: [1.0, 1.0, 0.0, 1.0, 1.0]
      },
      weirdness: {
        firstOctave: -7,
        amplitudes: [1.0, 2.0, 1.0, 0.0, 0.0, 0.0]
      },
      shift: {
        firstOctave: -3,
        amplitudes: [1.0, 1.0, 1.0, 0.0]
      },
      temperature: {
        firstOctave: -9,
        amplitudes: [1.5, 0.0, 1.0, 0.0, 0.0, 0.0]
      },
      humidity: {
        firstOctave: -7,
        amplitudes: [1.0, 1.0, 0.0, 0.0, 0.0, 0.0]
      },
      continentalness: {
        firstOctave: -9,
        amplitudes: [1.0, 1.0, 2.0, 2.0, 2.0, 1.0, 1.0, 1.0, 1.0]
      }
    }
  })
};

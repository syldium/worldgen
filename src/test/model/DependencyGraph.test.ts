import { WorldgenRegistryHolder } from '../../main/model/Registry';
import {
  analyzeDependencies,
  removeDependency,
  renameDependency,
  updateDependencyGraph
} from '../../main/model/graph/DependencyGraph';
import type {
  Dependants,
  DependencyGraph
} from '../../main/model/graph/DependencyGraph';
import { structuredClone } from '../../copy-utils';
import { Biome } from '../../main/data/1.17/Biome';

interface BiomeType {
  surface_builder: string;
  features: string[][];
}
const dimension = {
  type: 'minecraft:overworld', // dimension_type
  generator: {
    biome_source: {
      seed: 286956243,
      temperature_noise: {
        firstOctave: -7,
        amplitudes: [1, 1]
      },
      biomes: [
        {
          biome: 'minecraft:plains', // biome
          parameters: {
            temperature: 0.6,
            humidity: 0.4
          }
        },
        {
          biome: 'ocean', // biome
          parameters: {
            temperature: 0.5,
            humidity: 0.5
          }
        }
      ],
      type: 'multi_noise'
    },
    seed: 286956243,
    settings: 'overworld', // noise_settings
    type: 'minecraft:noise'
  }
};

const key = 'me:key';
const dependant = (resource = key): Dependants => ({
  dimension: new Set([resource])
});
const graph: DependencyGraph = {
  dimension_type: {
    'minecraft:overworld': dependant()
  },
  'worldgen/noise_settings': {
    'minecraft:overworld': dependant()
  },
  'worldgen/biome': {
    'minecraft:plains': dependant(),
    'minecraft:ocean': dependant()
  }
};

describe('DependencyGraph', function () {
  it('should find dependencies', () => {
    const holder = new WorldgenRegistryHolder('1.17');
    holder.register('dimension', key, dimension);
    expect(analyzeDependencies(holder)).toEqual(graph);
  });

  it('should rename occurrences', () => {
    const holder = new WorldgenRegistryHolder('1.17');
    holder.register('dimension', key, structuredClone(dimension));
    holder.register('worldgen/biome', key, Biome.preset(holder.gameVersion));
    holder.graph = analyzeDependencies(holder); // TODO change to be in #register
    renameDependency(
      holder,
      'worldgen/biome',
      'minecraft:ocean',
      'changed:ocean'
    );
    renameDependency(
      holder,
      'worldgen/noise_settings',
      'minecraft:overworld',
      'me:noise'
    );
    renameDependency(
      holder,
      'worldgen/configured_feature',
      'minecraft:ore_granite',
      'me:granite_inverse'
    );
    const expectedDim = structuredClone(dimension);
    expectedDim.generator.biome_source.biomes[1].biome = 'changed:ocean';
    expectedDim.generator.settings = 'me:noise';
    expect(holder.worldgen.dimension.entries[key]).toEqual(expectedDim);

    const expectedBiome = Biome.preset(
      holder.gameVersion
    ) as unknown as BiomeType;
    expectedBiome.features[6][2] = 'me:granite_inverse';
    expect(holder.worldgen['worldgen/biome'].entries[key]).toEqual(
      expectedBiome
    );
  });

  it('should correctly find new references', () => {
    const holder = new WorldgenRegistryHolder('1.17');
    updateDependencyGraph(holder, 'dimension', key, undefined, dimension);
    expect(holder.graph).toEqual(graph);
  });

  it('should correctly diff', () => {
    const holder = new WorldgenRegistryHolder('1.17');
    holder.register('dimension', key, structuredClone(dimension));
    holder.graph = analyzeDependencies(holder); // TODO change to be in #register
    const edited = structuredClone(dimension);
    edited.type = 'me:dimension_type';
    updateDependencyGraph(
      holder,
      'dimension',
      key,
      holder.worldgen.dimension.entries[key],
      edited
    );
    expect(holder.graph).toEqual({
      ...graph,
      dimension_type: {
        'me:dimension_type': dependant()
      }
    } as DependencyGraph);
  });

  it('should remove dependants', () => {
    const holder = new WorldgenRegistryHolder('1.17');
    const original = Biome.preset(holder.gameVersion) as unknown as BiomeType;
    original.features[5] = ['minecraft:monster_room']; // Add two occurrences of the same feature for the test
    holder.register('worldgen/biome', key, original);
    holder.graph = analyzeDependencies(holder); // TODO change to be in #register
    expect(
      removeDependency(
        holder,
        'worldgen/configured_feature',
        'minecraft:monster_room'
      )
    ).toEqual({});
    expect(
      removeDependency(
        holder,
        'worldgen/configured_feature',
        'minecraft:rare_small_dripstone'
      )
    ).toEqual({});
    expect(
      removeDependency(
        holder,
        'worldgen/configured_surface_builder',
        'minecraft:grass'
      )
    ).toEqual({
      'worldgen/biome': new Set([key])
    } as Dependants);
    const expected = Biome.preset(holder.gameVersion) as unknown as BiomeType;
    expected.features[3] = [];
    expected.features[7] = ['minecraft:rare_dripstone_cluster'];
    expect(holder.worldgen['worldgen/biome'].entries[key]).toEqual(expected);

    const features = holder.graph['worldgen/configured_feature']!;
    expect(features).not.toHaveProperty('minecraft:monster_room');
    expect(features).not.toHaveProperty('minecraft:rare_small_dripstone');
    expect(
      holder.graph['worldgen/configured_surface_builder']!['minecraft:grass']
    ).toEqual({
      'worldgen/biome': new Set([key])
    } as Dependants);
  });

  it('should do nothing', () => {
    const holder = new WorldgenRegistryHolder('1.17');
    holder.register('dimension', key, structuredClone(dimension));
    holder.graph = analyzeDependencies(holder);
    expect(
      renameDependency(holder, 'worldgen/noise_settings', 'a:a', 'b:b')
    ).toBe(0);
    expect(removeDependency(holder, 'worldgen/biome', 'v:empty')).toEqual({});
    expect(holder.graph).toEqual(graph);
  });
});

import { IntProvider } from './NumberProvider';
import { Model, ObjectModel } from '../../model/Model';
import { IntNode } from '../../model/node/IntNode';
import { FloatNode } from '../../model/node/FloatNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { EnumNode } from '../../model/node/EnumNode';
import { YOffset } from './HeightProvider';
import { Heightmap, VerticalSurface } from './WorldgenStep';

const CarvingMaskConfig: ObjectModel = {
  step: EnumNode(['air', 'liquid'] as const)
};

const CaveSurfaceConfig: ObjectModel = {
  surface: VerticalSurface,
  floor_to_ceiling_search_range: IntNode()
};

const ChanceConfig: ObjectModel = {
  chance: IntNode()
};

const CountConfig: ObjectModel = {
  count: IntProvider(0, 256)
};

const CountExtraConfig: ObjectModel = {
  count: IntNode(),
  extra_chance: FloatNode(),
  extra_count: IntNode()
};

const CountNoiseConfig: ObjectModel = {
  noise_level: FloatNode(),
  below_noise: IntNode(),
  above_noise: IntNode()
};

const CountNoiseBiasedConfig: ObjectModel = {
  noise_to_count_ratio: IntNode(),
  noise_factor: FloatNode(),
  noise_offset: FloatNode({ default: 0 })
};

const DecoratedConfig: ObjectModel = {
  outer: ResourceNode('worldgen/configured_decorator'),
  inner: ResourceNode('worldgen/configured_decorator')
};

const HeightmapConfig: ObjectModel = {
  heightmap: Heightmap
};

const RangeConfig: ObjectModel = {
  height: YOffset
};

const WaterDepthThresholdConfig: ObjectModel = {
  max_water_depth: IntNode()
};

export const ConfiguredDecorator: Model = {
  node: SwitchNode({
    carving_mask: CarvingMaskConfig,
    cave_surface: CaveSurfaceConfig,
    chance: ChanceConfig,
    count: CountConfig,
    count_extra: CountExtraConfig,
    count_multilayer: CountConfig,
    count_noise: CountNoiseConfig,
    count_noise_biased: CountNoiseBiasedConfig,
    dark_oak_tree: {},
    decorated: DecoratedConfig,
    end_gateway: {},
    heightmap: HeightmapConfig,
    heightmap_spread_double: HeightmapConfig,
    water_depth_threshold: WaterDepthThresholdConfig,
    iceberg: {},
    lava_lake: ChanceConfig,
    nope: {},
    range: RangeConfig,
    spread_32_above: {},
    square: {}
  }),
  preset: () => ({})
};

import type { Model } from '../../model/Model';
import { EnumNode } from '../../model/node/EnumNode';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { Empty, Obj } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { HeightProvider } from './HeightProvider';
import { IntProvider } from './NumberProvider';
import { Heightmap, VerticalSurface } from './WorldgenStep';

const CarvingMaskConfig = Obj({
  step: EnumNode(['air', 'liquid'])
});

const CaveSurfaceConfig = Obj({
  surface: VerticalSurface,
  floor_to_ceiling_search_range: IntNode()
});

const ChanceConfig = Obj({
  chance: IntNode()
});

const CountConfig = Obj({
  count: IntProvider(0, 256)
});

const CountExtraConfig = Obj({
  count: IntNode(),
  extra_chance: FloatNode(),
  extra_count: IntNode()
});

const CountNoiseConfig = Obj({
  noise_level: FloatNode(),
  below_noise: IntNode(),
  above_noise: IntNode()
});

const CountNoiseBiasedConfig = Obj({
  noise_to_count_ratio: IntNode(),
  noise_factor: FloatNode(),
  noise_offset: FloatNode({ default: 0 })
});

const DecoratedConfig = Obj({
  outer: ResourceNode('worldgen/configured_decorator'),
  inner: ResourceNode('worldgen/configured_decorator')
});

const HeightmapConfig = Obj({
  heightmap: Heightmap
});

const RangeConfig = Obj({
  height: HeightProvider
});

const WaterDepthThresholdConfig = Obj({
  max_water_depth: IntNode()
});

export const CountDecoratorConfig = {
  config: {
    count: 10
  }
};

const DecoratorDefaults = {
  carving_mask: {
    config: {
      step: 'liquid'
    }
  },
  cave_surface: {
    config: {
      surface: 'ceiling',
      floor_to_ceiling_search_range: 12
    }
  },
  chance: {
    config: {
      chance: 12
    }
  },
  count: CountDecoratorConfig,
  count_extra: {
    config: {
      count: 6,
      extra_chance: 0.1,
      extra_count: 1
    }
  },
  count_multilayer: {
    config: {
      count: 8
    }
  },
  count_noise: {
    config: {
      noise_level: -0.8,
      below_noise: 5,
      above_noise: 10
    }
  },
  count_noise_biased: {
    config: {
      noise_to_count_ratio: 160,
      noise_factor: 80.0,
      noise_offset: 0.3
    }
  },
  decorated: {
    config: {
      outer: {
        config: {
          max_water_depth: 0
        },
        type: 'minecraft:water_depth_threshold'
      },
      inner: {
        config: {
          heightmap: 'OCEAN_FLOOR'
        },
        type: 'minecraft:heightmap'
      }
    }
  },
  heightmap: {
    config: {
      heightmap: 'MOTION_BLOCKING'
    }
  },
  heightmap_spread_double: {
    config: {
      heightmap: 'MOTION_BLOCKING'
    }
  },
  lava_lake: {
    config: {
      chance: 80
    }
  },
  range: {
    config: {
      height: {
        min_inclusive: {
          absolute: 0
        },
        max_inclusive: {
          absolute: 79
        },
        type: 'minecraft:uniform'
      }
    }
  },
  water_depth_threshold: {
    config: {
      max_water_depth: 0
    }
  }
};

export const DecoratorsSwitch = SwitchNode(
  {
    carving_mask: CarvingMaskConfig,
    cave_surface: CaveSurfaceConfig,
    chance: ChanceConfig,
    count: CountConfig,
    count_extra: CountExtraConfig,
    count_multilayer: CountConfig,
    count_noise: CountNoiseConfig,
    count_noise_biased: CountNoiseBiasedConfig,
    dark_oak_tree: Empty,
    decorated: DecoratedConfig,
    end_gateway: Empty,
    heightmap: HeightmapConfig,
    heightmap_spread_double: HeightmapConfig,
    water_depth_threshold: WaterDepthThresholdConfig,
    iceberg: Empty,
    lava_lake: ChanceConfig,
    nope: Empty,
    range: RangeConfig,
    spread_32_above: Empty,
    square: Empty
  },
  DecoratorDefaults
);

export const ConfiguredDecorator: Model = {
  node: DecoratorsSwitch,
  preset: () => ({})
};

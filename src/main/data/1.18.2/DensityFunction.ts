import type { Model } from '../../model/Model';
import { EitherNode } from '../../model/node/EitherNode';
import { EnumNode } from '../../model/node/EnumNode';
import { DoubleNode, FloatNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import { SwitchNode } from '../../model/node/SwitchNode';

const ConstantRange = DoubleNode({ min: -1000000, max: 1000000 });
const YRange = IntNode({ min: -2032 * 2, max: 2031 * 2 });
const UnaryFunction = Obj({
  argument: ResourceNode('worldgen/density_function')
});
const BinaryFunction = Obj({
  argument1: ResourceNode('worldgen/density_function'),
  argument2: ResourceNode('worldgen/density_function')
});

const SplinePoint = Obj({
  location: FloatNode(),
  derivative: FloatNode()
  //value: CubicSpline
});
export const CubicSpline = EitherNode(
  FloatNode(),
  Obj({
    coordinate: ResourceNode('worldgen/density_function'),
    points: ListNode(SplinePoint)
  })
);
SplinePoint.records.value = CubicSpline;

export const DynamicRangeDensityFunction = SwitchNode(
  {
    abs: UnaryFunction,
    add: BinaryFunction,
    blend_density: UnaryFunction,
    cache_2d: UnaryFunction,
    cache_all_in_cell: UnaryFunction,
    cache_once: UnaryFunction,
    clamp: Obj({
      input: ResourceNode('worldgen/density_function'),
      min: ConstantRange,
      max: ConstantRange
    }),
    constant: ConstantRange,
    cube: UnaryFunction,
    flat_cache: UnaryFunction,
    half_negative: UnaryFunction,
    interpolated: UnaryFunction,
    max: BinaryFunction,
    min: BinaryFunction,
    mul: BinaryFunction,
    noise: Obj({
      noise: ResourceNode('worldgen/noise'),
      xz_scale: FloatNode(),
      y_scale: FloatNode()
    }),
    quarter_negative: BinaryFunction,
    range_choice: Obj({
      input: ResourceNode('worldgen/density_function'),
      min_inclusive: ConstantRange,
      max_exclusive: ConstantRange,
      when_in_range: ResourceNode('worldgen/density_function'),
      when_out_of_range: ResourceNode('worldgen/density_function')
    }),
    shift: UnaryFunction,
    shift_a: UnaryFunction,
    shift_b: UnaryFunction,
    shifted_noise: Obj({
      noise: ResourceNode('worldgen/noise'),
      xz_scale: FloatNode(),
      y_scale: FloatNode(),
      shift_x: ResourceNode('worldgen/density_function'),
      shift_y: ResourceNode('worldgen/density_function'),
      shift_z: ResourceNode('worldgen/density_function')
    }),
    slide: UnaryFunction,
    spline: Obj({
      spline: CubicSpline,
      min_value: ConstantRange,
      max_value: ConstantRange
    }),
    square: UnaryFunction,
    squeeze: UnaryFunction,
    terrain_shaper_spline: Obj({
      spline: EnumNode(['offset', 'factor', 'jaggedness'] as const),
      min_value: ConstantRange,
      max_value: ConstantRange,
      continentalness: ResourceNode('worldgen/density_function'),
      erosion: ResourceNode('worldgen/density_function'),
      weirdness: ResourceNode('worldgen/density_function')
    }),
    weird_scaled_sampler: Obj({
      rarity_value_mapper: EnumNode(['type_1', 'type_2'] as const),
      noise: ResourceNode('worldgen/noise'),
      input: ResourceNode('worldgen/density_function')
    }),
    y_clamped_gradient: Obj({
      from_y: YRange,
      to_y: YRange,
      from_value: ConstantRange,
      to_value: ConstantRange
    })
  },
  {},
  null
);
export const DensityFunction: Model = {
  node: EitherNode(ConstantRange, DynamicRangeDensityFunction),
  preset: () => 0
};

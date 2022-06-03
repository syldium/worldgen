import type { Model } from '../../model/Model';
import { EitherNode } from '../../model/node/EitherNode';
import { DoubleNode } from '../../model/node/FloatNode';
import { Obj } from '../../model/node/ObjectNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { omit } from '../../util/DataHelper';
import {
  CubicSpline,
  DynamicRangeDensityFunction as DensityFunction1_18_2
} from '../1.18.2/DensityFunction';

const ConstantRange = DoubleNode({ min: -1000000, max: 1000000 });
const ScaleRange = DoubleNode({ min: 0.001, max: 1000 });
const DynamicRangeDensityFunction = SwitchNode(
  {
    ...omit(DensityFunction1_18_2.values, 'terrain_shaper_spline'),
    spline: Obj({
      spline: CubicSpline
    }),
    old_blended_noise: Obj({
      smear_scale_multiplier: DoubleNode({ min: 1, max: 8 }),
      xz_scale: ScaleRange,
      y_scale: ScaleRange,
      xz_factor: ScaleRange,
      y_factor: ScaleRange
    })
  },
  DensityFunction1_18_2.preset,
  DensityFunction1_18_2.config
);

export const DensityFunction: Model = {
  node: EitherNode(ConstantRange, DynamicRangeDensityFunction),
  preset: () => ({
    type: 'minecraft:old_blended_noise',
    smear_scale_multiplier: 4,
    xz_factor: 80,
    xz_scale: 0.25,
    y_factor: 160,
    y_scale: 0.25
  })
};

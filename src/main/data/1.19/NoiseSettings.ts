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
  preset: () => ({})
};

import type { Model } from '../../model/Model';
import { Obj } from '../../model/node/ObjectNode';
import { omit } from '../../util/DataHelper';
import {
  NoiseParameters as NoiseParameters1_18,
  NoiseSettings as NoiseSettings1_18
} from '../1.18/NoiseSettings';

export const NoiseParameters = omit(
  NoiseParameters1_18,
  'noise_caves_enabled',
  'noodle_caves_enabled',
  'structures'
);
export const NoiseSettings: Model = {
  node: Obj(NoiseParameters),
  preset: NoiseSettings1_18.preset
};

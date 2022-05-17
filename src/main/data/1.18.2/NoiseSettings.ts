import { Option } from '../../component/ui/Select';
import type { Model } from '../../model/Model';
import { Obj } from '../../model/node/ObjectNode';
import { omit } from '../../util/DataHelper';
import { labelizeOption } from '../../util/LabelHelper';
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

export const NoiseSettingsOptions: Option[] = [
  'amplified',
  'caves',
  'end',
  'floating_islands',
  'large_biomes',
  'nether',
  'overworld'
].map(labelizeOption);

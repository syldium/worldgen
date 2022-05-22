import type { Model } from '../../model/Model';
import { Obj } from '../../model/node/ObjectNode';
import { omit } from '../../util/DataHelper';
import {
  Biome as BiomeModel1_18_2,
  BiomeSettings as Biome1_18_2
} from '../1.18.2/Biome';

const v1_18 = omit(Biome1_18_2, 'category');

export const Biome: Model = {
  node: Obj(v1_18),
  preset: BiomeModel1_18_2.preset
};

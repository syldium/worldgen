import type { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { Obj } from '../../model/node/ObjectNode';
import { omit } from '../../util/DataHelper';
import {
  Biome as BiomeModel1_19,
  BiomeSettings as Biome1_19
} from '../1.19/Biome';

const v1_19 = {
  ...omit(Biome1_19, 'precipitation'),
  has_precipitation: BoolNode()
};

export const Biome: Model = {
  node: Obj(v1_19),
  preset: BiomeModel1_19.preset
};

import { Model } from '../../model/Model';
import { Obj } from '../../model/node/ObjectNode';
import { SwitchNode, SwitchNodeParams } from '../../model/node/SwitchNode';
import { omit } from '../../util/DataHelper';
import {
  ChunkGenerator as ChunkGenerator1_17,
  NoiseGenerator as NoiseGenerator1_17
} from '../1.17/ChunkGenerator';

const NoiseGenerator = omit(NoiseGenerator1_17, 'seed');

export const ChunkGenerator: Model = {
  node: SwitchNode(
    {
      ...(ChunkGenerator1_17.node as SwitchNodeParams).values,
      noise: Obj(NoiseGenerator)
    },
    (ChunkGenerator1_17.node as SwitchNodeParams).preset,
    null
  ),
  preset: ChunkGenerator1_17.preset
};

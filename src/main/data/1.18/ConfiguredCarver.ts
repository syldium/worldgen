import { Model } from '../../model/Model';
import { Obj } from '../../model/node/ObjectNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { omit } from '../../util/DataHelper';
import {
  CaveCarverConfig as CaveCarverConfig1_17,
  ConfiguredCarver as ConfiguredCarver1_17,
  RavineCarverConfig as RavineCarverConfig1_17
} from '../1.17/ConfiguredCarver';

export const CaveCarverConfig = omit(CaveCarverConfig1_17, 'aquifers_enabled');
export const RavineCarverConfig = omit(
  RavineCarverConfig1_17,
  'aquifers_enabled'
);

export const ConfiguredCarver: Model = {
  node: SwitchNode({
    cave: Obj(CaveCarverConfig),
    nether_cave: Obj(CaveCarverConfig),
    canyon: Obj(RavineCarverConfig),
    underwater_canyon: Obj(RavineCarverConfig),
    underwater_cave: Obj(CaveCarverConfig)
  }),
  preset: ConfiguredCarver1_17.preset
};

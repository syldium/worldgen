import { Model } from '../../model/Model';
import type { SwitchNodeParams } from '../../model/node/SwitchNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { ConfiguredFeature as ConfiguredFeature1_17 } from '../1.17/ConfiguredFeature';

const features1_17 = ConfiguredFeature1_17.node as SwitchNodeParams;
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { sapling_provider, ...tree } = features1_17.values.tree;
export const ConfiguredFeature: Model = {
  node: SwitchNode(
    {
      ...features1_17.values,
      tree
    },
    features1_17.preset
  ),
  preset: ConfiguredFeature1_17.preset
};

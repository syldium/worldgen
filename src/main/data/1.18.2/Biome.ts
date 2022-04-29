import type { Model } from '../../model/Model';
import { EnumNode } from '../../model/node/EnumNode';
import { ListNode } from '../../model/node/ListNode';
import { MapNode } from '../../model/node/MapNode';
import { Obj } from '../../model/node/ObjectNode';
import { ResourceNode } from '../../model/node/ResourceNode';
import {
  Biome as Biome1_18,
  BiomeSettings as BiomeSettings1_18
} from '../1.18/Biome';

export const BiomeSettings = {
  ...BiomeSettings1_18,
  carvers: MapNode(
    EnumNode(['air', 'liquid'] as const),
    ListNode(ResourceNode('worldgen/configured_carver'), -1, false, true)
  )
};

export const Biome: Model = {
  node: Obj(BiomeSettings),
  preset: Biome1_18.preset
};

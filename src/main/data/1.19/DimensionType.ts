import { Model } from '../../model/Model';
import { IntNode } from '../../model/node/IntNode';
import { Obj, ObjectNodeParams } from '../../model/node/ObjectNode';
import { DimensionType as DimensionType1_17 } from '../1.17/DimensionType';
import { IntProvider } from '../1.17/NumberProvider';

export const DimensionType: Model = {
  node: Obj({
    ...(DimensionType1_17.node as ObjectNodeParams).records,
    monster_spawn_block_light_limit: IntNode({ min: 0, max: 15 }),
    monster_spawn_light_level: IntProvider(0, 15)
  }),
  preset: () => ({
    ambient_light: 0,
    bed_works: true,
    coordinate_scale: 1.0,
    effects: 'minecraft:overworld',
    has_ceiling: false,
    has_raids: true,
    has_skylight: true,
    height: 384,
    infiniburn: '#minecraft:infiniburn_overworld',
    logical_height: 384,
    min_y: -64,
    monster_spawn_block_light_limit: 0,
    monster_spawn_light_level: {
      type: 'minecraft:uniform',
      value: {
        max_inclusive: 7,
        min_inclusive: 0
      }
    },
    natural: true,
    piglin_safe: false,
    respawn_anchor_works: false,
    ultrawarm: false
  })
};

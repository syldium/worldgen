import { Model } from '../../model/Model';
import { DimensionType as DimensionType1_17 } from '../1.17/DimensionType';

export const DimensionType: Model = {
  node: DimensionType1_17.node,
  preset: () => ({
    logical_height: 384,
    infiniburn: '#minecraft:infiniburn_overworld',
    effects: 'minecraft:overworld',
    ambient_light: 0.0,
    respawn_anchor_works: false,
    has_raids: true,
    min_y: -64,
    height: 384,
    natural: true,
    coordinate_scale: 1.0,
    piglin_safe: false,
    bed_works: true,
    has_skylight: true,
    has_ceiling: false,
    ultrawarm: false
  })
};

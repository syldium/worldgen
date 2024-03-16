import { EnumNode } from '../../model/node/EnumNode';

export const Heightmap = EnumNode({
  WORLD_SURFACE_WG: 'World surface (non-air block)',
  WORLD_SURFACE: 'World surface for client',
  OCEAN_FLOOR_WG: 'Ocean floor (non-air block, solid block)',
  OCEAN_FLOOR: 'Ocean floor for client',
  MOTION_BLOCKING: 'Motion blocking (that blocks motion or contains a fluid)',
  MOTION_BLOCKING_NO_LEAVES:
    "Motion blocking no leaves (that blocks motion or contains a fluid and isn't leaves)"
});

export const VerticalSurface = EnumNode(['ceiling', 'floor']);

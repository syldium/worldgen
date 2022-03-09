import type { Option } from '../../component/ui/Select';
import { DefaultedModel, Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { EnumNode } from '../../model/node/EnumNode';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode, LongNode } from '../../model/node/IntNode';
import { Opt } from '../../model/node/ObjectNode';
import { TagNode } from '../../model/node/ResourceNode';
import { labelizeOption } from '../../util/LabelHelper';

export const DimensionType: Model = DefaultedModel(
  {
    ambient_light: FloatNode(),
    has_skylight: BoolNode(),
    min_y: IntNode({ min: -2032, max: 2031, step: 16 }),
    height: IntNode({ min: 16, max: 4064, step: 16 }),
    logical_height: IntNode({ min: 0, max: 4064 }),
    effects: EnumNode(
      ['overworld', 'the_nether', 'the_end'] as const,
      'overworld',
      true
    ),
    fixed_time: Opt(LongNode()),
    ultrawarm: BoolNode(),
    natural: BoolNode(),
    piglin_safe: BoolNode(),
    respawn_anchor_works: BoolNode(),
    bed_works: BoolNode(),
    has_raids: BoolNode(),
    has_ceiling: BoolNode(),
    coordinate_scale: FloatNode({ min: 0.00001, max: 30000000 }),
    infiniburn: TagNode('block')
  },
  () => ({
    ambient_light: 0,
    infiniburn: 'minecraft:infiniburn_overworld',
    respawn_anchor_works: false,
    has_raids: true,
    min_y: 0,
    height: 256,
    logical_height: 256,
    natural: true,
    coordinate_scale: 1,
    piglin_safe: false,
    bed_works: true,
    has_skylight: true,
    has_ceiling: false,
    ultrawarm: false
  })
);

export const DimensionTypes: Option[] = [
  'overworld',
  'overworld_caves',
  'the_nether',
  'the_end'
].map(labelizeOption);

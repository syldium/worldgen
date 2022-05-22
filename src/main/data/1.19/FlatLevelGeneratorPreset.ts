import { Model } from '../../model/Model';
import { BoolNode } from '../../model/node/BoolNode';
import { IntNode } from '../../model/node/IntNode';
import { ListNode } from '../../model/node/ListNode';
import { Obj, Opt } from '../../model/node/ObjectNode';
import { IdentifierNode, TagNode } from '../../model/node/ResourceNode';

const FlatBlockLayer = Obj({
  block: IdentifierNode('block'),
  height: IntNode({ min: 0, max: 4064 })
});

export const FlatLevelGeneratorPreset: Model = {
  node: Obj({
    //display: IdentifierNode('item'), // TODO
    settings: Obj({
      structure_overrides: TagNode('worldgen/structure_set'),
      layers: ListNode(FlatBlockLayer),
      features: BoolNode(false),
      lakes: BoolNode(false),
      biome: Opt(IdentifierNode('worldgen/biome'))
    })
  }),
  preset: () => ({
    display: 'minecraft:redstone',
    settings: {
      lakes: false,
      features: false,
      biome: 'minecraft:desert',
      structure_overrides: [],
      layers: [
        {
          height: 1,
          block: 'minecraft:bedrock'
        },
        {
          height: 3,
          block: 'minecraft:stone'
        },
        {
          height: 116,
          block: 'minecraft:sandstone'
        }
      ]
    }
  })
};

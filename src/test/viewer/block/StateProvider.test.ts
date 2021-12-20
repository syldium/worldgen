import { IntProvider } from '../../../main/data/1.17/NumberProvider';
import { EitherNodeParams } from '../../../main/model/node/EitherNode';
import { NumberNodeParams } from '../../../main/model/node/IntNode';
import {
  findBlockTypes,
  findIntProviderFromProperties
} from '../../../main/viewer/block/StateProvider';

describe('StateProvider', function () {
  it('should find a block type', () => {
    expect(
      findBlockTypes({
        state: {
          Name: 'rotatable'
        },
        type: 'minecraft:rotated_block_provider'
      })
    ).toEqual(['rotatable']);
  });

  it('should find multiple block types', () => {
    expect(
      findBlockTypes({
        entries: [
          {
            data: {
              Name: 'another'
            },
            weight: 3
          },
          {
            data: {
              Name: 'test'
            },
            weight: 1
          }
        ],
        type: 'weighted_state_provider'
      })
    ).toEqual(['another', 'test']);
  });

  it('should find one common int property', () => {
    const intProperty = {
      int: ['2', '3', '4', '5']
    };
    const int2Property = {
      int2: ['0', '1']
    };
    const stringProperty = {
      string: ['a', 'b', 'c']
    };
    const providers = findIntProviderFromProperties(
      ['test:testing', 'test:something', 'test:now'],
      {
        'test:testing': {
          properties: { ...stringProperty, ...intProperty },
          default: {}
        },
        'test:something': {
          properties: { ...intProperty },
          default: {}
        },
        'test:now': {
          properties: { ...int2Property, ...intProperty },
          default: {}
        }
      }
    );
    expect(Object.keys(providers)).toEqual(['int']);
    for (const key of Object.keys(IntProvider(2, 5))) {
      expect(providers.int).toHaveProperty(key);
    }
    const valueNode = (providers.int as EitherNodeParams)
      .nodes[0] as NumberNodeParams;
    expect(valueNode.min).toBe(2);
    expect(valueNode.max).toBe(5);
  });
});

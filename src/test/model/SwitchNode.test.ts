import { BoolNode } from '../../main/model/node/BoolNode';
import { IntNode } from '../../main/model/node/IntNode';
import { Obj } from '../../main/model/node/ObjectNode';
import { SwitchNode } from '../../main/model/node/SwitchNode';
import { validate } from './NodeTest';

describe('SwitchNode', function () {
  it('should test if the type is valid', () => {
    const node = SwitchNode({
      one: Obj({
        number: IntNode()
      }),
      two: Obj({
        bool: BoolNode()
      })
    });
    expect(
      validate(node, {
        config: {
          number: 20
        },
        type: 'one'
      })
    ).toBeTruthy();
    expect(validate(node, {
      value: 'something'
    })).toEqual([
      { path: '', error: 'Expected a type field' }
    ]);
    expect(validate(node, {
      number: 5,
      type: 'one'
    })).toEqual([
      { path: '', error: 'Expected a config block' }
    ]);
    expect(validate(node, {
      config: {
        number: 20
      },
      type: '1'
    })).toEqual([
      { path: '.type', error: 'Unexpected type' }
    ]);
  });
});

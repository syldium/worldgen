import { BoolNode } from '../../main/model/node/BoolNode';
import { IntNode } from '../../main/model/node/IntNode';
import { SwitchNode } from '../../main/model/node/SwitchNode';

describe('SwitchNode', function () {
  it('should test if the type is valid', () => {
    const node = SwitchNode({
      one: {
        number: IntNode()
      },
      two: {
        bool: BoolNode()
      }
    });
    expect(
      node.isValid({
        config: {
          number: 20
        },
        type: 'one'
      })
    ).toBeTruthy();
    expect(
      node.isValid({
        config: {
          number: 20
        },
        type: '1'
      })
    ).toBeFalsy();
  });
});

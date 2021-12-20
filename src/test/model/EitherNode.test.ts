import { BoolNode } from '../../main/model/node/BoolNode';
import { EitherNode } from '../../main/model/node/EitherNode';
import { IntNode } from '../../main/model/node/IntNode';
import { ObjectNode } from '../../main/model/node/ObjectNode';

describe('EitherNode', function () {
  it('should find the correct currently used node', () => {
    const int = IntNode();
    const bool = BoolNode();
    const either = EitherNode(int, bool);
    expect(either.findCurrentIndex('str')).toBe(-1);
    expect(either.findCurrentIndex(5)).toBe(0);
    expect(either.findCurrentIndex(false)).toBe(1);
  });

  it('should handle primitive and object type', () => {
    const int = IntNode();
    const either = EitherNode(int, {
      min: int,
      max: int
    });
    expect(either.findCurrentIndex(7)).toBe(0);
    expect(
      either.findCurrentIndex({
        min: 1,
        max: 4
      })
    ).toBe(1);
    expect(
      either.findCurrentIndex({
        max: 3
      })
    ).toBe(-1);
  });

  it('should handle objects', () => {
    const bool = BoolNode();
    const either = EitherNode(
      ObjectNode({
        a: bool
      }),
      ObjectNode({
        b: bool
      }),
      ObjectNode({
        c: bool
      })
    );
    expect(
      either.findCurrentIndex({
        a: true
      })
    ).toBe(0);
    expect(
      either.findCurrentIndex({
        b: false
      })
    ).toBe(1);
  });
});

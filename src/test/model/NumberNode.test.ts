import { IntNode } from '../../main/model/node/IntNode';

describe('NumberNode', function () {
  it('should accept any integer', () => {
    const { isValid } = IntNode();
    for (const n of [-1, 0, 4, 5.0]) {
      expect(isValid(n)).toBeTruthy();
    }
    for (const invalid of [3.2, undefined, null, '1', { n: 4 }, false, true]) {
      expect(isValid(invalid)).toBeFalsy();
    }
  });

  it('should check if the value is in the range', () => {
    const { isValid } = IntNode({ min: 6, max: 8 });
    expect(isValid(5)).toBeFalsy();
    expect(isValid(6)).toBeTruthy();
    expect(isValid(7)).toBeTruthy();
    expect(isValid(8)).toBeTruthy();
    expect(isValid(9)).toBeFalsy();
  });

  it('should accept an empty value if a default one is provided', () => {
    const { isValid } = IntNode({ default: -1 });
    expect(isValid(null)).toBeTruthy();
    expect(isValid(undefined)).toBeTruthy();
  });
});

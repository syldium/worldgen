import { FloatNode } from '../../main/model/node/FloatNode';
import { IntNode } from '../../main/model/node/IntNode';
import type { PathError } from '../../main/model/node/Node';
import { validate } from './NodeTest';

const expectedInt: ReadonlyArray<PathError> = [{
  path: '',
  error: 'Expected an integer'
}];

const expectedFloat: ReadonlyArray<PathError> = [{
  path: '',
  error: 'Expected a floating point number'
}];

describe('NumberNode', function () {
  it('should accept any integer', () => {
    const node = IntNode();
    for (const n of [-1, 0, 4, 5.0]) {
      expect(validate(node, n)).toBeTruthy();
    }
    for (const invalid of [3.2, undefined, null, '1', { n: 4 }, false, true]) {
      expect(validate(node, invalid)).toEqual(expectedInt);
    }
  });

  it('should accept any floating point number', () => {
    const node = FloatNode();
    for (const n of [-7, -2.9, 0, 1.1, 8]) {
      expect(validate(node, n)).toBeTruthy();
    }
    for (const invalid of [undefined, null, '1', { x: 4 }, false, true]) {
      expect(validate(node, invalid)).toEqual(expectedFloat);
    }
  });

  it('should check if the value is in the range', () => {
    const node = IntNode({ min: 6, max: 8 });
    expect(validate(node, 5)).toEqual(expectedInt);
    expect(validate(node, 6)).toBeTruthy();
    expect(validate(node, 7)).toBeTruthy();
    expect(validate(node, 8)).toBeTruthy();
    expect(validate(node, 9)).toEqual(expectedInt);
  });

  it('should accept an empty value if a default one is provided', () => {
    const node = IntNode({ default: -1 });
    expect(validate(node, null)).toBeTruthy();
    expect(validate(node, undefined)).toBeTruthy();
  });
});

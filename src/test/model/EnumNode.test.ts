import { EnumNode } from '../../main/model/node/EnumNode';
import type { PathError } from '../../main/model/node/Node';
import { labelize } from '../../main/util/LabelHelper';
import { validate } from './NodeTest';

const values = ['a', 'b', 'c'] as const;
const expectedEnum: ReadonlyArray<PathError> = [{
  path: '',
  error: 'Expected an enum value'
}];

describe('EnumNode', function () {
  it('should only validate valid options', () => {
    const node = EnumNode(values, 'b');
    expect(node.values).toEqual(
      values.map(value => ({ label: labelize(value), value }))
    );
    for (const val of values) {
      expect(validate(node, val)).toBeTruthy();
    }
    expect(validate(node, undefined)).toBeTruthy();
    expect(validate(node, 'd')).toEqual(expectedEnum);
    expect(validate(node, { value: 'a' })).toEqual(expectedEnum);
  });
});

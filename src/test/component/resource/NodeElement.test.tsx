import { fireEvent, render } from '@testing-library/react';
import { createElement } from 'react';
import { vitest } from 'vitest';
import { NodeElement, ObjectKey } from '../../../main/component/NodeElement';
import { BoolNode } from '../../../main/model/node/BoolNode';
import { EnumNode } from '../../../main/model/node/EnumNode';
import { ColorNode, IntNode } from '../../../main/model/node/IntNode';
import type { ModelNode } from '../../../main/model/node/Node';
import { Obj } from '../../../main/model/node/ObjectNode';
import { StringNode } from '../../../main/model/node/StringNode';
import { SwitchNode } from '../../../main/model/node/SwitchNode';
import { hexColorToInteger } from '../../../main/util/ColorHelper';

const name = 'config';
const expectedLabel = 'Config';

const NodeEl = (
  node: ModelNode,
  value: unknown,
  onChange: (name: ObjectKey, value: unknown) => void
) => createElement(NodeElement, { name, node, value, onChange });

function expectSelect(select: HTMLElement): HTMLOptionElement[] {
  return Array.from(select.children) as HTMLOptionElement[];
}

describe('NodeElement', function () {
  it('should render a bool node', () => {
    const node = BoolNode(true);
    const changeCallback = vitest.fn();
    const { rerender, getByLabelText } = render(
      NodeEl(node, false, changeCallback)
    );
    const checkbox = getByLabelText(expectedLabel);
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(changeCallback).toHaveBeenCalledWith(name, true);

    rerender(NodeEl(node, undefined, changeCallback));
    getByLabelText(expectedLabel);
    expect(checkbox).toBeChecked();
  });

  it('should render an int node', () => {
    const node = IntNode({ min: 5, max: 10, default: 6 });
    const changeCallback = vitest.fn();
    const { rerender, getByLabelText } = render(
      NodeEl(node, undefined, changeCallback)
    );
    const input = getByLabelText(expectedLabel);
    expect(input).toHaveValue(6);
    expect(input).toHaveProperty('min', '5');
    expect(input).toHaveProperty('max', '10');

    fireEvent.change(input, { target: { value: '9' } });
    expect(changeCallback).toHaveBeenCalledWith(name, 9);

    rerender(NodeEl(node, 5, changeCallback));
    expect(input).toHaveValue(5);

    rerender(NodeEl(node, 'invalid type', changeCallback));
    expect(input).toHaveValue(6);
  });

  it('should render an object', () => {
    const node = Obj({
      color: ColorNode(),
      modifier: EnumNode(['none', 'some'], 'some')
    });
    const changeCallback = vitest.fn();
    const { rerender, getByLabelText } = render(
      NodeEl(node, undefined, changeCallback)
    );
    const colorInput = getByLabelText('Color');
    const modifierOptions = expectSelect(getByLabelText('Modifier'));
    expect(colorInput).toHaveValue('#000000');
    expect(modifierOptions).toHaveLength(2);
    expect(modifierOptions[0].selected).toBeFalsy();
    expect(modifierOptions[1].selected).toBeTruthy();

    rerender(NodeEl(node, {
      color: hexColorToInteger('#102030'),
      modifier: 'none'
    }, changeCallback));
    expect(colorInput).toHaveValue('#102030');
    expect(modifierOptions[0].selected).toBeTruthy();
    expect(modifierOptions[1].selected).toBeFalsy();

    fireEvent.change(colorInput, { target: { value: '#FFFFFF' } });
    expect(changeCallback).toHaveBeenCalledWith(name, {
      color: hexColorToInteger('#FFFFFF'),
      modifier: 'none'
    });
  });

  it('should render a switch', () => {
    const node = SwitchNode({
      concrete: StringNode('example text'),
      abstract: BoolNode()
    });
    const changeCallback = vitest.fn();
    const { rerender, getByLabelText, getByText, getByTestId } = render(
      NodeEl(node, undefined, changeCallback)
    );
    expect(getByText('No type selected!')).toBeInTheDocument();

    rerender(
      NodeEl(node, { type: 'minecraft:abstract', config: true }, changeCallback)
    );
    const checkbox = getByLabelText('Config');
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(changeCallback).toHaveBeenCalledWith(name, {
      config: false,
      type: 'minecraft:abstract'
    });

    fireEvent.change(getByTestId(name), {
      target: { value: 'minecraft:concrete' }
    });
    expect(changeCallback).toHaveBeenCalledWith(name, {
      config: 'example text',
      type: 'minecraft:concrete'
    });

    rerender(NodeEl(node, { type: 'concrete' }, changeCallback));
    expect(getByLabelText('Config')).toHaveValue('example text');
  });
});

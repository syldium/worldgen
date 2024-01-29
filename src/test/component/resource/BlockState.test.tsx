import { fireEvent, render } from '@testing-library/react';
import { vitest } from 'vitest';
import { BlockState } from '../../../main/component/resource/BlockState';
import { GameRegistryProvider } from '../../../main/context/GameRegistry';
import {
  BlockStateRegistry,
  DEFAULT_BLOCK_STATE
} from '../../../main/model/Registry';

const BLOCKS_STATES: BlockStateRegistry = {
  'minecraft:air': DEFAULT_BLOCK_STATE,
  'custom:block': DEFAULT_BLOCK_STATE,
  'mod:double_block': {
    properties: {
      face: ['0', '1'],
      type: ['a', 'b', 'c']
    },
    default: {
      face: '0',
      type: 'b'
    }
  }
};

describe('block state form', function () {
  it('should have a block type list', () => {
    const changeCallback = vitest.fn();
    const { container, getByTestId } = render(
      <form data-testid="form">
        <GameRegistryProvider states={BLOCKS_STATES}>
          <BlockState
            name="block"
            inputId="block"
            value={{ Name: 'air' }}
            onChange={changeCallback}
          />
        </GameRegistryProvider>
      </form>
    );

    expect(getByTestId('form')).toHaveFormValues({ block: 'minecraft:air' });
    fireEvent.change(container.querySelector('#block') as HTMLSelectElement, {
      target: { value: 'mod:double_block' }
    });
    expect(changeCallback).toHaveBeenCalledWith('block', {
      Name: 'mod:double_block',
      Properties: {
        face: '0',
        type: 'b'
      }
    });
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { BlockState } from '../../../main/component/resource/BlockState';
import { GameContext } from '../../../main/context/GameRegistry';
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
  it('should have a block type list', async () => {
    const changeCallback = jest.fn();
    const { container, getByTestId } = render(
      <form data-testid="form">
        <GameContext.Provider value={{ blockStates: BLOCKS_STATES }}>
          <BlockState
            name="block"
            inputId="block"
            value={{ Name: 'air' }}
            onChange={changeCallback}
          />
        </GameContext.Provider>
      </form>
    );

    expect(getByTestId('form')).toHaveFormValues({ block: 'minecraft:air' });
    await selectEvent.select(
      container.querySelector('#block') as HTMLInputElement,
      'Mod: Double block'
    );
    expect(changeCallback).toHaveBeenCalledWith({
      block: {
        Name: 'mod:double_block',
        Properties: {
          face: '0',
          type: 'b'
        }
      }
    });
  });
});

import React, { useCallback, useContext, useMemo } from 'react';
import { BlockState, BlockStateValue } from './BlockState';
import { BlockStateRegistry } from '../../model/Registry';
import { useOptionsArray } from '../../hook/useOptions';
import Select, { Option } from '../ui/Select';
import { ValueType } from 'react-select';
import { labelizeOption, stripDefaultNamespace } from '../../util/LabelHelper';
import { GameContext } from '../../context/GameRegistry';
import { useCrudProps } from '../../hook/useCrud';
import { Obj } from '../../util/DomHelper';
import { Button } from '../ui/Button';

export interface StateProvider {
  type: string;
  state?: BlockStateValue;
  entries?: readonly WeightedEntry[];
}
const providers = [
  'forest_flower_provider',
  'plain_flower_provider',
  'simple_state_provider',
  'rotated_block_provider',
  'weighted_state_provider'
];
interface BlockStateProviderProps {
  name: string;
  value?: StateProvider;
  filter?: (option: string) => boolean;
  blocks?: BlockStateRegistry;
  onChange: (provider: Record<string, StateProvider>) => void;
}
export function BlockStateProvider({
  name,
  filter,
  blocks,
  value = {
    type: 'simple_state_provider',
    state: { Name: 'minecraft:stone', Properties: {} }
  },
  onChange
}: BlockStateProviderProps): JSX.Element {
  const options = useOptionsArray(providers, filter);

  const handleTypeChange = useCallback(
    function (option: ValueType<Option, false>) {
      if (option) {
        onChange({ [name]: { ...value, type: option.value } });
      }
    },
    [onChange, name, value]
  );

  const handleSimpleStateChange = useCallback(
    function (state: Record<string, BlockStateValue>) {
      onChange({ [name]: { ...value, ...state } });
    },
    [onChange, name, value]
  );

  const handleWeightedStateChange = useCallback(
    function (entries: readonly WeightedEntry[]) {
      onChange({ [name]: { ...value, entries } });
    },
    [onChange, name, value]
  );

  const providerType = value?.type
    ? stripDefaultNamespace(value.type)
    : 'simple_state_provider';

  const defaultBlocks = useContext(GameContext).blockStates;
  blocks = (blocks || defaultBlocks) as BlockStateRegistry;
  const filteredBlocks = useMemo(
    function () {
      let filtered = blocks as BlockStateRegistry;
      if (providerType === 'rotated_block_provider') {
        filtered = Object.entries(filtered)
          .filter(([, value]) =>
            Object.keys(value.properties).some(
              (property) => property === 'axis'
            )
          )
          .reduce((obj, [block]) => {
            obj[block] = filtered[block];
            return obj;
          }, {} as BlockStateRegistry);
      }
      return Object.keys(filtered).map(labelizeOption);
    },
    [blocks, providerType]
  );

  return (
    <div>
      <label>Provider type</label>
      <Select
        options={options}
        value={options.find((o) => o.value === value.type)}
        onChange={handleTypeChange}
      />
      {(providerType === 'simple_state_provider' ||
        providerType === 'rotated_block_provider') && (
        <BlockState
          name="state"
          value={value.state}
          options={filteredBlocks}
          onChange={handleSimpleStateChange}
        />
      )}
      {providerType === 'weighted_state_provider' && (
        <WeightedStateProvider
          entries={value.entries}
          options={filteredBlocks}
          onChange={handleWeightedStateChange}
        />
      )}
    </div>
  );
}

interface WeightedEntry {
  weight?: number;
  data: BlockStateValue;
}
interface WeightedStateProviderProps {
  entries?: readonly WeightedEntry[];
  options: Option[];
  onChange: (entries: readonly WeightedEntry[]) => void;
}
function WeightedStateProvider({
  entries = [],
  options,
  onChange
}: WeightedStateProviderProps) {
  const { elements, create, update, remove } = useCrudProps<
    WeightedEntry & Obj
  >(onChange, entries as (Obj & WeightedEntry)[], function (blocks) {
    // Get the first non taken block name
    return {
      data: {
        Name: (
          options.find((o) => !blocks.some((b) => b.data.Name === o.value)) || {
            value: 'minecraft:stone'
          }
        ).value,
        Properties: {}
      }
    };
  });

  return (
    <div className="form-group">
      {elements.map((block, i) => {
        const filteredOptions = options.filter(
          (o) =>
            o.value === block.data.Name ||
            !elements.some((d) => d.data.Name === o.value)
        );
        return (
          <BlockState
            name={i.toString()}
            value={block.data}
            options={filteredOptions}
            key={block.__reactKey}
            onChange={(state) => {
              update({ ...block, data: state[i] }, i);
            }}
          >
            Weight:{' '}
            <input
              type="number"
              value={typeof block.weight === 'number' ? block.weight : 1}
              min="1"
              onChange={(event) => {
                update({ ...block, weight: parseInt(event.target.value) }, i);
              }}
              className="mlm"
            />
            <Button cat="danger" className="mlm" onClick={(e) => remove(i, e)}>
              Remove
            </Button>
          </BlockState>
        );
      })}
      <Button onClick={create}>Add block</Button>
    </div>
  );
}

import { useCallback, useContext, useMemo } from 'react';
import { BlockState, BlockStateValue } from './BlockState';
import { BlockStateRegistry, DEFAULT_BLOCK_STATE } from '../../model/Registry';
import { useOptionsArray } from '../../hook/useOptions';
import Select, { Option } from '../ui/Select';
import { ValueType } from 'react-select';
import {
  labelize,
  labelizeOption,
  stripDefaultNamespace
} from '../../util/LabelHelper';
import { GameContext } from '../../context/GameRegistry';
import { useCrudProps } from '../../hook/useCrud';
import { Obj } from '../../util/DomHelper';
import { Button } from '../ui/Button';
import { ModelView, NodeElement } from '../NodeElement';
import { IntProvider } from '../../data/1.17/NumberProvider';
import {
  findBlockTypes,
  findIntProviderFromProperties,
  RandomizedIntStateProvider,
  WeightedStateEntry
} from '../../viewer/block/StateProvider';
import { Typed } from '../../model/node/SwitchNode';
import {
  SeededBlockStateProviderPresets,
  SeededBlockStateProviders
} from '../../data/1.18/BlockStateProvider';

export interface StateProvider {
  type: string;
  state?: BlockStateValue;
  entries?: readonly WeightedStateEntry[];
}
const providers1_16 = [
  'forest_flower_provider',
  'plain_flower_provider',
  'simple_state_provider',
  'rotated_block_provider',
  'weighted_state_provider'
];
const providers1_17 = providers1_16.concat('randomized_int_state_provider');
const providers1_18 = [
  'dual_noise_2d_provider',
  'noise_2d_cutoff_provider',
  'noise_2d_provider',
  'randomized_int_state_provider',
  'rotated_block_provider',
  'simple_state_provider',
  'weighted_state_provider'
];

interface BlockStateProviderProps {
  name: string;
  value?: StateProvider;
  blocks?: BlockStateRegistry;
  blockPlacerType?: string;
  onChange: (provider: Record<string, StateProvider>) => void;
}
export function BlockStateProvider({
  name,
  blocks,
  //blockPlacerType = 'simple_block_placer',
  value = {
    type: 'simple_state_provider',
    state: { Name: 'minecraft:stone' }
  },
  onChange
}: BlockStateProviderProps): JSX.Element {
  const context = useContext(GameContext);
  const format = context.worldgen.packFormat;
  const options = useOptionsArray(
    format === 8 ? providers1_18 : format === 7 ? providers1_17 : providers1_16
  );

  const handleTypeChange = useCallback(
    function (option: ValueType<Option, false>) {
      if (option) {
        const type = stripDefaultNamespace(option.value);
        const common = ['simple_state_provider', 'rotated_block_provider'];
        let val: StateProvider;
        if (common.includes(value.type) && common.includes(type)) {
          val = { ...value, type: option.value };
        } else if (SeededBlockStateProviderPresets[type]) {
          val = {
            ...SeededBlockStateProviderPresets[type]
          } as unknown as StateProvider;
        } else {
          val = { type: option.value };
        }
        onChange({ [name]: val });
      }
    },
    [onChange, name, value]
  );

  const handleSimpleStateChange = useCallback(
    (state: Record<string, BlockStateValue>) =>
      onChange({ [name]: { ...value, ...state } }),
    [onChange, name, value]
  );

  const handleWeightedStateChange = useCallback(
    (entries: readonly WeightedStateEntry[]) =>
      onChange({ [name]: { ...value, entries } }),
    [onChange, name, value]
  );

  const providerType = value?.type
    ? stripDefaultNamespace(value.type)
    : 'simple_state_provider';
  const node = SeededBlockStateProviders[providerType];

  const defaultBlocks = context.blockStates;
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
    <fieldset>
      <legend>{labelize(name)}</legend>
      <label>Provider type</label>
      <Select
        options={options}
        value={options.find((o) => o.value === value.type) || null}
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
        <WeightedProvider
          entries={value.entries}
          options={filteredBlocks}
          onChange={handleWeightedStateChange}
          registry={blocks}
        />
      )}
      {providerType === 'randomized_int_state_provider' && (
        <RandomizedIntProvider
          name={name}
          onChange={onChange}
          registry={blocks}
          value={value as RandomizedIntStateProvider & Typed}
        />
      )}
      {node && (
        <ModelView
          name={name}
          model={node}
          // @ts-ignore
          value={value}
          // @ts-ignore
          onChange={onChange}
        />
      )}
    </fieldset>
  );
}

interface WeightedProviderProps {
  entries?: readonly WeightedStateEntry[];
  onChange: (entries: readonly WeightedStateEntry[]) => void;
  options: Option[];
  registry: BlockStateRegistry;
}
function WeightedProvider({
  entries = [],
  onChange,
  options,
  registry
}: WeightedProviderProps) {
  const { elements, create, update, remove } = useCrudProps<
    WeightedStateEntry & Obj
  >(onChange, entries as (Obj & WeightedStateEntry)[], function (blocks) {
    // Get the first non taken block name
    const Name = (
      options.find((o) => !blocks.some((b) => b.data.Name === o.value)) || {
        value: 'minecraft:stone'
      }
    ).value;
    const Properties = (registry[Name] || DEFAULT_BLOCK_STATE).default;
    const data: BlockStateValue = Object.keys(Properties).length
      ? { Name, Properties }
      : { Name };
    return { data, weight: 1 };
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
            <div className="mls">
              Weight:{' '}
              <input
                type="number"
                value={block.weight}
                min={0}
                size={3}
                onChange={(event) => {
                  update({ ...block, weight: parseInt(event.target.value) }, i);
                }}
              />
            </div>
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

interface RandomizedIntProviderProps {
  name: string;
  onChange: (provider: Record<string, StateProvider>) => void;
  registry: BlockStateRegistry;
  value: RandomizedIntStateProvider & Typed;
}
function RandomizedIntProvider({
  name,
  registry,
  value,
  onChange
}: RandomizedIntProviderProps) {
  const handleSourceChange = useCallback(
    (source: Record<string, StateProvider>) =>
      onChange({ [name]: { ...value, ...source } }),
    [name, onChange, value]
  );
  const handleValuesChange = useCallback(
    (values: Record<string, unknown>) =>
      onChange({ [name]: { ...value, ...values } }),
    [name, onChange, value]
  );
  const handlePropertyChange = useCallback(
    (option) =>
      onChange({
        [name]: { ...value, property: option.value } as StateProvider
      }),
    [name, onChange, value]
  );
  const properties = useMemo(
    function () {
      try {
        return value.source
          ? findIntProviderFromProperties(
              findBlockTypes(value.source),
              registry
            )
          : {};
      } catch (e) {
        return {};
      }
    },
    [registry, value.source]
  );
  const intProvider = useMemo(
    () => properties[value.property] || IntProvider(),
    [properties, value.property]
  );
  const options = useOptionsArray(Object.keys(properties), false);

  return (
    <>
      <BlockStateProvider
        name="source"
        value={value.source}
        onChange={handleSourceChange}
      />
      <div className="form-row">
        <div className="flex">
          <NodeElement
            name="values"
            node={intProvider}
            value={value as unknown as Obj}
            onChange={handleValuesChange}
            isObject={true}
          />
        </div>
        <div style={{ width: '150px' }}>
          Property:{' '}
          <Select
            options={options}
            value={options.find((o) => o.value === value.property) || null}
            onChange={handlePropertyChange}
          />
        </div>
      </div>
    </>
  );
}

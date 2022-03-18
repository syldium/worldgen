import type {
  ChangeEvent,
  FunctionComponent,
  MouseEvent,
  ReactElement,
  ReactNode
} from 'react';
import { createElement, useCallback, useContext, useMemo } from 'react';
import type { OnChangeValue } from 'react-select/dist/declarations/src/types';
import { GameContext } from '../context/GameRegistry';
import { DataType } from '../hook/useCrud';
import { useId } from '../hook/useId';
import { useOptions } from '../hook/useOptions';
import { useToggle } from '../hook/useToggle';
import { useValue } from '../hook/useValue';
import { mayInline } from '../model/Model';
import type { BoolNodeParams } from '../model/node/BoolNode';
import type { EitherNodeParams } from '../model/node/EitherNode';
import type { EnumNodeParams } from '../model/node/EnumNode';
import type { ColorNodeParams, NumberNodeParams } from '../model/node/IntNode';
import type { ListNodeParams } from '../model/node/ListNode';
import { MapNodeParams } from '../model/node/MapNode';
import type { ModelNode } from '../model/node/Node';
import { providePreset } from '../model/node/Node';
import type {
  ObjectNodeParams,
  OptionalNodeParams
} from '../model/node/ObjectNode';
import { Empty } from '../model/node/ObjectNode';
import type { IdentifierNodeParams } from '../model/node/ResourceNode';
import type { StringNodeParams } from '../model/node/StringNode';
import type { SwitchNodeParams } from '../model/node/SwitchNode';
import type { RegistryKey, WorldgenRegistryKey } from '../model/RegistryKey';
import { hexColorToInteger, intColorToHex } from '../util/ColorHelper';
import type { Obj } from '../util/DomHelper';
import {
  defaultNamespace,
  isStringArray,
  labelize,
  labelizeOption,
  stripDefaultNamespace
} from '../util/LabelHelper';
import { addTagHash, removeTagHash } from '../util/PathHelper';
import { BlockState, BlockStateValue } from './resource/BlockState';
import {
  BlockStateProvider,
  StateProvider
} from './resource/BlockStateProvider';
import { ParticuleEffect } from './resource/ParticuleEffect';
import { Button } from './ui/Button';
import { FieldsetLegend } from './ui/FieldsetLegend';
import { Labelized } from './ui/Labelized';
import { NumberInput as NumberInputWrapper } from './ui/NumberInput';
import { Option, Select } from './ui/Select';
import { ViewerElement } from './viewer/Viewers';

export type ObjectKey = string | number;
interface NodeProps<
  T extends ModelNode,
  N extends ObjectKey = ObjectKey
> {
  name: N;
  node: T;
  value: unknown;
  onChange: (name: N, value: unknown) => void;
  noFieldset?: boolean;
  children?: ReactNode;
}
export function NodeElement(props: NodeProps<ModelNode>): JSX.Element {
  switch (props.node.type) {
    case 'bool':
      return createElement(CheckboxInput, props as NodeProps<BoolNodeParams>);
    case 'color':
      return createElement(ColorInput, props as NodeProps<ColorNodeParams>);
    case 'either':
      return createElement(EitherInput, props as NodeProps<EitherNodeParams>);
    case 'enum':
      return createElement(SelectEnum, props as NodeProps<EnumNodeParams>);
    case 'identifier':
      return createElement(
        IdentifierInput,
        props as NodeProps<IdentifierNodeParams>
      );
    case 'float':
    case 'int':
      return createElement(NumberInput, props as NodeProps<NumberNodeParams>);
    case 'list':
      return createElement(ListInput, props as NodeProps<ListNodeParams>);
    case 'map':
      return createElement(MapInput, props as NodeProps<MapNodeParams>);
    case 'object':
      return createElement(ObjectInput, props as NodeProps<ObjectNodeParams>);
    case 'optional':
      return createElement(
        OptionalInput,
        props as NodeProps<OptionalNodeParams>
      );
    case 'resource':
      return createElement(
        ResourceInput,
        props as NodeProps<IdentifierNodeParams>
      );
    case 'string':
      return createElement(StringInput, props as NodeProps<StringNodeParams>);
    case 'switch':
      return createElement(SwitchInput, props as NodeProps<SwitchNodeParams>);
    case 'tag':
      return createElement(TagInput, props as NodeProps<IdentifierNodeParams>);
  }
  console.warn("Unknown node for '" + props.name + "'!", props.node);
  return (
    <p>
      Unknown <code>{(props.node as ModelNode).type}</code> node for{' '}
      <code>{props.name}</code>!
    </p>
  );
}

interface ResourceViewProps<T extends ModelNode> {
  model: T;
  name: WorldgenRegistryKey;
  value: unknown;
  onChange: (value: unknown) => void;
}
export function ResourceView<T extends ModelNode>(
  { model, name, value, onChange }: ResourceViewProps<T>
) {
  const handleChange = useCallback(
    (_: ObjectKey, value: unknown) => onChange(value),
    [onChange]
  );
  const viewers = ViewerElement(name, Object(value));
  const node = (
    <NodeElement
      name={name}
      node={model}
      value={value}
      onChange={handleChange}
      noFieldset={true}
    />
  );
  if (viewers) {
    return (
      <div className="grid-2">
        <div>{node}</div>
        {viewers}
      </div>
    );
  }
  return node;
}

function EitherInput(
  { name, node, value, onChange, children }: NodeProps<EitherNodeParams>
): JSX.Element {
  const i = Math.max(node.findCurrentIndex(value), 0);
  return (
    <fieldset>
      <FieldsetLegend name={name}>{children}</FieldsetLegend>
      <NodeElement
        name={name}
        node={node.nodes[i]}
        value={value}
        onChange={onChange}
        noFieldset={true}
      />
    </fieldset>
  );
}

function ListInput(
  { name, node, value, onChange }: NodeProps<ListNodeParams>
): JSX.Element {
  const absent = value == null;
  if (
    (node.of.type === 'resource' || node.of.type === 'identifier') &&
    (absent || Array.isArray(value)) &&
    (absent || isStringArray(value as unknown[])) &&
    node.of.registry !== 'block_state' &&
    node.of.registry !== 'worldgen/placement_modifier'
  ) {
    return (
      <IdentifierMultipleInput
        name={name}
        node={node.of}
        value={value}
        onChange={onChange}
      />
    );
  }
  return (
    <CommonListInput
      name={name}
      node={node}
      value={value}
      onChange={onChange}
    />
  );
}

function CommonListInput(
  { name, node, value, onChange }: NodeProps<ListNodeParams>
): JSX.Element {
  const arrayValue = useValue(Array.isArray(value) ? value : []);
  const create = function (event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    onChange(name, [...arrayValue.current, providePreset(node.of)]);
  };
  const update = useCallback(
    (index: ObjectKey, value: unknown) =>
      onChange(
        name,
        arrayValue.current.map((element, i) => (i === index ? value : element))
      ),
    [arrayValue, name, onChange]
  );
  const remove = function (index: number, event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    onChange(name, arrayValue.current.filter((element, i) => i !== index));
  };
  const elements = arrayValue.current;
  const [visible, setVisible] = useToggle(
    elements.length < 3 || name === 'features'
  );
  const El: FunctionComponent<NodeProps<ModelNode>> = node.weighted ?
    WeightedElement :
    NodeElement;
  return (
    <div className="node-list">
      <div className="toggle-label">
        {typeof name === 'string' && labelize(name)}
        {' (' + elements.length + ')'}
        <div className="btn-group">
          {(node.fixed < 0 || node.fixed > elements.length) && (
            <Button onClick={create}>Add</Button>
          )}
          {elements.length > 0 && (
            <Button cat="secondary" onClick={setVisible}>
              {visible ?
                'Less' :
                'More'}...
            </Button>
          )}
        </div>
      </div>
      <div
        className={mayInline(node.of) ?
          ' form-row' :
          ''}
      >
        {visible &&
          elements.map((element, i) => (
            <El
              key={i}
              name={i}
              node={node.of}
              value={element}
              onChange={update}
            >
              <Button
                cat="danger"
                onClick={(e) => remove(i, e)}
              >
                Remove
              </Button>
            </El>
          ))}
      </div>
    </div>
  );
}

function WeightedElement(
  { name, node, value, onChange }: NodeProps<ModelNode>
) {
  const weightId = useId(name);
  const objValue = useValue(Object(value));
  const handleDataChange = useCallback(
    (_: ObjectKey, data: unknown) =>
      onChange(name, { ...objValue.current, data }),
    [name, objValue, onChange]
  );
  const handleWeightChange = useCallback(
    (weight: number) => onChange(name, { ...objValue.current, weight }),
    [name, objValue, onChange]
  );
  return (
    <NodeElement
      name="data"
      node={node}
      value={objValue.current.data}
      onChange={handleDataChange}
    >
      <label htmlFor={weightId}>Weight</label>:{' '}
      <div>
        <NumberInputWrapper
          id={weightId}
          min={0}
          size={3}
          value={objValue.current.weight}
          onChange={handleWeightChange}
        />
      </div>
    </NodeElement>
  );
}

function MapInput({ name, node, value, onChange }: NodeProps<MapNodeParams>) {
  const objValue = useValue(Object(value));
  const handleKeyChange = useCallback((oldKey: ObjectKey, newKey: unknown) => {
    const map = {};
    delete Object.assign(map, objValue.current, {
      [newKey as ObjectKey]: objValue.current[oldKey]
    })[oldKey];
    onChange(name, map);
  }, [name, objValue, onChange]);
  const handleValueChange = useCallback(
    (key: ObjectKey, value: unknown) =>
      onChange(name, { ...objValue.current, [key]: value }),
    [name, objValue, onChange]
  );
  return (
    <>
      {Object.entries(objValue.current).map(([key, val]) => {
        return (
          <fieldset key={key}>
            <legend>
              <NodeElement
                name={key}
                node={node.key}
                value={key}
                onChange={handleKeyChange}
              />
            </legend>
            <NodeElement
              name={key}
              node={node.value}
              value={val}
              onChange={handleValueChange}
            />
          </fieldset>
        );
      })}
    </>
  );
}

interface ObjectViewProps {
  obj: Record<string, ModelNode>;
  value: Record<string, unknown>;
  onChange: (name: ObjectKey, value: unknown) => void;
  children?: ReactNode;
}
function ObjectView({ obj, value, onChange, children }: ObjectViewProps) {
  const nodes: ReactElement[] = [];
  let inline: ReactElement[] = [];
  for (const [name, node] of Object.entries(obj)) {
    const isShort = mayInline(node);
    const el = (
      <NodeElement
        key={name}
        node={node}
        name={name}
        value={value[name]}
        onChange={onChange}
      >
        {!isShort && children}
      </NodeElement>
    );
    if (!isShort && children) {
      children = undefined;
    }
    if ((!isShort && inline.length) || inline.length > 3) {
      nodes.push(
        inline.length > 1 ?
          (
            <div className="form-row" key={inline[0]!.key}>
              {inline}
            </div>
          ) :
          (
            inline[0]
          )
      );
      inline = [];
    }
    if (isShort) {
      inline.push(el);
    } else {
      nodes.push(el);
    }
  }
  if (inline.length) {
    nodes.push(
      inline.length > 1 ?
        (
          <div className="form-row" key={inline[0]!.key}>
            {inline}
          </div>
        ) :
        (
          inline[0]
        )
    );
  }
  return <>{nodes}</>;
}

function ObjectInput(
  { name, node, value, onChange, children, noFieldset = false }: NodeProps<
    ObjectNodeParams
  >
): JSX.Element {
  const objValue = useValue(Object(value));
  const handleChange = useCallback(
    (childName: ObjectKey, childValue: unknown) =>
      onChange(name, { ...objValue.current, [childName]: childValue }),
    [name, objValue, onChange]
  );
  const view = (
    <ObjectView
      obj={node.records}
      value={objValue.current}
      onChange={handleChange}
    >
      {children}
    </ObjectView>
  );
  if (
    noFieldset || Array.isArray(value) || Object.keys(node.records).length === 1
  ) {
    return view;
  }
  return (
    <fieldset>
      <FieldsetLegend name={name} />
      <ObjectView
        obj={node.records}
        value={objValue.current}
        onChange={handleChange}
      >
        {children}
      </ObjectView>
    </fieldset>
  );
}

function OptionalInput({
  name,
  node,
  value,
  onChange
}: NodeProps<OptionalNodeParams>) {
  const id = useId(name.toString());
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(name, event.target.checked ? providePreset(node.node) : undefined);
  const isPresent = value != null;
  return (
    <div className={isPresent ? 'flex' : 'form-group flex'}>
      {!isPresent && (
        <div>
          <label htmlFor={id}>
            {typeof name === 'string' && labelize(name)}
          </label>:
        </div>
      )}
      {isPresent && (
        <NodeElement
          name={name}
          node={node.node}
          value={value}
          onChange={onChange}
        />
      )}
      <div className={isPresent ? 'form-group' : ''}>
        <input
          type="checkbox"
          className="checkbox"
          id={id}
          checked={isPresent}
          title={isPresent ? 'Remove the value' : 'Set a value'}
          onChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
}

interface SwitchInputProps extends NodeProps<SwitchNodeParams> {
  onTypeChange?: (type: string) => void;
}
export function SwitchInput(
  { name, node, value, onChange, onTypeChange }: SwitchInputProps
): JSX.Element {
  const objValue = useValue(
    Object(typeof value === 'object' ? value : node.default)
  );
  const type = stripDefaultNamespace(String(objValue.current[node.typeField]));
  const namespacedType = defaultNamespace(type);
  const model = node.values[type];
  const handleTypeChange = useCallback(
    function (c: OnChangeValue<Option, false>) {
      const strippedType = stripDefaultNamespace(c!.value);
      const completeType = defaultNamespace(c!.value);
      if (onTypeChange) {
        onTypeChange(strippedType);
      } else {
        let preset: DataType = node.preset[strippedType];
        if (!preset) {
          preset = providePreset(node.values[strippedType]);
        }
        if (node.config) {
          onChange(name, {
            [node.config]: preset,
            [node.typeField]: completeType
          });
        } else {
          onChange(name, {
            ...(preset as Obj),
            [node.typeField]: completeType
          });
        }
      }
    },
    [name, node, onChange, onTypeChange]
  );
  const handleConfigChange = useCallback(
    (_: ObjectKey, configValue: unknown) =>
      onChange(
        name,
        node.config ?
          {
            ...objValue.current,
            [node.config]: configValue
          } :
          { ...objValue.current, ...(configValue as Obj) }
      ),
    [name, node.config, objValue, onChange]
  );
  const options: Option[] = useMemo(
    () => Object.keys(node.values).map(labelizeOption),
    [node.values]
  );
  return (
    <fieldset>
      <legend>
        <Select
          options={options}
          testId={name.toString()}
          value={options.find(o => o.value === namespacedType) || null}
          onChange={handleTypeChange}
        />
      </legend>
      {model ?
        (
          <NodeElement
            name={name}
            node={model}
            value={node.config ?
              objValue.current[node.config] :
              objValue.current}
            onChange={handleConfigChange}
            noFieldset={true}
          />
        ) :
        (
          <p>
            No type selected!
          </p>
        )}
      {node.commonFields !== Empty && (
        <NodeElement
          name={name}
          node={node.commonFields}
          value={objValue.current}
          onChange={onChange}
          noFieldset={true}
        />
      )}
    </fieldset>
  );
}

function CheckboxInput(
  { name, node, value, onChange }: NodeProps<BoolNodeParams>
): JSX.Element {
  const id = useId(name);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(name, e.target.checked);
  const boolValue = typeof value === 'boolean' ? value : node.default || false;
  return (
    <Labelized className="form-group" id={id} name={name}>
      <input
        type="checkbox"
        className="checkbox"
        id={id}
        checked={boolValue}
        onChange={handleChange}
      />
    </Labelized>
  );
}

function ColorInput(
  { name, node, value, onChange }: NodeProps<ColorNodeParams>
): JSX.Element {
  const id = useId(name);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(name, hexColorToInteger(e.target.value));
  const intValue = typeof value === 'number' ? value : node.default || 0;
  return (
    <Labelized className="form-group" id={id} name={name}>
      <input
        id={id}
        type="color"
        value={intColorToHex(intValue)}
        onChange={handleChange}
      />
    </Labelized>
  );
}

interface IdentifierInputProps extends NodeProps<IdentifierNodeParams> {
  tag?: boolean;
}
function IdentifierInput(
  { name, node, value, onChange, children, tag = false }: IdentifierInputProps
): JSX.Element {
  const id = useId(name);
  const handleChange = useCallback(
    function (option: OnChangeValue<Option, false>): void {
      if (option?.value) {
        onChange(name, addTagHash(tag, option.value));
      }
    },
    [tag, name, onChange]
  );
  const strValue = typeof value === 'string' ?
    removeTagHash(value) :
    node.default;
  const options = useOptions(
    tag ? ('tags/' + node.registry) as RegistryKey : node.registry
  );
  const selected = useMemo(
    () => options.find((o) => o.value === strValue) || null,
    [options, strValue]
  );
  return (
    <Labelized className="form-group" id={id} name={name}>
      <div className="flex">
        <div className="full-width">
          <Select
            options={options}
            value={selected}
            onChange={handleChange}
            inputId={id}
          />
        </div>{' '}
        {children}
      </div>
    </Labelized>
  );
}

function IdentifierMultipleInput({
  name,
  node,
  value,
  onChange
}: NodeProps<IdentifierNodeParams>) {
  const id = useId(name);
  const options = useOptions(node.registry);
  const handleChange = useCallback(
    (options: OnChangeValue<Option, true>) =>
      onChange(
        name,
        options === null ? [] : options.map((option) => option.value)
      ),
    [name, onChange]
  );
  const values = Array.isArray(value) ?
    value.map((val) => defaultNamespace(val as string)) :
    [];
  const selected = options.filter((option) => values.includes(option.value));
  return (
    <Labelized id={id} name={name}>
      <Select
        options={options}
        value={selected}
        onChange={handleChange}
        inputId={id}
        isMulti={true}
      />
    </Labelized>
  );
}

function NumberInput(
  { name, node, value, onChange }: NodeProps<NumberNodeParams>
): JSX.Element {
  const id = useId(name);
  const handleChange = (value: number) => onChange(name, value);
  const numberValue = typeof value === 'number' ?
    value :
    node.default || 0;

  return (
    <Labelized className="form-group flex" id={id} name={name}>
      <NumberInputWrapper
        id={id}
        min={node.min}
        max={node.max}
        value={numberValue}
        step={node.step}
        onChange={handleChange}
      />
    </Labelized>
  );
}

function ResourceInput(
  { name, node, value, onChange, children }: NodeProps<IdentifierNodeParams>
): JSX.Element {
  const worldgen = useContext(GameContext).worldgen!;

  const handleChange = useCallback(
    (name: ObjectKey, newValue: unknown) => onChange(name, newValue),
    [onChange]
  );

  if (
    value !== null &&
    typeof value === 'object' &&
    worldgen.isRegistered(node.registry)
  ) {
    const model = worldgen.worldgen[node.registry].model.node;
    const el = (
      <NodeElement
        name={name}
        node={model}
        value={value}
        onChange={handleChange}
      />
    );
    const viewers = ViewerElement(
      node.registry,
      value as Record<string, unknown>
    );
    if (viewers !== null) {
      return (
        <div className="grid-2">
          {el}
          {viewers}
        </div>
      );
    }
    return el;
  } else if (node.registry === 'block_state') {
    return (
      <BlockState
        name={name}
        value={value as BlockStateValue}
        onChange={onChange}
      >
        {children}
      </BlockState>
    );
  } else if (node.registry === 'block_state_provider') {
    return (
      <BlockStateProvider
        name={name}
        value={value as StateProvider}
        onChange={onChange}
      />
    );
  } else if (node.registry === 'biome_particle') {
    return (
      <ParticuleEffect
        particle={value as Record<string, any>}
        onChange={onChange}
        name={name}
      />
    );
  }
  return (
    <IdentifierInput
      name={name}
      node={node}
      value={value}
      onChange={onChange}
    >
      {children}
    </IdentifierInput>
  );
}

function SelectEnum(
  { name, node, value, onChange }: NodeProps<EnumNodeParams>
): JSX.Element {
  const id = useId(name);
  const handleChange = useCallback(
    (c: OnChangeValue<Option, false>) => onChange(name, c!.value),
    [name, onChange]
  );
  let selected: Option | undefined;
  if (typeof value === 'string') {
    const strValue = stripDefaultNamespace(value);
    selected = node.values.find(o => o.value === strValue);
  } else {
    selected = node.default;
  }
  return (
    <Labelized className="form-group" id={id} name={name}>
      <Select
        options={node.values}
        value={selected || null}
        onChange={handleChange}
        inputId={id}
      />
    </Labelized>
  );
}

function StringInput(
  { name, node, value, onChange }: NodeProps<StringNodeParams>
): JSX.Element {
  const id = useId(name);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(name, e.target.value);
  return (
    <Labelized id={id} name={name}>
      <input
        type="text"
        id={id}
        value={String(value || node.default)}
        onChange={handleChange}
      />
    </Labelized>
  );
}

function TagInput(props: NodeProps<IdentifierNodeParams>): JSX.Element {
  const asArray = useContext(GameContext).worldgen!.packFormat >= 9;
  if (asArray && Array.isArray(props.value)) {
    return IdentifierMultipleInput(props);
  }
  return IdentifierInput({ tag: asArray, ...props });
}

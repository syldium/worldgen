import { memo, useCallback, useContext, useMemo } from 'react';
import {
  isNode,
  ModelNode,
  NodeBase,
  NodeType,
  providePreset
} from '../model/node/Node';
import { ColorNodeParams, NumberNodeParams } from '../model/node/IntNode';
import {
  defaultNamespace,
  isStringArray,
  labelize,
  labelizeOption,
  stripDefaultNamespace
} from '../util/LabelHelper';
import { useId } from '../hook/useId';
import { NodeErrorBoundary } from './ui/ErrorBoundary';
import { EnumNodeParams } from '../model/node/EnumNode';
import Select, { Option } from './ui/Select';
import { BoolNodeParams } from '../model/node/BoolNode';
import { ObjectNodeParams, OptionalNodeParams } from '../model/node/ObjectNode';
import { IdentifierNodeParams } from '../model/node/ResourceNode';
import { useOptions } from '../hook/useOptions';
import { SwitchNodeParams } from '../model/node/SwitchNode';
import { BlockState, BlockStateValue } from './resource/BlockState';
import { EitherNodeParams } from '../model/node/EitherNode';
import { mayInline, ObjectOrNodeModel } from '../model/Model';
import { GameContext } from '../context/GameRegistry';
import { ListNodeParams } from '../model/node/ListNode';
import { DataType, useCrudProps } from '../hook/useCrud';
import { Obj } from '../util/DomHelper';
import {
  BlockStateProvider,
  StateProvider
} from './resource/BlockStateProvider';
import { ParticuleEffect } from './resource/ParticuleEffect';
import { hexColorToInteger, intColorToHex } from '../util/ColorHelper';
import { Button } from './ui/Button';
import { ViewerElement } from './viewer/Viewers';
import { MapNodeParams } from '../model/node/MapNode';
import { useToggle } from '../hook/useToggle';
import { NumberInput } from './ui/NumberInput';
import { Labelized } from './ui/Labelized';
import type { OnChangeValue } from 'react-select';
import type {
  ChangeEvent,
  FunctionComponent,
  ReactElement,
  ReactNode
} from 'react';

interface ModelViewProps {
  children?: ReactNode;
  model: ObjectOrNodeModel;
  name: string;
  value: Record<string, unknown>;
  onChange: (val: Record<string, unknown>) => void;
  isObject?: boolean;
}

export function ModelView({
  children,
  model,
  name,
  value,
  onChange,
  isObject
}: ModelViewProps): JSX.Element {
  if (isNode(model)) {
    return (
      <NodeElement
        node={model}
        name={name}
        value={value}
        onChange={onChange}
        isObject={isObject}
      >
        {children}
      </NodeElement>
    );
  }
  return <ObjectView obj={model} value={value} onChange={onChange} />;
}

interface ObjectViewProps {
  obj: Record<string, ModelNode>;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
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
        value={value}
        isObject={true}
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
        inline.length > 1 ? (
          <div className="form-row" key={inline[0]!.key}>
            {inline}
          </div>
        ) : (
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
      inline.length > 1 ? (
        <div className="form-row" key={inline[0]!.key}>
          {inline}
        </div>
      ) : (
        inline[0]
      )
    );
  }
  return <>{nodes}</>;
}

interface NodeElementProps {
  children?: ReactNode;
  name: string;
  node: ModelNode;
  value: Record<string, unknown>;
  onChange: (val: Record<string, unknown>) => void;
  isObject?: boolean;
}

function _NodeElement({
  children,
  name,
  node,
  value,
  onChange,
  isObject
}: NodeElementProps): JSX.Element {
  const El = findNodeElement(node);
  if (El === null) {
    console.warn("Unknown node for '" + name + "' field!", node);
    return (
      <p>
        Unknown node for <code>{name}</code>!
      </p>
    );
  }
  return (
    <NodeErrorBoundary name={name} key={name}>
      <El
        name={name}
        node={node}
        value={value}
        onChange={onChange}
        isObject={isObject}
      >
        {children}
      </El>
    </NodeErrorBoundary>
  );
}
export const NodeElement = memo(_NodeElement);

function findNodeElement(
  node: ModelNode
): null | FunctionComponent<NodeProps<any>> {
  switch (node.type) {
    case 'bool':
      return CheckboxInput;
    case 'color':
      return ColorInput;
    case 'int':
    case 'float':
      return NumberNodeInput;
    case 'either':
      return EitherInput;
    case 'enum':
      return SelectInput;
    case 'identifier':
      return ResourceSelectInput;
    case 'list':
      return ListValues;
    case 'map':
      return MapInput;
    case 'object':
      return ObjectInput;
    case 'optional':
      return OptionalInput;
    case 'resource':
      return ResourceInput;
    case 'switch':
      return SelectSwitch;
    default:
      return null;
  }
}

interface NodeProps<T extends NodeBase<NodeType>> {
  children?: ReactNode;
  name: string;
  node: T;
  value: Record<string, unknown>;
  onChange: (val: Record<string, unknown>) => void;
  isObject?: boolean;
}

function CheckboxInput({
  name,
  node,
  value,
  onChange
}: NodeProps<BoolNodeParams>) {
  const id = useId(name);
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onChange({ [name]: event.target.checked }),
    [name, onChange]
  );
  const booleanValue: boolean =
    typeof value[name] === 'boolean'
      ? (value[name] as boolean)
      : node.default || false;
  return (
    <Labelized className="form-group" id={id} name={name}>
      <input
        type="checkbox"
        className="checkbox"
        id={id}
        checked={booleanValue}
        onChange={handleChange}
      />
    </Labelized>
  );
}

function ColorInput({
  name,
  node,
  value,
  onChange
}: NodeProps<ColorNodeParams>) {
  const id = useId(name);
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onChange({ [name]: hexColorToInteger(event.target.value) }),
    [name, onChange]
  );
  const colorValue: number =
    typeof value[name] === 'number'
      ? (value[name] as number)
      : node.default || 0;
  return (
    <Labelized className="form-group" id={id} name={name}>
      <input
        id={id}
        type="color"
        value={intColorToHex(colorValue)}
        onChange={handleChange}
      />
    </Labelized>
  );
}

function EitherInput({
  children,
  name,
  node,
  value,
  onChange,
  isObject
}: NodeProps<EitherNodeParams>) {
  const i = Math.max(node.findCurrentIndex(value[name]), 0);
  return (
    <fieldset>
      <legend>{labelize(name)}</legend>
      <ModelView
        model={node.nodes[i]}
        name={name}
        value={value}
        onChange={onChange}
        isObject={isObject}
      >
        {children}
      </ModelView>
    </fieldset>
  );
}

function ListValues({
  name,
  node,
  value,
  onChange
}: NodeProps<ListNodeParams>) {
  const absent = !(name in value);
  if (
    (node.of.type === 'resource' || node.of.type === 'identifier') &&
    (absent || Array.isArray(value[name])) &&
    (absent || isStringArray(value[name] as unknown[])) &&
    node.of.registry !== 'block_state'
  ) {
    return (
      <ResourceSelectMultipleInput
        name={name}
        node={node.of}
        value={value}
        onChange={onChange}
      />
    );
  }
  return <ListCrud name={name} node={node} value={value} onChange={onChange} />;
}

function ListCrud({ name, node, value, onChange }: NodeProps<ListNodeParams>) {
  const handleValuesChange = useCallback(
    (values) => onChange({ [name]: values }),
    [name, onChange]
  );
  const list = value[name] as Obj[];
  const initial = useCallback<() => DataType>(
    () => providePreset(node.of),
    [node.of]
  );
  const { elements, create, update, remove } = useCrudProps<DataType>(
    handleValuesChange,
    list,
    initial
  );
  const [visible, setVisible] = useToggle(
    elements.length < 3 || name === 'features'
  );
  const handleChange = useCallback(
    function (values: Record<string, unknown>) {
      const index = parseInt(Object.keys(values)[0]);
      update(values[index] as DataType, index);
    },
    [update]
  );
  const El: FunctionComponent<NodeProps<ModelNode>> = node.weighted
    ? WeightedValue
    : NodeElement;
  return (
    <div className="node-list">
      <div className="toggle-label">
        {labelize(name)}
        {' (' + elements.length + ')'}
        <div className="btn-group">
          {(node.fixed < 0 || node.fixed > elements.length) && (
            <Button onClick={create}>Add</Button>
          )}
          {elements.length > 0 && (
            <Button cat="secondary" onClick={setVisible}>
              {visible ? 'Less' : 'More'}...
            </Button>
          )}
        </div>
      </div>
      <div className={mayInline(node.of) ? ' form-row' : ''}>
        {visible &&
          elements.map((element, i) => (
            <El
              key={i}
              name={i.toString()}
              node={node.of}
              value={list as Record<number, unknown>}
              onChange={handleChange}
            >
              <Button cat="danger" onClick={(e) => remove(i, e)}>
                Remove
              </Button>
            </El>
          ))}
      </div>
    </div>
  );
}

function WeightedValue({ name, node, value, onChange }: NodeProps<ModelNode>) {
  const weightId = useId(name);
  const val = value[name] as Obj;
  const weight = (val.weight as number) ?? 1;
  const handleDataChange = useCallback(
    (value: Obj) => onChange({ [name]: { ...value, weight } }),
    [name, onChange, weight]
  );
  const handleWeightChange = useCallback(
    function (event: ChangeEvent<HTMLInputElement>) {
      onChange({
        [name]: { data: val.data, weight: parseInt(event.target.value) }
      });
    },
    [name, onChange, val.data]
  );
  return (
    <NodeElement
      name="data"
      node={node}
      value={val}
      onChange={handleDataChange}
      isObject={true}
    >
      <label htmlFor={weightId}>Weight</label>:{' '}
      <input
        type="number"
        id={weightId}
        value={weight}
        onChange={handleWeightChange}
      />
    </NodeElement>
  );
}

function MapInput({ name, node, value, onChange }: NodeProps<MapNodeParams>) {
  const map = value[name] as Record<string, unknown>;
  const entries = useMemo(() => Object.entries(map), [map]);
  const handleKeyChange = useCallback(
    function (value: Record<string, string>) {
      const newMap = {};
      const [oldKey, newKey] = Object.entries(value)[0];
      delete Object.assign(newMap, map, { [newKey]: map[oldKey] })[oldKey];
      onChange({ [name]: newMap });
    },
    [map, name, onChange]
  );
  const handleValueChange = useCallback(
    (value: Record<string, unknown>) =>
      onChange({ [name]: { ...map, ...value } }),
    [map, name, onChange]
  );
  return (
    <>
      {entries.map(([key]) => {
        return (
          <fieldset key={key}>
            <legend>
              <ResourceSelectInput
                name={key}
                node={node.key}
                value={{ [key]: key }}
                onChange={
                  handleKeyChange as (value: Record<string, unknown>) => void
                }
              />
            </legend>
            <NodeElement
              name={key}
              node={node.value}
              value={map}
              onChange={handleValueChange}
            />
          </fieldset>
        );
      })}
    </>
  );
}

function NumberNodeInput({
  name,
  node,
  value,
  onChange
}: NodeProps<NumberNodeParams>) {
  const id = useId(name);
  const handleChange = useCallback(
    (value: number) => onChange({ [name]: value }),
    [name, onChange]
  );
  const numberValue: number =
    typeof value[name] === 'number'
      ? (value[name] as number)
      : node.default || 0;

  return (
    <Labelized className="form-group flex" id={id} name={name}>
      <NumberInput
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

function ObjectInput({
  name,
  node,
  value,
  children,
  onChange
}: NodeProps<ObjectNodeParams>) {
  const objectValue = value[name] as Record<string, unknown>;
  const handleChange = useCallback(
    function (val) {
      onChange({ [name]: { ...objectValue, ...val } });
    },
    [name, onChange, objectValue]
  );
  const view = (
    <ObjectView obj={node.records} value={objectValue} onChange={handleChange}>
      {children}
    </ObjectView>
  );
  if (Array.isArray(value)) {
    return view;
  }
  return (
    <fieldset>
      <legend>{labelize(name)}</legend>
      <ObjectView
        obj={node.records}
        value={objectValue}
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
  const id = useId(name);
  const handleCheckboxChange = useCallback(
    function (event: ChangeEvent<HTMLInputElement>) {
      if (event.target.checked) {
        onChange({ [name]: providePreset(node.node) });
      } else {
        onChange({ [name]: undefined });
      }
    },
    [name, node.node, onChange]
  );
  const isPresent = value[name] != null;
  return (
    <div className={isPresent ? 'flex' : 'form-group flex'}>
      {!isPresent && (
        <div>
          <label htmlFor={id}>{labelize(name)}</label>:
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

function SelectInput({
  name,
  node,
  value,
  onChange
}: NodeProps<EnumNodeParams>) {
  const id = useId(name);
  const handleChange = useCallback(
    function (option: OnChangeValue<Option, false>): void {
      if (option?.value) {
        onChange({ [name]: option.value });
      }
    },
    [name, onChange]
  );
  const stringValue: null | string =
    typeof value[name] === 'string' ? (value[name] as string) : null;
  const selectedOption = useMemo(
    () =>
      node.values.find((option) => option.value === stringValue) ||
      node.default ||
      null,
    [node.default, node.values, stringValue]
  );
  return (
    <Labelized className="form-group" id={id} name={name}>
      <Select
        options={node.values}
        value={selectedOption}
        onChange={handleChange}
        inputId={id}
      />
    </Labelized>
  );
}

function ResourceSelectInput({
  name,
  node,
  value,
  onChange,
  children
}: NodeProps<IdentifierNodeParams>) {
  const id = useId(name);
  const handleChange = useCallback(
    function (option: OnChangeValue<Option, false>): void {
      if (option?.value) {
        onChange({ [name]: option.value });
      }
    },
    [name, onChange]
  );
  const stringValue: null | string =
    typeof value[name] === 'string' ? (value[name] as string) : null;
  const options = useOptions(node.registry);
  const selected = useMemo(
    () => options.find((o) => o.value === stringValue) || null,
    [options, stringValue]
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

function ResourceSelectMultipleInput({
  name,
  node,
  value,
  onChange
}: NodeProps<IdentifierNodeParams>) {
  const id = useId(name);
  const options = useOptions(node.registry);
  const selected: Option[] = useMemo(
    function () {
      const values = ((value[name] || []) as string[]).map((val: string) =>
        defaultNamespace(val)
      );
      return options.filter((option) => values.includes(option.value));
    },
    [name, options, value]
  );
  const handleChange = useCallback(
    function (options: OnChangeValue<Option, true>): void {
      onChange({
        [name]: options === null ? [] : options.map((option) => option.value)
      });
    },
    [name, onChange]
  );
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

function ResourceInput({
  name,
  node,
  value,
  onChange,
  children
}: NodeProps<IdentifierNodeParams>) {
  const { worldgen } = useContext(GameContext);
  const resource = value[name];

  const handleChange = useCallback(
    (value: Record<string, unknown>) => onChange({ [name]: value }),
    [name, onChange]
  );

  if (
    resource !== null &&
    typeof resource === 'object' &&
    worldgen.isRegistered(node.registry)
  ) {
    const model = worldgen.worldgen[node.registry].model.node;
    const el = (
      <ModelView
        model={model}
        name={name}
        value={resource as Record<string, unknown>}
        onChange={handleChange}
      >
        {children}
      </ModelView>
    );
    const viewers = ViewerElement(
      node.registry,
      resource as Record<string, unknown>
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
        value={value[name] as BlockStateValue}
        onChange={onChange}
      >
        {children}
      </BlockState>
    );
  } else if (node.registry === 'block_state_provider') {
    return (
      <BlockStateProvider
        name={name}
        value={value[name] as StateProvider}
        onChange={onChange}
      />
    );
  } else if (node.registry === 'biome_particle') {
    return (
      <ParticuleEffect
        particle={value[name] as Record<string, any>}
        onChange={onChange}
        name={name}
      />
    );
  }
  return (
    <ResourceSelectInput
      name={name}
      node={node}
      value={value}
      onChange={onChange}
    >
      {children}
    </ResourceSelectInput>
  );
}

interface SelectSwitchProps extends NodeProps<SwitchNodeParams> {
  onTypeChange?: (type: string) => void;
}
export function SelectSwitch({
  children,
  name,
  node,
  value,
  onChange,
  onTypeChange,
  isObject = false
}: SelectSwitchProps): JSX.Element {
  const options: Option[] = useMemo(
    () => Object.keys(node.values).map(labelizeOption),
    [node.values]
  );
  const val = useMemo(
    () => (isObject ? (value[name] as Record<string, unknown>) : value) || {},
    [isObject, name, value]
  );
  const content = Array.isArray(val)
    ? (val[name] as Record<string, unknown>)
    : val;
  const type = stripDefaultNamespace(
    (content[node.typeField] as string) ?? options[0].value
  );
  const interOnChange = useCallback(
    function (value: Record<string, unknown>) {
      if (isObject || Array.isArray(val)) {
        onChange({ [name]: value });
      } else {
        onChange(value);
      }
    },
    [isObject, name, onChange, val]
  );
  const handleConfigChange = useCallback(
    function (config) {
      if (node.config === null) {
        interOnChange({ ...content, ...config });
      } else {
        const configuration =
          node.config in config ? config[node.config] : config;
        interOnChange({
          ...val,
          [node.config]: {
            ...(val[node.config] as Record<string, unknown>),
            ...configuration
          }
        });
      }
    },
    [content, interOnChange, node.config, val]
  );
  const handleTypeChange = useCallback(
    function (option: Option | null) {
      if (!option) return;
      const type = option.value;
      const strippedType = stripDefaultNamespace(type);
      if (onTypeChange) {
        onTypeChange(strippedType);
      } else {
        const p = node.preset[strippedType];
        if (typeof p === 'string') {
          throw Error('Unsupported vanilla resource loading!');
        }
        interOnChange(
          p ? { ...(val[name] as Obj), ...p } : { [node.typeField]: type }
        );
      }
    },
    [interOnChange, name, node.preset, node.typeField, onTypeChange, val]
  );
  const typeWithNamespace = defaultNamespace(type);
  const schema = node.values[type];
  const selected: Option | null = useMemo(
    () => options.find((o) => o.value === typeWithNamespace) || null,
    [options, typeWithNamespace]
  );

  return (
    <fieldset>
      <legend className="flex">
        <div className="full-width">
          <Select
            options={options}
            value={selected}
            onChange={handleTypeChange}
          />
        </div>
        {children}
      </legend>
      {schema && (
        <ModelView
          model={schema}
          name={node.config || name}
          value={
            node.config === null ||
            (isNode(schema) && schema.type === 'resource')
              ? content
              : (val[node.config] as Record<string, unknown>)
          }
          onChange={handleConfigChange}
        />
      )}
    </fieldset>
  );
}

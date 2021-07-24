import React, { ChangeEvent, useCallback, useContext, useMemo } from 'react';
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
import useId from '@accessible/use-id';
import { NodeErrorBoundary } from './ui/ErrorBoundary';
import { EnumNodeParams } from '../model/node/EnumNode';
import { ValueType } from 'react-select';
import Select, { Option } from './ui/Select';
import { BoolNodeParams } from '../model/node/BoolNode';
import { ObjectNodeParams, OptionalNodeParams } from '../model/node/ObjectNode';
import { IdentifierNodeParams } from '../model/node/ResourceNode';
import { useOptions } from '../hook/useOptions';
import { SwitchNodeParams } from '../model/node/SwitchNode';
import { BlockState, BlockStateValue } from './resource/BlockState';
import { EitherNodeParams } from '../model/node/EitherNode';
import { ObjectOrNodeModel } from '../model/Model';
import { GameContext } from '../context/GameRegistry';
import { ListNodeParams } from '../model/node/ListNode';
import { DataType, useCrudProps } from '../hook/useCrud';
import { Obj } from '../util/DomHelper';
import {
  BlockStateProvider,
  StateProvider
} from './resource/BlockStateProvider';
import { hexColorToInteger, intColorToHex } from '../util/ColorHelper';
import { Button } from './ui/Button';
import { ViewerElement } from './viewer/Viewers';
import { MapNodeParams } from '../model/node/MapNode';

interface ModelViewProps {
  model: ObjectOrNodeModel;
  name: string;
  value: Record<string, unknown>;
  onChange: (val: Record<string, unknown>) => void;
  isObject?: boolean;
}

export function ModelView({
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
      />
    );
  } else {
    return (
      <fieldset>
        {Object.entries(model).map(([name, node]) => (
          <NodeElement
            key={name}
            node={node}
            name={name}
            value={value}
            isObject={true}
            onChange={onChange}
          />
        ))}
      </fieldset>
    );
  }
}

interface NodeElementProps {
  name: string;
  node: ModelNode;
  value: Record<string, unknown>;
  onChange: (val: Record<string, unknown>) => void;
  isObject?: boolean;
}

function _NodeElement({
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
      />
    </NodeErrorBoundary>
  );
}
export const NodeElement = React.memo(_NodeElement);

function findNodeElement(
  node: ModelNode
): null | React.FunctionComponent<NodeProps<any>> {
  switch (node.type) {
    case 'bool':
      return CheckboxInput;
    case 'color':
      return ColorInput;
    case 'int':
    case 'float':
      return NumberInput;
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
  const id = useId(null, name);
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
    <div className="form-group">
      <label htmlFor={id}>{labelize(name)}</label> :
      <input
        type="checkbox"
        className="checkbox"
        id={id}
        checked={booleanValue}
        onChange={handleChange}
      />
    </div>
  );
}

function ColorInput({
  name,
  node,
  value,
  onChange
}: NodeProps<ColorNodeParams>) {
  const id = useId(null, name);
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
    <div className="form-group">
      <label htmlFor={id}>{labelize(name)}</label> :
      <input
        id={id}
        type="color"
        value={intColorToHex(colorValue)}
        onChange={handleChange}
      />
    </div>
  );
}

function EitherInput({
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
      />
    </fieldset>
  );
}

function ListValues({
  name,
  node,
  value,
  onChange
}: NodeProps<ListNodeParams<ModelNode>>) {
  if (
    (node.of.type === 'resource' || node.of.type === 'identifier') &&
    Array.isArray(value[name]) &&
    isStringArray(value[name] as unknown[]) &&
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

function ListCrud({
  name,
  node,
  value,
  onChange
}: NodeProps<ListNodeParams<ModelNode>>) {
  const handleValuesChange = useCallback(
    (values) => onChange({ [name]: values }),
    [name, onChange]
  );
  const list = value[name] as Obj[];
  const initial = useCallback<() => DataType>(
    () => providePreset(node.of),
    [node.of]
  );
  const { elements, create, update } = useCrudProps<DataType>(
    handleValuesChange,
    list,
    initial
  );
  const handleChange = useCallback(
    function (values: Record<string, unknown>) {
      const index = parseInt(Object.keys(values)[0]);
      update(values[index] as DataType, index);
    },
    [update]
  );
  return (
    <fieldset>
      <legend>
        {labelize(name)} <Button onClick={create}>Add</Button>
      </legend>
      {elements.map((element, i) => (
        <NodeElement
          key={i}
          name={i.toString()}
          node={node.of}
          value={list as Record<number, unknown>}
          onChange={handleChange}
        />
      ))}
    </fieldset>
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

function NumberInput({
  name,
  node,
  value,
  onChange
}: NodeProps<NumberNodeParams>) {
  const id = useId(null, name);
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onChange({ [name]: parseFloat(event.target.value) }),
    [name, onChange]
  );
  const step = node.step > 0.1 ? node.step : 'any';
  const numberValue: number =
    typeof value[name] === 'number'
      ? (value[name] as number)
      : node.default || 0;

  return (
    <div className="form-group">
      <label htmlFor={id}>{labelize(name)}</label> :
      <input
        id={id}
        type="number"
        min={node.min}
        max={node.max}
        value={numberValue}
        step={step}
        onChange={handleChange}
      />
    </div>
  );
}

function ObjectInput({
  name,
  node,
  value,
  onChange
}: NodeProps<ObjectNodeParams>) {
  const objectValue = value[name] as Record<string, unknown>;
  const handleChange = useCallback(
    function (val) {
      onChange({ [name]: { ...objectValue, ...val } });
    },
    [name, onChange, objectValue]
  );

  return (
    <fieldset>
      {Object.entries(node.records).map(([name, node]) => (
        <NodeElement
          key={name}
          name={name}
          node={node}
          value={objectValue}
          onChange={handleChange}
        />
      ))}
    </fieldset>
  );
}

function OptionalInput({
  name,
  node,
  value,
  onChange
}: NodeProps<OptionalNodeParams>) {
  const id = useId(null, name);
  const handleCheckboxChange = useCallback(
    function (event: ChangeEvent<HTMLInputElement>) {
      if (event.target.checked) {
        onChange({ [name]: 0 });
      } else {
        onChange({ [name]: undefined });
      }
    },
    [name, onChange]
  );
  const isPresent = value[name] != null;
  return (
    <div className="form-group">
      <label htmlFor={id}>{labelize(name)}</label> :
      {isPresent && (
        <NodeElement
          name={name}
          node={node.node}
          value={value}
          onChange={onChange}
        />
      )}
      <input
        type="checkbox"
        id={id}
        checked={isPresent}
        onChange={handleCheckboxChange}
      />
    </div>
  );
}

function SelectInput({
  name,
  node,
  value,
  onChange
}: NodeProps<EnumNodeParams>) {
  const id = useId(null, name);
  const handleChange = useCallback(
    function (option: ValueType<Option, false>): void {
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
    <div className="form-group">
      <label htmlFor={id}>{labelize(name)}</label> :
      <Select
        options={node.values}
        value={selectedOption}
        onChange={handleChange}
        inputId={id}
      />
    </div>
  );
}

function ResourceSelectInput({
  name,
  node,
  value,
  onChange
}: NodeProps<IdentifierNodeParams>) {
  const id = useId(null, name);
  const handleChange = useCallback(
    function (option: ValueType<Option, false>): void {
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
    <div className="form-group">
      <label htmlFor={id}>{labelize(name)}</label> :
      <Select
        options={options}
        value={selected}
        onChange={handleChange}
        inputId={id}
      />
    </div>
  );
}

function ResourceSelectMultipleInput({
  name,
  node,
  value,
  onChange
}: NodeProps<IdentifierNodeParams>) {
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
    function (options: ValueType<Option, true>): void {
      onChange({
        [name]: options === null ? [] : options.map((option) => option.value)
      });
    },
    [name, onChange]
  );
  return (
    <Select
      options={options}
      value={selected}
      onChange={handleChange}
      isMulti={true}
    />
  );
}

function ResourceInput({
  name,
  node,
  value,
  onChange
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
      />
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
      />
    );
  } else if (node.registry === 'block_state_provider') {
    return (
      <BlockStateProvider
        name={name}
        value={value[name] as StateProvider}
        onChange={onChange}
      />
    );
  }
  return (
    <ResourceSelectInput
      name={name}
      node={node}
      value={value}
      onChange={onChange}
    />
  );
}

interface SelectSwitchProps extends NodeProps<SwitchNodeParams> {
  onTypeChange?: (type: string) => void;
}
export function SelectSwitch({
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
      <legend>
        <Select
          options={options}
          value={selected}
          onChange={handleTypeChange}
        />
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

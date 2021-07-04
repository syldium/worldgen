import React, { ChangeEvent, useCallback, useContext, useMemo } from 'react';
import {
  isNode,
  ModelNode,
  NodeBase,
  NodeType,
  providePreset
} from '../model/node/Node';
import { NumberNodeParams } from '../model/node/IntNode';
import {
  defaultNamespace,
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

interface ModelViewProps {
  model: ObjectOrNodeModel;
  name: string;
  value: Record<string, unknown>;
  onChange: (val: Record<string, unknown>) => void;
}

export function ModelView({
  model,
  name,
  value,
  onChange
}: ModelViewProps): JSX.Element {
  if (isNode(model)) {
    return (
      <NodeElement node={model} name={name} value={value} onChange={onChange} />
    );
  } else {
    return (
      <fieldset>
        {Object.entries(model).map(([name, codec]) => (
          <NodeElement
            key={name}
            node={codec}
            name={name}
            value={value}
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
}

export function NodeElement({
  name,
  node,
  value,
  onChange
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
      <El name={name} node={node} value={value} onChange={onChange} />
    </NodeErrorBoundary>
  );
}

function findNodeElement(
  node: ModelNode
): null | React.FunctionComponent<NodeProps<any>> {
  switch (node.type) {
    case 'bool':
      return CheckboxInput;
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
      return ListCrud;
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

function EitherInput({
  name,
  node,
  value,
  onChange
}: NodeProps<EitherNodeParams>) {
  const val = (node.nodes[0].type === 'either' ? value[name] : value) as Record<
    string,
    unknown
  >; // FIXME
  const i = Math.max(
    node.findCurrentIndex(name === 'lava_level' ? value[name] : val),
    0
  ); // FIXME
  return (
    <fieldset>
      <legend>{labelize(name)}</legend>
      <ModelView
        model={node.nodes[i]}
        name={name}
        value={val}
        onChange={onChange}
      />
    </fieldset>
  );
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
  const initial = useMemo(() => providePreset(node.of), [node.of]) as DataType;
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
        {labelize(name)} <button onClick={create}>Add</button>
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
    return (
      <ModelView
        model={model}
        name={name}
        value={resource as Record<string, unknown>}
        onChange={handleChange}
      />
    );
  } else if (node.registry !== 'block_state') {
    return (
      <ResourceSelectInput
        name={name}
        node={node}
        value={value}
        onChange={onChange}
      />
    );
  }
  return (
    <BlockState
      name={name}
      value={value[name] as BlockStateValue}
      onChange={onChange}
    />
  );
}

function SelectSwitch({
  name,
  node,
  value,
  onChange
}: NodeProps<SwitchNodeParams>) {
  const options: Option[] = useMemo(
    () => Object.keys(node.records).map(labelizeOption),
    [node.records]
  );
  const type = stripDefaultNamespace(
    (value.type as string) ?? options[0].value
  );
  const handleConfigChange = useCallback(
    function (config) {
      if (node.config === null) {
        onChange({ ...value, ...config });
      } else {
        onChange({
          type: value.type,
          [node.config]: {
            ...(value[node.config] as Record<string, unknown>),
            ...config[node.config]
          }
        });
      }
    },
    [node.config, onChange, value]
  );
  const handleTypeChange = useCallback(
    function (option: Option | null) {
      if (!option) return;
      const type = option.value;
      const strippedType = stripDefaultNamespace(type);
      onChange(node.preset[strippedType] || { type });
    },
    [node.preset, onChange]
  );
  const typeWithNamespace = defaultNamespace(type);
  const schema = node.records[type];
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
            (isNode(schema) && schema.type === 'resource') // FIXME
              ? value
              : (value[node.config] as Record<string, unknown>)
          }
          onChange={handleConfigChange}
        />
      )}
    </fieldset>
  );
}

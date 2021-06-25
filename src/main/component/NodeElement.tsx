import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { ModelNode, NodeBase, NodeType } from '../model/node/Node';
import { NumberNodeParams } from '../model/node/IntNode';
import { labelize } from '../util/LabelHelper';
import useId from '@accessible/use-id';
import { NodeErrorBoundary } from './ui/ErrorBoundary';
import { EnumNodeParams } from '../model/node/EnumNode';
import { ValueType } from 'react-select';
import Select, { Option } from './ui/Select';
import { BoolNodeParams } from '../model/node/BoolNode';
import { ObjectNodeParams, OptionalNodeParams } from '../model/node/ObjectNode';
import { IdentifierNodeParams } from '../model/node/ResourceNode';
import { useOptions } from '../hook/useOptions';

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
    return <p>Unknown node for {name}!</p>;
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
    case 'enum':
      return SelectInput;
    case 'identifier':
      return ResourceSelectInput;
    case 'object':
      return ObjectInput;
    case 'optional':
      return OptionalInput;
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
  const step = node.type === 'int' ? node.step : 0.01;
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

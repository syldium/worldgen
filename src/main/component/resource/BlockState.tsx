import React, { ChangeEvent, useCallback, useContext } from 'react';
import Select, { CreatableSelect, Option } from '../ui/Select';
import { areConsecutiveIntegers } from '../../util/MathHelper';
import { NumberInput } from '../ui/NumberInput';
import { defaultNamespace, isValidNamespacedKey } from '../../util/LabelHelper';
import { GameContext } from '../../context/GameRegistry';
import { DEFAULT_BLOCK_STATE } from '../../model/Registry';

interface BlockStateProps {
  name: string;
  options?: Option[];
  value?: BlockStateValue;
  onChange: (state: Record<string, BlockStateValue>) => void;
  children?: React.ReactNode;
  inputId?: string;
}

export interface BlockStateValue {
  Name: string;
  Properties?: Properties;
}

/**
 * Represent a block and data form.
 *
 * @param name The block field name, used to forward information in the onChange
 * @param options A predefined list of options to use, otherwise taken from the context
 * @param value The actual block state value
 * @param onChange A change handler where the argument is an object with only the name as key
 * @param children Some elements to place to the right of the select field
 * @param inputId The input id and name for the select
 */
export function BlockState({
  name,
  options,
  value = { Name: 'minecraft:stone' },
  onChange,
  children,
  inputId
}: BlockStateProps): JSX.Element {
  const context = useContext(GameContext);
  const states = context.blockStates;

  const handleTypeChange = useCallback(
    function (option: Option | null) {
      if (!option) return;
      const Name = option.value;
      const block = states[Name];
      const Properties = (block ?? DEFAULT_BLOCK_STATE).default;
      if (Object.keys(Properties).length) {
        onChange({ [name]: { Name, Properties } });
      } else {
        onChange({ [name]: { Name } });
      }
    },
    [name, onChange, states]
  );

  const blocks = options || context.registries.block.options;

  const handlePropertiesChange = useCallback(
    (Properties: Properties) =>
      onChange({ [name]: { Name: value.Name, Properties } }),
    [name, onChange, value.Name]
  );

  const isValidNewOption = useCallback(
    (string: string) =>
      string.indexOf(':') > 0 &&
      isValidNamespacedKey(string) &&
      !blocks.some((o) => o.value === string),
    [blocks]
  );

  const handleOptionCreation = useCallback(
    function (Name: string) {
      context.blockStates = {
        ...context.blockStates,
        [Name]: DEFAULT_BLOCK_STATE
      };
      onChange({ [name]: { Name } });
    },
    [context, name, onChange]
  );

  const blockName = value ? defaultNamespace(value.Name) : null;
  const selected: Option | null =
    blocks.find((o) => o.value === blockName) || null;

  return (
    <div className="form-group">
      <div className="form-row">
        <div style={{ flexGrow: 1 }}>
          <CreatableSelect
            options={blocks}
            value={selected}
            onChange={handleTypeChange}
            isValidNewOption={isValidNewOption}
            onCreateOption={handleOptionCreation}
            name={inputId}
            inputId={inputId}
          />
        </div>
        {children}
      </div>
      {value.Properties && (
        <BlockStateProperties
          value={value.Properties}
          properties={(states[value.Name] || {}).properties}
          onChange={handlePropertiesChange}
        />
      )}
    </div>
  );
}

type Properties = Record<string, string>;

interface BlockStatePropertiesProps {
  value: Properties;
  properties: Record<string, string[]>;
  onChange: (properties: Properties) => void;
}
function BlockStateProperties({
  value,
  properties = {},
  onChange
}: BlockStatePropertiesProps) {
  const handleChange = useCallback(
    (property: string, state: string) =>
      onChange({ ...value, [property]: state }),
    [onChange, value]
  );

  return (
    <div className="form-group form-row">
      {Object.entries(properties).map(([property, values]) => {
        return (
          <div key={property}>
            <label>{property}</label> :
            <BlockStateProperty
              property={property}
              values={values}
              state={value[property]}
              onChange={handleChange}
            />
          </div>
        );
      })}
    </div>
  );
}

interface BlockStatePropertyProps {
  property: string;
  values: string[];
  state?: string;
  onChange: (property: string, state: string) => void;
}
function BlockStateProperty({
  property,
  values,
  state,
  onChange
}: BlockStatePropertyProps) {
  const handlePropertyChange = useCallback(
    function (option: Option | null) {
      if (option) {
        onChange(property, option.value);
      } else {
        onChange(property, values[0]);
      }
    },
    [onChange, property, values]
  );
  const handleCheckboxChange = useCallback(
    function (event: ChangeEvent<HTMLInputElement>) {
      onChange(property, event.target.checked.toString());
    },
    [onChange, property]
  );
  const handleNumberChange = useCallback(
    function (value: number) {
      onChange(property, value.toString());
    },
    [onChange, property]
  );

  if (values.length === 2 && (values[0] === 'true' || values[0] === 'false')) {
    return (
      <input
        type="checkbox"
        name={property}
        checked={state === 'true'}
        className="checkbox"
        onChange={handleCheckboxChange}
      />
    );
  } else if (areConsecutiveIntegers(values)) {
    return (
      <NumberInput
        name={property}
        value={parseInt(state || '0')}
        min={parseInt(values[0])}
        max={parseInt(values[values.length - 1])}
        onChange={handleNumberChange}
      />
    );
  } else {
    const options = values.map((value) => ({
      value,
      name: property,
      label: value
    }));
    const value = options.find((o) => o.value === state) || options[0];
    return (
      <div className="inbl">
        <Select
          options={options}
          value={value}
          onChange={handlePropertyChange}
        />
      </div>
    );
  }
}

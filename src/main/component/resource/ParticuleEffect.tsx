import React, { ChangeEvent, useCallback, useContext } from 'react';
import { GameContext } from '../../context/GameRegistry';
import { useId } from '../../hook/useId';
import {
  ColorTuple,
  hexColorToRgbTuple,
  rgbTupleToHex
} from '../../util/ColorHelper';
import {
  defaultNamespace,
  stripDefaultNamespace
} from '../../util/LabelHelper';
import { Labelized } from '../ui/Labelized';
import { NumberInput } from '../ui/NumberInput';
import { Select } from '../ui/Select';
import { BlockState, BlockStateValue } from './BlockState';

interface ParticuleEffectProps {
  name: string;
  particle: Record<string, any>;
  onChange: (value: Record<string, unknown>) => void;
}
const def = {};
export function ParticuleEffect({
  name,
  particle,
  onChange
}: ParticuleEffectProps): JSX.Element {
  const context = useContext(GameContext);
  const options = context.registries.particle_type.options;

  const data = particle.options || def;
  const type = data.type ?
    defaultNamespace(data.type) :
    'minecraft:crimson_spore';

  const handleTypeChange = useCallback(
    function (option) {
      let data = {};
      switch (stripDefaultNamespace(option.value)) {
        case 'block':
        case 'falling_dust':
          data = { Name: 'minecraft:sand' };
          break;
        case 'dust':
          data = { color: [1, 0, 0], scale: 1 };
          break;
        case 'dust_color_transition':
          data = { fromColor: [1, 0, 0], toColor: [0, 0, 1], scale: 1 };
          break;
        case 'vibration':
          data = {
            origin: [0, 30, 0],
            destination: { type: 'block' },
            arrival_in_ticks: 20
          };
      }
      onChange({
        [name]: {
          probability: particle.probability,
          options: { ...data, type: option.value }
        }
      });
    },
    [name, onChange, particle.probability]
  );
  const handleOptionsChange = useCallback(
    function (options) {
      onChange({ [name]: { ...particle, options: { ...data, ...options } } });
    },
    [data, name, onChange, particle]
  );

  return (
    <div className="form-group form-row" style={{ width: '100%' }}>
      <div style={{ flexGrow: 0.9, flexShrink: 1 }}>
        <Select
          options={options}
          value={options.find((o) => o.value === type)}
          onChange={handleTypeChange}
        />
      </div>
      {(type === 'minecraft:block' || type === 'minecraft:falling_dust') && (
        <BlockState
          name="options"
          value={data as BlockStateValue}
          onChange={(val) => handleOptionsChange(val.options)}
        />
      )}
      {type === 'minecraft:dust' && (
        <>
          <ColorVectorInput
            name="color"
            value={data}
            onChange={handleOptionsChange}
          />
          <ValueInput
            name="scale"
            value={data}
            onChange={handleOptionsChange}
          />
        </>
      )}
      {type === 'minecraft:dust_color_transition' && (
        <>
          <ColorVectorInput
            name="fromColor"
            value={data}
            onChange={handleOptionsChange}
          />
          <ColorVectorInput
            name="toColor"
            value={data}
            onChange={handleOptionsChange}
          />
          <ValueInput
            name="scale"
            value={data}
            onChange={handleOptionsChange}
          />
        </>
      )}
      <ValueInput
        name="probability"
        step={0.005}
        value={particle as Record<'probability', number>}
        onChange={(probability) =>
          onChange({ [name]: { options: data, ...probability } })}
      />
    </div>
  );
}

interface ScaleInputProps<T extends string> {
  name: T;
  step?: number;
  value: { [key in T]: number };
  onChange: (value: { [key in T]: number }) => void;
}
function ValueInput<T extends string>({
  name,
  step = 0.1,
  value,
  onChange
}: ScaleInputProps<T>) {
  const id = useId(name);
  return (
    <Labelized id={id} name={name} className="flex">
      <NumberInput
        id={id}
        value={value[name]}
        step={step}
        onChange={(value) =>
          onChange({ [name]: value } as { [key in T]: number })}
      />
    </Labelized>
  );
}

interface ColorVectorInputProps<T extends string> {
  name: T;
  value: { [key in T]: ColorTuple };
  onChange: (color: { [key in T]: ColorTuple }) => void;
}
function ColorVectorInput<T extends string>({
  name,
  value,
  onChange
}: ColorVectorInputProps<T>) {
  const id = useId(name);
  const color = value[name];
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ [name]: hexColorToRgbTuple(e.target.value) } as Record<T, any>);

  return (
    <Labelized id={id} name={name}>
      <input
        type="color"
        id={id}
        value={Array.isArray(color) && color.length === 3 ?
          rgbTupleToHex(color) :
          '#ff0000'}
        onChange={handleChange}
      />
    </Labelized>
  );
}

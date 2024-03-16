import { ChangeEventHandler, InputHTMLAttributes, ReactElement } from 'react';
import { INT_MAX_VALUE, INT_MIN_VALUE } from '../../util/MathHelper';

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>
{
  onChange: (value: number) => void;
  value: number;
  step?: number;
  min?: number;
  max?: number;
}
export function NumberInput({
  value,
  step = 1,
  min = INT_MIN_VALUE,
  max = INT_MAX_VALUE,
  size,
  onChange,
  ...props
}: NumberInputProps): ReactElement {
  const inputSize = size ?? Math.max(String(value).length, 3) + 1;
  const handleChange: ChangeEventHandler<HTMLInputElement> = function (event) {
    const input = event.target;
    onChange(input.valueAsNumber);
  };
  const stepValue = step < 1 ? 'any' : step;
  return (
    <input
      type="number"
      min={min}
      max={max}
      step={stepValue}
      size={inputSize}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
}

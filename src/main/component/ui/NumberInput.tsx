import {
  ChangeEventHandler,
  InputHTMLAttributes,
  MouseEvent,
  useEffect,
  useRef
} from 'react';
import { INT_MAX_VALUE, INT_MIN_VALUE } from '../../util/MathHelper';

const STEP_INTERVAL = 150;
const STEP_DELAY = 300;

// @ts-ignore
interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
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
  onChange,
  ...props
}: NumberInputProps): JSX.Element {
  const size = Math.max(String(value).length, 3) + 1;

  const ref = useRef<HTMLInputElement>(null);
  const handleChange: ChangeEventHandler<HTMLInputElement> = function (event) {
    const input = event.target;
    const number = parseFloat(input.value);
    if (isNaN(number)) {
      input.setCustomValidity('Not a number');
    } else {
      input.setCustomValidity('');
      onChange(number);
    }
  };
  const handleStep = function (up: boolean) {
    let number = value + (up ? step : -step);
    if (step < 1) {
      number = parseFloat(number.toPrecision(5));
    }
    if (number > max) {
      if (!up) {
        number = max;
      } else {
        return;
      }
    } else if (number < min) {
      if (up) {
        number = min;
      } else {
        return;
      }
    }
    ref.current!.setCustomValidity('');
    value = number;
    onChange(value);
  };

  const timeoutRef = useRef<number>();
  const handleMouseDown = function (event: MouseEvent) {
    event.preventDefault();

    const up = (event.target as HTMLButtonElement).classList.contains(
      'btn-plus'
    );
    handleStep(up);
    timeoutRef.current = window.setTimeout(() => {
      function loopStep() {
        handleStep(up);
        timeoutRef.current = window.setTimeout(loopStep, STEP_INTERVAL);
      }

      timeoutRef.current = window.setTimeout(loopStep, STEP_DELAY);
    }, STEP_DELAY);
  };

  const onStopStep = () => {
    clearTimeout(timeoutRef.current);
  };

  useEffect(() => onStopStep, []);

  const stepValue = step < 1 ? 'any' : step;

  if (import.meta.env.SSR) {
    return (
      <input
        type="number"
        defaultValue={value}
        min={min}
        max={max}
        step={stepValue}
        size={size}
      />
    );
  }

  return (
    <div className="number-input">
      <div className="number-wrapper">
        <input
          type="number"
          min={min}
          max={max}
          step={stepValue}
          size={size}
          value={value}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <div className="number-controls">
          <button
            className="btn-plus"
            onMouseUp={onStopStep}
            onMouseLeave={onStopStep}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.preventDefault()}
            aria-label="Increase value"
          />
          <button
            className="btn-minus"
            onMouseUp={onStopStep}
            onMouseLeave={onStopStep}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.preventDefault()}
            aria-label="Decrease value"
          />
        </div>
      </div>
    </div>
  );
}

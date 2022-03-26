import { AlertTriangle } from 'react-feather';
import type { OnChangeValue } from 'react-select/dist/declarations/src/types';
import Select, { Option } from '../ui/Select';

const title = 'Unknown reference found!';

interface SelectReferenceProps {
  options: readonly Option[];
  value: string;
  onChange: (option: OnChangeValue<Option, false>) => void;
  inputId: string;
}
export function SelectReference(
  { options, value, onChange, inputId }: SelectReferenceProps
) {
  const selected = options.find((o) => o.value === value) || null;
  return (
    <div className="flex">
      {!selected && (
        <div className="invalid" title={title}>
          <AlertTriangle />
        </div>
      )}
      <div className="tabs">
        <Select
          options={options}
          value={selected}
          onChange={onChange}
          inputId={inputId}
        />
      </div>
    </div>
  );
}

interface SelectReferencesProps {
  options: readonly Option[];
  value: readonly string[];
  onChange: (option: OnChangeValue<Option, true>) => void;
  inputId: string;
}
export function SelectReferences(
  { options, value, onChange, inputId }: SelectReferencesProps
) {
  const selected: Option[] = [];
  const invalid = new Set(value);
  for (const option of options) {
    if (invalid.delete(option.value)) {
      selected.push(option);
    }
  }
  return (
    <div className="flex">
      {!!invalid.size && (
        <div
          className="invalid"
          title={title}
          onClick={(e) => {
            e.preventDefault();
            window.confirm(
              'Delete references to ' + [...invalid].join(', ') + '?'
            ) && onChange(selected);
          }}
        >
          <AlertTriangle />
        </div>
      )}
      <div className="tabs">
        <Select
          options={options}
          value={selected}
          onChange={onChange}
          inputId={inputId}
          isMulti={true}
        />
      </div>
    </div>
  );
}

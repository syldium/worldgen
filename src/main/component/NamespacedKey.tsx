import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import type { ReactNode } from 'react';
import type { OnChangeValue } from 'react-select';
import { GameContext } from '../context/GameRegistry';
import { useOptions } from '../hook/useOptions';
import { useSelectAutosize } from '../hook/useSelectAutosize';
import { useToggle } from '../hook/useToggle';
import { Schema, WorldgenNames } from '../model/Registry';
import type { WorldgenRegistryKey } from '../model/RegistryKey';
import { Button } from './ui/Button';
import Select, { Option } from './ui/Select';

interface NamespacedKeyProps {
  children?: ReactNode;
  defaultReplace?: boolean;
  example?: string;
  registry: WorldgenRegistryKey;
  value?: string;
  onSelectLoad?: (model: Schema) => void;
  mayReplaceVanilla?: boolean;
}

export function NamespacedKey({
  children,
  defaultReplace = false,
  example,
  registry,
  value = '',
  onSelectLoad,
  mayReplaceVanilla = true
}: NamespacedKeyProps): JSX.Element {
  // To trigger form submit
  const hidden = useRef<HTMLInputElement>(null);

  // Final namespaced key
  const [key, setKey] = useState(value);
  const [fill, toggleFill] = useToggle(true);
  const [mayFill, setMayFill] = useToggle(value !== '');

  const options = useOptions(registry, false, true);
  const [replace, toggle] = useToggle(
    value === '' ? defaultReplace : options.some((o) => key === o.value)
  );

  const context = useContext(GameContext);
  const worldgen = context.registries!;
  const defaultNamespace = context.namespace;

  // Adjust value with default namespace if needed
  const handleKeyChange = useCallback(
    function (e: ChangeEvent<HTMLInputElement>) {
      const value = e.target.value.toLowerCase();
      if (value.includes(':')) {
        setKey(value);
      } else {
        setKey(defaultNamespace + ':' + value);
      }
    },
    [defaultNamespace, setKey]
  );

  // Remove the "minecraft:" part when changing mode
  const handleToggle = useCallback(
    function (e: MouseEvent<HTMLButtonElement>) {
      if (replace && key.startsWith('minecraft:')) {
        setKey((key) => defaultNamespace + ':' + key.split(':')[1]);
      }
      toggle(e);
    },
    [defaultNamespace, key, setKey, replace, toggle]
  );

  const handleReplaceTargetChange = useCallback(
    (selected: OnChangeValue<Option, false>) => {
      const key = selected!.value;
      setKey(key);
      setMayFill(true);
      if (fill && onSelectLoad) {
        worldgen
          .vanillaResource(registry, key)
          .then(onSelectLoad)
          .then(setMayFill)
          .catch(console.error);
      }
    },
    [worldgen, fill, onSelectLoad, registry, setMayFill]
  );

  // Allow form submit by pressing enter
  const handleKeyDown = useCallback(function (
    e: KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = hidden.current ? hidden.current.form : null;
      if (form !== null && form.checkValidity()) {
        form.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true })
        );
      }
    }
  }, []);

  // Displayed input value - trim namespace if default
  const inputValue = useMemo<string>(
    function () {
      if (key.startsWith(defaultNamespace + ':')) {
        return key.split(':')[1];
      }
      return key;
    },
    [defaultNamespace, key]
  );

  const handleFillToggle = useCallback(
    function (event: ChangeEvent<HTMLInputElement>) {
      if (event.target.checked && mayFill && onSelectLoad) {
        worldgen
          .vanillaResource(registry, key)
          .then(onSelectLoad)
          .then(setMayFill)
          .catch(console.error);
      }
      toggleFill(event);
    },
    [key, mayFill, onSelectLoad, registry, setMayFill, toggleFill, worldgen]
  );

  // Hidden input value - set to empty when nothing is selected (keeps the key from text mode)
  const hiddenInputValue = useMemo<string>(
    function () {
      if (replace && !options.some((o) => o.value === key)) {
        return '';
      }
      return key;
    },
    [key, options, replace]
  );

  // Adapt select width to its content
  const style = useSelectAutosize(options);

  return (
    <div className="namespaced-key">
      <h3>
        {value ? 'Edit ' : 'Create new '}
        {WorldgenNames[registry]}
        {children}
      </h3>
      <div className="form-group">
        <label htmlFor="key">{replace ? 'Replace' : 'Key'}</label> :&nbsp;
        {replace && (
          <div className="inbl" style={style}>
            <Select
              options={options}
              value={options.find((o) => key === o.value) || null}
              onChange={handleReplaceTargetChange}
              inputId="key"
            />
          </div>
        )}
        {!replace && (
          <input
            type="text"
            id="key"
            required
            pattern="^([a-z0-9_\-.]+:)?[a-z0-9_\-./]+$"
            placeholder={example ? `Example: ${example}` : ''}
            autoCapitalize="none"
            spellCheck="false"
            autoComplete="off"
            value={inputValue}
            onChange={handleKeyChange}
            onKeyPress={handleKeyDown}
          />
        )}
        <input
          type={replace ? 'text' : 'hidden'}
          name="key"
          value={hiddenInputValue}
          onChange={console.debug}
          ref={hidden}
          required
          tabIndex={-1}
          style={{ opacity: 0, height: 0, position: 'absolute' }}
        />
        {mayReplaceVanilla && (
          <Button className="mlm" onClick={handleToggle}>
            {replace ? 'Create a new one' : 'Replace vanilla'}
          </Button>
        )}
        {replace && (
          <>
            <input
              type="checkbox"
              className="checkbox mls"
              id="fill-values"
              checked={fill}
              onChange={handleFillToggle}
            />{' '}
            Fill with values
          </>
        )}
      </div>
    </div>
  );
}

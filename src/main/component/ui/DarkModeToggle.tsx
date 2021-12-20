import { useDarkMode } from '../../hook/useDarkMode';
import { Toggle } from './Toggle';

export function DarkModeToggle(): JSX.Element {
  const darkMode = useDarkMode();

  return (
    <div className="dark-mode-toggle" title="Dark mode toggle">
      <button type="button" onClick={darkMode.disable} tabIndex={-1}>
        ☀
      </button>
      <Toggle
        ariaLabel="Dark mode toggle"
        checked={darkMode.value}
        onChange={darkMode.toggle}
      />
      <button type="button" onClick={darkMode.enable} tabIndex={-1}>
        ☾
      </button>
    </div>
  );
}

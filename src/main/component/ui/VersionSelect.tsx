import { ChangeEvent, ReactElement, useContext } from 'react';
import { GameContext } from '../../context/GameRegistry';
import { GameVersion } from '../../context/GameVersion';

export function VersionSelect(): ReactElement {
  const context = useContext(GameContext);
  const handleChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => (context.version = event.target.value as GameVersion);
  return (
    <select
      value={context.version}
      onChange={handleChange}
      className="version-select"
      title="Game version"
    >
      <option value="1.19">1.19</option>
      <option value="1.19.4">1.19.4</option>
      <option value="1.20.4">1.20.4</option>
    </select>
  );
}

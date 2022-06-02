import { ChangeEvent, useContext } from 'react';
import { GameContext } from '../../context/GameRegistry';
import { GameVersion } from '../../context/GameVersion';

export function VersionSelect(): JSX.Element {
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
      <option value="1.17">1.17.1</option>
      <option value="1.18">1.18</option>
      <option value="1.18.2">1.18.2</option>
      <option value="1.19">1.19-rc1</option>
    </select>
  );
}

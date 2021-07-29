import { WorldgenNames, WorldgenRegistryKey } from '../../model/Registry';
import React, { MouseEvent, useContext } from 'react';
import { GameContext } from '../../context/GameRegistry';
import { stripDefaultNamespace } from '../../util/LabelHelper';
import { Link } from '../ui/Link';
import { Trash } from 'react-feather';
import { useForceUpdate } from '@pastable/use-force-update';

interface ResourceListProps {
  registryKey: WorldgenRegistryKey;
}
export function ResourceList({ registryKey }: ResourceListProps): JSX.Element {
  const { namespace, worldgen } = useContext(GameContext);
  const forceUpdate = useForceUpdate();
  const registry = worldgen.worldgen[registryKey];
  const entries = Object.keys(registry.entries);
  const name = WorldgenNames[registryKey];

  const handleRemove = function (e: MouseEvent<HTMLElement>, key: string) {
    e.preventDefault();
    if (window.confirm('Do you really want to remove this resource?')) {
      registry.remove(key);
      forceUpdate();
    }
  };

  return (
    <div className="card">
      <h5>
        <strong>{entries.length}</strong> {name}
        {entries.length > 1 && !name.endsWith('s') && 's'}
      </h5>
      <ul>
        {entries.map((key) => {
          const name = stripDefaultNamespace(key, namespace);
          return (
            <li key={key}>
              <a href="#remove" onClick={(e) => handleRemove(e, key)}>
                <i className="delete">
                  <Trash />
                </i>
              </a>
              <Link to={`/${registryKey}/${key}`}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}